import {useHistory, useParams} from "react-router";
import {StatusUser} from "../../constants/StatusUser";
import Routes from "../../constants/Routes";
import React, {useEffect, useState} from "react";
import {getCoursesListForSelect} from "../../helpers/Course";
import {sortAsc, sortDesc} from "../../helpers/sort";
import {getFullTimeFromSeconds, getSecondsFromTime} from "../../helpers/secondsTime";
import SweetAlert from "react-bootstrap-sweetalert";
import LoaderScreen from "../../components/LoaderScreen";
import {getQuestionsList, getQuizById, updateQuiz} from "../../helpers/Quiz";
import {Accordion} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {isEmpty} from "lodash";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {getSearchUsers} from "../../helpers/User";

const QuizEdit = ({userData}) => {
    let {id} = useParams();
    const history = useHistory();

    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const [showFormAddQuestion, setShowFormAddQuestion] = useState(false);

    const [listOfQuestions, setListOfQuestions] = useState([]);

    const [listOfCourses, setListOfCourses] = useState([]);
    const [data, setData] = useState({
        title: '',
        description: '',
        seconds_for_answer: '0:00',
        course_id: '',
    })

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
                    <button type="button" className="btn btn-success" style={{ marginTop: '15px' }}
                            onClick={() => handleEditQuiz()}>Zapisz zmiany
                    </button>
                </div>
            </div>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Pytania</h1>
                <button type="button" className="btn btn-success button-add-quiz" style={{color: "#FFF"}}
                        onClick={() => setShowFormAddQuestion(true)}>
                    <FontAwesomeIcon
                        icon={faPlus}/>
                </button>
                <hr className="my-4"/>
            </div>
            <Accordion>
            {!isEmpty(listOfQuestions) ? listOfQuestions.map(({id, question, description, answer_a, answer_b, answer_c, answer_d, correct}) => (
                <Accordion.Item key={id} eventKey={id}>
                    <Accordion.Header>#{id} - {question}</Accordion.Header>
                    <Accordion.Body>
                        {!isEmpty(description) && (<p><strong>Opis:</strong> {description}</p>)}
                        <p><strong>{correct == 'a' ? (<span style={{ color: 'green' }}>Odpowiedź A:</span>) : (<span>Odpowiedź A:</span>)}</strong> {answer_a}</p>
                        <p><strong>{correct == 'b' ? (<span style={{ color: 'green' }}>Odpowiedź B:</span>) : (<span>Odpowiedź B:</span>)}</strong> {answer_b}</p>
                        <p><strong>{correct == 'c' ? (<span style={{ color: 'green' }}>Odpowiedź C:</span>) : (<span>Odpowiedź C:</span>)}</strong> {answer_c}</p>
                        <p><strong>{correct == 'd' ? (<span style={{ color: 'green' }}>Odpowiedź D:</span>) : (<span>Odpowiedź D:</span>)}</strong> {answer_d}</p>
                    </Accordion.Body>
                </Accordion.Item>

                )) : (<p>Brak pytań dla tego quizu. Utwórz pierwsze</p>)}
            </Accordion>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Użytkownicy, którzy zakończyli quiz</h1>
                <hr className="my-4"/>
            </div>

            <Modal
                isOpen={showFormAddQuestion}
                toggle={() => setShowFormAddQuestion(!showFormAddQuestion)}
                className="modal-lg"
            >
                <ModalHeader>Dodaj Pytanie</ModalHeader>
                <ModalBody>

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
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default QuizEdit