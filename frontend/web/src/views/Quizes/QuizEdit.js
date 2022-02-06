import {useHistory, useParams} from "react-router";
import {StatusUser} from "../../constants/StatusUser";
import Routes from "../../constants/Routes";
import React, {useEffect, useState} from "react";
import {getCoursesListForSelect} from "../../helpers/Course";
import {sortAsc, sortDesc} from "../../helpers/sort";
import {getFullTimeFromSeconds, getSecondsFromTime} from "../../helpers/secondsTime";
import SweetAlert from "react-bootstrap-sweetalert";
import LoaderScreen from "../../components/LoaderScreen";
import {
    addQuestion,
    deleteQuestion, getListOfFinishedUsers,
    getQuestionsList,
    getQuizById, giveAnotherChance,
    updateQuestion,
    updateQuiz
} from "../../helpers/Quiz";
import {Accordion} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {isEmpty} from "lodash";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {DefaultAvatarSrc} from "../../constants/DefaultAvatar";
import MethodOfFinishQuiz from "../../constants/MethodOfFinishQuiz";

const QuizEdit = ({userData}) => {
    let {id} = useParams();
    const history = useHistory();

    const initialQuestionField = {
        question: '',
        description: '',
        answer_a: '',
        answer_b: '',
        answer_c: '',
        answer_d: '',
        correct_answer: ''
    }

    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const [idQuestionToModify, setIdQuestionToModify] = useState(null);
    const [showAskAboutDeleteQuestion, setShowAskAboutDeleteQuestion] = useState(false);
    const [showFormAboutEditQuestion, setShowFormAboutEditQuestion] = useState(false);

    const [idUserToGiveAnotherChance, setIdUserToGiveAnotherChance] = useState(null);
    const [showAskAboutGiveAnotherChance, setShowAskAboutGiveAnotherChance] = useState(false);
    const [listOfFinishedUsers, setListOfFinishedUsers] = useState([]);

    const [showFormAddQuestion, setShowFormAddQuestion] = useState(false);

    const [listOfQuestions, setListOfQuestions] = useState([]);

    const [listOfCourses, setListOfCourses] = useState([]);
    const [data, setData] = useState({
        title: '',
        description: '',
        seconds_for_answer: '0:00',
        course_id: '',
    })

    const [dataQuestion, setDataQuestion] = useState(initialQuestionField)

    useEffect(() => {
        if (userData?.status != StatusUser.ADMIN && userData?.status != StatusUser.TEACHER) {
            history.push(Routes.QUIZZES);
        } else {
            getCoursesListForSelect().then(list => {
                sortAsc(list, "name");
                setListOfCourses(list)
            }).catch(() => {
            })

            getQuizById(id).then(list => {
                setData({
                    ...list,
                    seconds_for_answer: getFullTimeFromSeconds(Number(list?.seconds_for_answer)),
                    course_id: list?.course_id == 0 ? 0 : list?.course_id?.id
                });
            }).catch(() => {
            })

            getQuestionsList(id).then(list => {
                sortDesc(list, "id");
                setListOfQuestions(list)
            }).catch(() => {
            })

            getListOfFinishedUsers(id).then(list => {
                sortDesc(list, "id");
                setListOfFinishedUsers(list)
            }).catch(() => {
            })
        }
    }, [])

    const handleOnChange = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    const handleOnChangeQuestion = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setDataQuestion((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    const onBlur = (e) => {
        const value = e.target.value;
        const seconds = Math.max(0, getSecondsFromTime(value));

        const time = getFullTimeFromSeconds(seconds);
        const result = {};
        result[e.target.name] = time;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))
    };

    const handleEditQuiz = () => {
        setShowLoader(true);
        updateQuiz(id, {
            ...data,
            seconds_for_answer: getSecondsFromTime(data?.seconds_for_answer)
        }).then(() => {
            setSuccessMessage("Pomyślnie zaktualizowano quiz")
            setShowSuccess(true)
        }).catch((err) => {
            setErrorMessage(err)
            setShowError(true)
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handleAddQuestion = () => {
        setShowLoader(true);
        addQuestion(id, dataQuestion).then(() => {
            setShowFormAddQuestion(false)
            setDataQuestion(initialQuestionField)

            getQuestionsList(id).then(list => {
                sortDesc(list, "id");
                setListOfQuestions(list)
            }).catch(() => {
            })

            setSuccessMessage("Pomyślnie dodano pytanie do quizu")
            setShowSuccess(true)
        }).catch((err) => {
            setErrorMessage(err)
            setShowError(true)
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const signCorrectAnswer = (answer) => {
        setDataQuestion((prevState) => ({
            ...prevState,
            correct_answer: answer
        }))
    }

    const handleDeleteQuestion = () => {
        setShowLoader(true);
        deleteQuestion(idQuestionToModify).then(() => {
            getQuestionsList(id).then(list => {
                sortDesc(list, "id");
                setListOfQuestions(list)
            }).catch(() => {
            })
            setSuccessMessage("Pomyślnie usunięto pytanie")
            setShowSuccess(true)
        }).catch((err) => {
            setErrorMessage(err)
            setShowError(true)
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handleEditQuestion = () => {
        setShowLoader(true);
        updateQuestion(idQuestionToModify, dataQuestion).then(() => {
            setShowFormAboutEditQuestion(false)
            setDataQuestion(initialQuestionField)

            getQuestionsList(id).then(list => {
                sortDesc(list, "id");
                setListOfQuestions(list)
            }).catch(() => {
            })

            setSuccessMessage("Pomyślnie zaktualizowano pytanie")
            setShowSuccess(true)
        }).catch((err) => {
            setErrorMessage(err)
            setShowError(true)
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handleGiveAnotherChance = () => {
        const payload = {
            user_id: idUserToGiveAnotherChance,
            quiz_id: id
        }
        giveAnotherChance(payload).then(() => {
            getListOfFinishedUsers(id).then(list => {
                sortDesc(list, "id");
                setListOfFinishedUsers(list)
            }).catch(() => {
            })
        })
            .catch(err => {
                setErrorMessage(err)
                setShowError(true)
            })
    }

    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Edytuj Quiz</h1>
                <hr className="my-4"/>
            </div>
            <div className="row">
                <div className="col-lg-6">
                    <label htmlFor="title">Tytuł Quizu</label>
                    <input type="text" className="form-control" name="title"
                           placeholder="Tytuł quizu" value={data.title}
                           onChange={handleOnChange}/>
                    <label htmlFor="description">Opis quizu</label>
                    <textarea
                        className="form-control"
                        placeholder="Opis quizu *pole opcjonalne"
                        rows="3"
                        name="description"
                        value={data.description}
                        onChange={handleOnChange}/>
                </div>
                <div className="col-lg-6">
                    <label htmlFor="seconds_for_answer">Czas na udzielenie odpowiedzi <sub>(0:00 sekund oznacza bez
                        ograniczenia czasowego)</sub></label>
                    <input type="text" className="form-control" name="seconds_for_answer"
                           placeholder="Czas na odpowiedź" value={data.seconds_for_answer}
                           onChange={handleOnChange} onBlur={onBlur}/>
                    <label htmlFor="description">Kurs</label>
                    <select name="course_id" onChange={handleOnChange} value={data?.course_id}>
                        <option value="0">Brak kursu</option>
                        {listOfCourses.map(({id, name}) => (
                            <option value={id} key={id}>{name}</option>
                        ))}
                    </select>
                    <button type="button" className="btn btn-success" style={{marginTop: '15px'}}
                            onClick={() => handleEditQuiz()}>Zapisz zmiany
                    </button>
                </div>
            </div>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Pytania</h1>
                <button type="button" className="btn btn-success button-add-quiz" style={{color: "#FFF"}}
                        onClick={() => {
                            setDataQuestion(initialQuestionField)
                            setShowFormAddQuestion(true)
                        }}>
                    <FontAwesomeIcon
                        icon={faPlus}/>
                </button>
                <hr className="my-4"/>
            </div>
            <Accordion>
                {!isEmpty(listOfQuestions) ? listOfQuestions.map(({
                                                                      id,
                                                                      question,
                                                                      description,
                                                                      answer_a,
                                                                      answer_b,
                                                                      answer_c,
                                                                      answer_d,
                                                                      correct
                                                                  }) => (
                    <Accordion.Item key={id} eventKey={id}>
                        <Accordion.Header>#{id} - {question}</Accordion.Header>
                        <Accordion.Body>
                            {!isEmpty(description) && (<p><strong>Opis:</strong> {description}</p>)}
                            <p><strong>{correct == 'a' ? (<span style={{color: 'green'}}>Odpowiedź A:</span>) : (
                                <span>Odpowiedź A:</span>)}</strong> {answer_a}</p>
                            <p><strong>{correct == 'b' ? (<span style={{color: 'green'}}>Odpowiedź B:</span>) : (
                                <span>Odpowiedź B:</span>)}</strong> {answer_b}</p>
                            <p><strong>{correct == 'c' ? (<span style={{color: 'green'}}>Odpowiedź C:</span>) : (
                                <span>Odpowiedź C:</span>)}</strong> {answer_c}</p>
                            <p><strong>{correct == 'd' ? (<span style={{color: 'green'}}>Odpowiedź D:</span>) : (
                                <span>Odpowiedź D:</span>)}</strong> {answer_d}</p>
                            <div className="edit-question-right-bottom-cornet">
                                <button type="button" className="btn btn-warning"
                                        style={{color: "#FFF", marginLeft: "10px"}}
                                        onClick={() => {
                                            setIdQuestionToModify(id)
                                            setDataQuestion({
                                                question: question,
                                                description: description,
                                                answer_a: answer_a,
                                                answer_b: answer_b,
                                                answer_c: answer_c,
                                                answer_d: answer_d,
                                                correct_answer: correct
                                            })
                                            setShowFormAboutEditQuestion(true)
                                        }}>
                                    <FontAwesomeIcon
                                        icon={faEdit}/>
                                </button>
                                <button type="button" className="btn btn-danger"
                                        style={{color: "#FFF", marginLeft: "10px"}}
                                        onClick={() => {
                                            setIdQuestionToModify(id)
                                            setShowAskAboutDeleteQuestion(true)
                                        }}>
                                    <FontAwesomeIcon
                                        icon={faTrash}/>
                                </button>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>

                )) : (<p>Brak pytań dla tego quizu. Utwórz pierwsze</p>)}
            </Accordion>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Użytkownicy, którzy zakończyli quiz</h1>
                <hr className="my-4"/>
            </div>

            <div className="table-responsive">
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Rozwiązujący</th>
                        <th scope="col">Wynik</th>
                        <th scope="col">Sposób zakończenia quizu</th>
                        <th scope="col" style={{textAlign: 'center'}}>Daj kolejną szansę</th>
                    </tr>
                    </thead>
                    <tbody>

                    {!isEmpty(listOfFinishedUsers) ? listOfFinishedUsers.map(({ user_id, correct_answers, wrong_answers, kind_of_finish }) => (
                        <tr>
                            <td>
                                <div className="message-avatar">
                                    <img
                                        src={user_id?.profile_image || DefaultAvatarSrc[user_id?.sex_id] || DefaultAvatarSrc[0]}
                                        alt=""/>
                                </div>
                                {user_id?.name} {user_id?.lastname}</td>
                            <td>
                                <span
                                    style={{color: 'green'}}>{correct_answers}</span> / <span
                                style={{color: 'red'}}>{wrong_answers}</span>
                            </td>
                            <td>
                                {kind_of_finish == MethodOfFinishQuiz.RESIZE_WINDOW && (<p>Poprzez zmianę rozmiaru okna</p>)}
                                {kind_of_finish == MethodOfFinishQuiz.CHANGE_TAB && (<p>Poprzez zmianę karty przeglądarki</p>)}
                                {kind_of_finish == MethodOfFinishQuiz.SUCCESS && (<p>Pomyślnie, poprzez dobrowolne zakończenie przyciskiem</p>)}
                                {kind_of_finish == MethodOfFinishQuiz.CHANGE_ROUTE && (<p>Poprzez zmianę widoku wewnątrz aplikacji</p>)}
                                {kind_of_finish == MethodOfFinishQuiz.EXIT_BROWSER && (<p>Poprzez zamknięcie karty lub okna przeglądarki</p>)}
                                {kind_of_finish == MethodOfFinishQuiz.OTHER && (<p>Inny</p>)}
                            </td>
                            <td style={{textAlign: 'center'}}>
                                <button type="button" className="btn btn-danger"
                                        style={{color: "#FFF", marginLeft: "10px"}}
                                        onClick={() => {
                                            setIdUserToGiveAnotherChance(user_id?.id)
                                            setShowAskAboutGiveAnotherChance(true)
                                        }}>
                                    <FontAwesomeIcon
                                        icon={faTrash}/>
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4}>Jeszcze nikt nie rozwiązał tego quizu</td>
                        </tr>
                    )}

                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={showFormAddQuestion}
                toggle={() => setShowFormAddQuestion(!showFormAddQuestion)}
                className="modal-lg"
            >
                <ModalHeader>Dodaj Pytanie</ModalHeader>
                <ModalBody className="form-add-question">
                    <label htmlFor="question">Pytanie</label>
                    <input type="text" className="form-control" name="question"
                           placeholder="Pytanie" value={dataQuestion.question}
                           onChange={handleOnChangeQuestion}/>
                    <label htmlFor="description">Opis pytania</label>
                    <textarea
                        className="form-control"
                        placeholder="Opis pytania *pole opcjonalne"
                        rows="2"
                        name="description"
                        value={dataQuestion.description}
                        onChange={handleOnChangeQuestion}/>
                    <label htmlFor="answer_a" onClick={() => signCorrectAnswer('a')}
                           style={{color: dataQuestion.correct_answer == 'a' ? 'green' : 'black'}}>Odpowiedź A</label>
                    <textarea
                        className="form-control"
                        placeholder="Odpowiedź A"
                        rows="2"
                        name="answer_a"
                        value={dataQuestion.answer_a}
                        onChange={handleOnChangeQuestion}/>
                    <label htmlFor="answer_b" onClick={() => signCorrectAnswer('b')}
                           style={{color: dataQuestion.correct_answer == 'b' ? 'green' : 'black'}}>Odpowiedź B</label>
                    <textarea
                        className="form-control"
                        placeholder="Odpowiedź B"
                        rows="2"
                        name="answer_b"
                        value={dataQuestion.answer_b}
                        onChange={handleOnChangeQuestion}/>
                    <label htmlFor="answer_c" onClick={() => signCorrectAnswer('c')}
                           style={{color: dataQuestion.correct_answer == 'c' ? 'green' : 'black'}}>Odpowiedź C</label>
                    <textarea
                        className="form-control"
                        placeholder="Odpowiedź C"
                        rows="2"
                        name="answer_c"
                        value={dataQuestion.answer_c}
                        onChange={handleOnChangeQuestion}/>
                    <label htmlFor="answer_d" onClick={() => signCorrectAnswer('d')}
                           style={{color: dataQuestion.correct_answer == 'd' ? 'green' : 'black'}}>Odpowiedź D</label>
                    <textarea
                        className="form-control"
                        placeholder="Odpowiedź D"
                        rows="2"
                        name="answer_d"
                        value={dataQuestion.answer_d}
                        onChange={handleOnChangeQuestion}/>
                    <sub>Kliknij na tytuł (label) pola aby oznaczyć poprawną odpowiedź</sub>

                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-success"
                            onClick={() => handleAddQuestion()}>Dodaj pytanie
                    </button>
                    <button type="button" className="btn btn-secondary"
                            onClick={() => setShowFormAddQuestion(false)}>Zamknij okno
                    </button>
                </ModalFooter>
            </Modal>


            <Modal
                isOpen={showFormAboutEditQuestion}
                toggle={() => setShowFormAboutEditQuestion(!showFormAboutEditQuestion)}
                className="modal-lg"
            >
                <ModalHeader>Edytuj Pytanie #{idQuestionToModify}</ModalHeader>
                <ModalBody className="form-add-question">
                    <label htmlFor="question">Pytanie</label>
                    <input type="text" className="form-control" name="question"
                           placeholder="Pytanie" value={dataQuestion.question}
                           onChange={handleOnChangeQuestion}/>
                    <label htmlFor="description">Opis pytania</label>
                    <textarea
                        className="form-control"
                        placeholder="Opis pytania *pole opcjonalne"
                        rows="2"
                        name="description"
                        value={dataQuestion.description}
                        onChange={handleOnChangeQuestion}/>
                    <label htmlFor="answer_a" onClick={() => signCorrectAnswer('a')}
                           style={{color: dataQuestion.correct_answer == 'a' ? 'green' : 'black'}}>Odpowiedź A</label>
                    <textarea
                        className="form-control"
                        placeholder="Odpowiedź A"
                        rows="2"
                        name="answer_a"
                        value={dataQuestion.answer_a}
                        onChange={handleOnChangeQuestion}/>
                    <label htmlFor="answer_b" onClick={() => signCorrectAnswer('b')}
                           style={{color: dataQuestion.correct_answer == 'b' ? 'green' : 'black'}}>Odpowiedź B</label>
                    <textarea
                        className="form-control"
                        placeholder="Odpowiedź B"
                        rows="2"
                        name="answer_b"
                        value={dataQuestion.answer_b}
                        onChange={handleOnChangeQuestion}/>
                    <label htmlFor="answer_c" onClick={() => signCorrectAnswer('c')}
                           style={{color: dataQuestion.correct_answer == 'c' ? 'green' : 'black'}}>Odpowiedź C</label>
                    <textarea
                        className="form-control"
                        placeholder="Odpowiedź C"
                        rows="2"
                        name="answer_c"
                        value={dataQuestion.answer_c}
                        onChange={handleOnChangeQuestion}/>
                    <label htmlFor="answer_d" onClick={() => signCorrectAnswer('d')}
                           style={{color: dataQuestion.correct_answer == 'd' ? 'green' : 'black'}}>Odpowiedź D</label>
                    <textarea
                        className="form-control"
                        placeholder="Odpowiedź D"
                        rows="2"
                        name="answer_d"
                        value={dataQuestion.answer_d}
                        onChange={handleOnChangeQuestion}/>
                    <sub>Kliknij na tytuł (label) pola aby oznaczyć poprawną odpowiedź</sub>

                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-success"
                            onClick={() => handleEditQuestion()}>Edytuj pytanie
                    </button>
                    <button type="button" className="btn btn-secondary"
                            onClick={() => setShowFormAboutEditQuestion(false)}>Zamknij okno
                    </button>
                </ModalFooter>
            </Modal>

            <SweetAlert
                warning
                showCancel
                show={showAskAboutDeleteQuestion}
                title="Na pewno?"
                confirmBtnText="Tak, skasuj"
                cancelBtnText="Nie, zostaw"
                confirmBtnBsStyle="danger"
                cancelBtnBsStyle="secondary"
                onConfirm={() => {
                    setShowAskAboutDeleteQuestion(false)
                    handleDeleteQuestion()
                }}
                onCancel={() => {
                    setShowAskAboutDeleteQuestion(false)
                }}
            >
                Czy na pewno chcesz skasować pytanie o ID={idQuestionToModify} ?
            </SweetAlert>

            <SweetAlert
                warning
                showCancel
                show={showAskAboutGiveAnotherChance}
                title="Na pewno?"
                confirmBtnText="Tak, daj"
                cancelBtnText="Nie dawaj"
                confirmBtnBsStyle="danger"
                cancelBtnBsStyle="secondary"
                onConfirm={() => {
                    setShowAskAboutGiveAnotherChance(false)
                    handleGiveAnotherChance()
                }}
                onCancel={() => {
                    setShowAskAboutGiveAnotherChance(false)
                }}
            >
                Czy na pewno chcesz dać drugą szansę użytkownikowi o ID={idUserToGiveAnotherChance} ? Spowoduje to skasowanie aktualnego wyniku
                z rozwiązanego quizu
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
                confirmBtnBsStyle="success"
                onConfirm={() => setShowSuccess(false)}
            >
                {successMessage}
            </SweetAlert>
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default QuizEdit