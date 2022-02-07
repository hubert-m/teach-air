import React, {useEffect, useLayoutEffect, useState} from "react";
import {useHistory, useParams} from "react-router";
import SweetAlert from "react-bootstrap-sweetalert";
import Routes from "../../constants/Routes";
import useWindowSize from "../../helpers/useWindowSize";
import useInterval from "../../helpers/useInterval";
import {Badge} from "react-bootstrap";
import {checkAnswerOnQuestion, finishQuiz, getQuizById, getRandomQuestion, updateQuiz} from "../../helpers/Quiz";
import LoaderScreen from "../../components/LoaderScreen";
import {useBeforeunload} from 'react-beforeunload';
import MethodOfFinishQuiz from "../../constants/MethodOfFinishQuiz";
// import { usePageVisibility } from 'react-page-visibility';
// https://www.npmjs.com/package/react-page-visibility // moze sie przydac do obslugi konca quizu, kiedy odfocusujemy okno przegladarki

const Quiz = () => {
    let {id} = useParams();
    const history = useHistory();
    const windowSize = useWindowSize();
    // const isVisible = usePageVisibility()

    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const [showErrorAnswer, setShowErrorAnswer] = useState(false);
    const [showSuccessAnswer, setShowSuccessAnswer] = useState(false);

    const [ready, setReady] = useState(false);
    const [finish, setFinish] = useState(false);
    const [showAskFinishQuiz, setShowAskFinishQuiz] = useState(false);
    const [finishData, setFinishData] = useState({title: '', description: '', type: 'error'})
    const [preventCheat, setPreventCheat] = useState(0);
    const [quizData, setQuizData] = useState({
        seconds_for_answer: 10
    })
    const [timer, setTimer] = useState(10);

    const [correctAnswers, setCorrectAnswers] = useState(0)
    const [wrongAnswers, setWrongAnswers] = useState(0)
    const [stopTimerForLoading, setStopTimerForLoading] = useState(false);
    const [showInfoQuizHasNotQuestions, setShowInfoQuizHasNotQuestions] = useState(false);
    const [questionData, setQuestionData] = useState({
        id: '',
        question: '',
        answer_a: '',
        answer_b: '',
        answer_c: '',
        answer_d: ''
    })


    useInterval(() => {
        if (ready && !finish && quizData?.seconds_for_answer != 0 && !stopTimerForLoading) {
            if (timer == 0) {
                // console.log('skonczyl sie czas, bledna odpowiedz, nastepne pytanie')
                setStopTimerForLoading(true);
                getRandomQuestion(id).then((list) => {
                    setQuestionData(list)
                    setWrongAnswers(wrongAnswers + 1)
                    setTimer(quizData?.seconds_for_answer)
                    setStopTimerForLoading(false);
                }).catch((err) => {
                    setErrorMessage(err)
                    setShowError(true)
                })

            } else {
                setTimer(timer - 1);
            }
        }
    }, 1000);

    useEffect(() => {
        // wcześniejszy koniec w przypadku zmiany rozmiaru okna
        if (windowSize.width && ready) {
            if (preventCheat == 1) {
                setFinish(true)
                setFinishData({
                    title: 'Nie wolno oszukiwać :)',
                    description: 'Zmieniłeś rozmiar okna, więc quiz się zakończył. Wynik quizu został zapisany, a wiadomość została wysłana do wykładowcy',
                    type: 'error'
                })
                endQuiz(MethodOfFinishQuiz.RESIZE_WINDOW)
            }
            setPreventCheat((prevState) => {
                return prevState + 1
            });
        }
    }, [windowSize, ready]);

    useEffect(() => {
        // zaladowanie quizu od razu po zaladowaniu komponentu, w momencie akceptowania gotowosci do quizu
        setStopTimerForLoading(true);
        getQuizById(id).then(list => {
            setQuizData({
                ...list,
                seconds_for_answer: Number(list?.seconds_for_answer)
            });
            setTimer(Number(list?.seconds_for_answer))
        }).catch((err) => {
            setErrorMessage(err)
            setShowError(true)
        })

        // jesli opuscimy quiz przechodząc do innej podstrony
        // Wykonuje się nawet po poprawnym zakonczeniu quizu i w momencie, gdy jeszcze nie ma pytan - uniemozliwia kolejne podejscie do quizu przez zmiane route
        /*
        return function cleanup() {
            console.log(finish)
            console.log(ready)
            if (!finish && ready) {
                endQuiz(MethodOfFinishQuiz.CHANGE_ROUTE)
            }
        }
         */

    }, [])

    useEffect(() => {
        if (ready) {
            getRandomQuestion(id).then((list_question) => {
                setQuestionData(list_question)
                setStopTimerForLoading(false);
            }).catch((err) => {
                setErrorMessage(err)
                setShowError(true)
            })
        }
    }, [ready])

    useBeforeunload((event) => {
        /*
        if (ready) {
            event.preventDefault();
        }
         */
        // jesli opuscimy quiz zamykajac karte przeglądarki, albo całą przeglądarke
        endQuiz(MethodOfFinishQuiz.EXIT_BROWSER)
    });

    /*

    useEffect(() => {
        console.log(123)
    }, [isVisible])

     */


    const onVisibilityChange = () => {
        if (document.visibilityState == 'visible') {
            setFinish(true)
            setFinishData({
                title: 'Nie wolno oszukiwać :)',
                description: 'Zmieniłeś kartę przeglądarki, więc quiz się zakończył. Wynik quizu został zapisany, a wiadomość została wysłana do wykładowcy',
                type: 'error'
            })
            endQuiz(MethodOfFinishQuiz.CHANGE_TAB)
        }
    };

    useLayoutEffect(() => {
        if (ready) {
            document.addEventListener("visibilitychange", onVisibilityChange);
            return () => document.removeEventListener("visibilitychange", onVisibilityChange);
        }
    }, [ready]);


    // rozpoczecie quizu po zatwierdzeniu komuniktu
    const startQuiz = () => {
        if (quizData?.count_questions == "0") {
            setShowInfoQuizHasNotQuestions(true);
        } else {
            setReady(true)
        }
    }

    // w przypadku zakonczenia quizu z przicisku i potwierdzenia
    const handleSuccessFinishQuiz = () => {
        // setFinish(true)
        endQuiz(MethodOfFinishQuiz.SUCCESS)
        history.push(Routes.QUIZZES)
        // komunikat z wynikami ewentualnie przekierowanie na strone quizów
    }

    const endQuiz = (typeOfFinish) => {
        console.log("Strzał do API z wynikami quizu")
        // bez przekierowania
        // setFinish(true)
        finishQuiz({
            quiz_id: id,
            correct_answers: correctAnswers,
            wrong_answers: wrongAnswers,
            kind_of_finish: typeOfFinish
        }).then(() => {
            // bez przekierowania
        }).catch(() => {
        })
    }

    const handleCheckAnswer = (answer) => {
        setStopTimerForLoading(true);
        setTimer(Number(quizData?.seconds_for_answer))
        checkAnswerOnQuestion(questionData?.id, answer).then(() => {
            setCorrectAnswers(correctAnswers + 1)
            setShowSuccessAnswer(true)
            const timer = setTimeout(() => {
                getRandomQuestion(id).then((list_question) => {
                    setQuestionData(list_question)
                    setStopTimerForLoading(false);
                }).catch((err) => {
                    setErrorMessage(err)
                    setShowError(true)
                }).finally(() => {
                    setShowSuccessAnswer(false)
                    clearTimeout(timer)
                })
            }, 3000)

        }).catch((err) => {
            if (err == "Niepoprawna odpowiedz") {
                setWrongAnswers(wrongAnswers + 1)
                setShowErrorAnswer(true)
                const timer = setTimeout(() => {
                    getRandomQuestion(id).then((list_question) => {
                        setQuestionData(list_question)
                        setStopTimerForLoading(false);
                    }).catch((err) => {
                        setErrorMessage(err)
                        setShowError(true)
                    }).finally(() => {
                        setShowErrorAnswer(false)
                        clearTimeout(timer)
                    })
                }, 3000)

            } else {
                setErrorMessage(err)
                setShowError(true)
            }
        })
    }

    return (
        <>
            {ready && (
                <>
                    <div className="jumbotron" style={{marginTop: '50px'}}>
                        <div className="row">
                            <div className="col-lg-6">
                                <h1 className="display-7">{quizData?.title}</h1>
                                {quizData?.description != "" && (<p>{quizData?.description}</p>)}
                            </div>
                            <div className="col-lg-6">
                                <div className="quiz-absolute-right-corner">
                                    <button type="button" className="btn btn-danger"
                                            onClick={() => setShowAskFinishQuiz(true)}>Zakończ quiz
                                    </button>
                                    <div className="quiz-absolute-right-corner-scores">
                                        <p>Poprawnych <Badge bg="success">{correctAnswers}</Badge></p>
                                        <p>Niepoprawnych <Badge bg="danger">{wrongAnswers}</Badge></p>
                                        <p>Wszystkich <Badge bg="secondary">{correctAnswers + wrongAnswers}</Badge></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="my-4"/>
                    </div>
                    <div className="jumbotron" style={{marginTop: '50px'}}>
                        <div className="row">
                            <div className="col-6">
                                <h1 className="display-7">{questionData?.question}</h1>
                                {questionData?.description != "" && (<p>{questionData?.description}</p>)}
                            </div>
                            <div className="col-6" style={{textAlign: 'right'}}>
                                {quizData?.seconds_for_answer == 0 ? (<p>Bez limitu czasowego</p>) :
                                    timer <= 5 ? (
                                        <span className="badge bg-danger">{timer} sekund</span>
                                    ) : timer <= 10 ? (
                                        <span className="badge bg-warning">{timer} sekund</span>
                                    ) : (
                                        <span className="badge bg-secondary">{timer} sekund</span>
                                    )}
                            </div>
                        </div>
                        <hr className="my-4"/>
                    </div>
                    <div className="row answer-boxes-container">
                        <div className="col-lg-6" style={{padding: '10px', textAlign: 'center'}}>
                            <button type="button" className="btn btn-secondary"
                                    onClick={() => handleCheckAnswer("a")}>{questionData?.answer_a}
                            </button>
                        </div>
                        <div className="col-lg-6" style={{padding: '10px', textAlign: 'center'}}>
                            <button type="button" className="btn btn-secondary"
                                    onClick={() => handleCheckAnswer("b")}>{questionData?.answer_b}
                            </button>
                        </div>
                        <div className="col-lg-6" style={{padding: '10px', textAlign: 'center'}}>
                            <button type="button" className="btn btn-secondary"
                                    onClick={() => handleCheckAnswer("c")}>{questionData?.answer_c}
                            </button>
                        </div>
                        <div className="col-lg-6" style={{padding: '10px', textAlign: 'center'}}>
                            <button type="button" className="btn btn-secondary"
                                    onClick={() => handleCheckAnswer("d")}>{questionData?.answer_d}
                            </button>
                        </div>
                    </div>
                </>
            )}
            <SweetAlert
                warning
                showCancel
                show={!ready}
                title="Gotowy na wyzwanie?"
                confirmBtnText="Tak, jedziemy z koksem"
                cancelBtnText="Nie, jeszcze chwila"
                confirmBtnBsStyle="danger"
                cancelBtnBsStyle="secondary"
                onConfirm={() => startQuiz()}
                onCancel={() => {
                    history.push(Routes.QUIZZES);
                }}
            >
                Po wystartowaniu nie ma odwrotu, bez względu na wynik zostanie on wysłany do autora kursu
            </SweetAlert>
            <SweetAlert
                warning
                showCancel
                show={showAskFinishQuiz}
                title="Na pewno?"
                confirmBtnText="Tak"
                cancelBtnText="Nie, chcę dalej odpowiadać"
                confirmBtnBsStyle="danger"
                cancelBtnBsStyle="secondary"
                onConfirm={() => {
                    setShowAskFinishQuiz(false)
                    handleSuccessFinishQuiz()
                }}
                onCancel={() => {
                    setShowAskFinishQuiz(false);
                }}
            >
                Czy na pewno chcesz zakończyć quiz? Nie będziesz mógł przystąpić do niego ponownie, a aktualny wynik
                zostanie zapisany
            </SweetAlert>
            <SweetAlert
                // variant={finish?.type}
                error
                show={finish}
                title={finishData?.title}
                confirmBtnText="Ok"
                confirmBtnBsStyle="danger"
                onConfirm={() => {
                    history.push(Routes.QUIZZES);
                }}
            >
                {finishData?.description}
            </SweetAlert>
            <SweetAlert
                warning
                show={showInfoQuizHasNotQuestions}
                title="Quiz jeszcze nie jest gotowy"
                confirmBtnText="Ok"
                confirmBtnBsStyle="danger"
                onConfirm={() => {
                    history.push(Routes.QUIZZES);
                }}
            >
                Ten quiz jeszcze nie ma zdefiniowanych pytań. Wróć później :)
            </SweetAlert>
            <SweetAlert
                error
                show={showError}
                title="Coś poszło nie tak :("
                confirmBtnText="Już poprawiam, Sir!"
                confirmBtnBsStyle="danger"
                onConfirm={() => setShowError(false)}
            >
                {errorMessage}
            </SweetAlert>
            <SweetAlert
                success
                show={showSuccess}
                title="Hurraaa :)"
                onConfirm={() => setShowSuccess(false)}
            >
                {successMessage}
            </SweetAlert>
            <SweetAlert
                success
                show={showSuccessAnswer}
                title="Dobrze!"
                confirmBtnBsStyle="success"
                disabled={true}
                onConfirm={() => {}}
            >
                Poprawna odpowiedź! Złap oddech, za chwilę kolejne pytanie
            </SweetAlert>
            <SweetAlert
                error
                show={showErrorAnswer}
                title="źle!"
                confirmBtnBsStyle="danger"
                disabled={true}
                onConfirm={() => {}}
            >
                Błędna odpowiedź! Złap oddech, za chwilę kolejne pytanie
            </SweetAlert>
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default Quiz;