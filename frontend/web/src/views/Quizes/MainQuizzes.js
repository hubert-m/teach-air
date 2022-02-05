import React, {useEffect, useState} from "react";
import {sortAsc, sortDesc} from "../../helpers/sort";
import {addQuiz, deleteQuiz, getQuizzesList} from "../../helpers/Quiz";
import LoaderScreen from "../../components/LoaderScreen";
import {DefaultAvatarSrc} from "../../constants/DefaultAvatar";
import Routes from "../../constants/Routes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRunning, faEdit, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import {getFullTimeFromSeconds, getSecondsFromTime} from "../../helpers/secondsTime";
import {getCoursesListForSelect} from "../../helpers/Course";
import {StatusUser} from "../../constants/StatusUser";
import {Link} from "react-router-dom";
import {Twemoji} from 'react-emoji-render';
import {isEmpty} from "lodash";

const MainQuizzes = ({userData}) => {
    const history = useHistory();
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [quizzesList, setQuizzesList] = useState([]);
    const [showFormAddQuiz, setShowFormAddQuiz] = useState(false);
    const [listOfCourses, setListOfCourses] = useState([]);
    const [data, setData] = useState({
        title: '',
        description: '',
        seconds_for_answer: '0:00',
        course_id: '',
    })
    const [idQuizToDelete, setIdQuizToDelete] = useState(0);
    const [showFormAboutDeleteQuiz, setShowFormAboutDeleteQuiz] = useState(false);

    useEffect(() => {
        //window.location.reload(false); // refresh strony po powrocie ze strony quizu
        setShowLoader(true);
        getQuizzesList().then(list => {
            sortDesc(list, "id");
            setQuizzesList(list)
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
        })
    }, [])

    const handleAddQuiz = () => {
        // setShowFormAddQuiz(false) przy sukcesie
        setShowLoader(true);
        const payload = {
            ...data,
            seconds_for_answer: getSecondsFromTime(data?.seconds_for_answer)
        }
        addQuiz(payload).then(() => {
            setShowFormAddQuiz(false)

            getQuizzesList().then(list => {
                sortDesc(list, "id");
                setQuizzesList(list)

                setData({
                    title: '',
                    description: '',
                    seconds_for_answer: '0:00',
                    course_id: '',
                })

            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })

        }).catch(async (err) => {
            await setShowLoader(false);
            setErrorMessage(err);
            setShowError(true)
        })
    }

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

    const handleShowFormAddQuiz = () => {
        setShowFormAddQuiz(true)

        setShowLoader(true);
        getCoursesListForSelect().then(list => {
            sortAsc(list, "name");
            setListOfCourses(list)
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handleDeleteQuiz = () => {
        setShowLoader(true);
        deleteQuiz(idQuizToDelete).then((res) => {
            getQuizzesList().then(list => {
                setSuccessMessage(res?.success)
                setShowSuccess(true)
                sortDesc(list, "id");
                setQuizzesList(list)
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })
        }).catch(async (err) => {
            await setShowLoader(false);
            setErrorMessage(err)
            setShowError(true)
        })
    }

    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Lista quizów</h1>
                {(userData?.status == 2 || userData?.status == 3) && (
                    <button type="button" className="btn btn-success button-add-quiz" style={{color: "#FFF"}}
                            onClick={() => {
                                handleShowFormAddQuiz()
                            }}>
                        <FontAwesomeIcon
                            icon={faPlus}/>
                    </button>
                )}
                <hr className="my-4"/>
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Quiz</th>
                        <th scope="col">Sekund na odpowiedź</th>
                        <th scope="col">Utworzony przez</th>
                        <th scope="col" style={{textAlign: 'center'}}>Do dzieła!</th>
                    </tr>
                    </thead>
                    <tbody>
                    {!isEmpty(quizzesList) ? quizzesList.map(({
                                                                  id,
                                                                  title,
                                                                  seconds_for_answer,
                                                                  created_by,
                                                                  course_id,
                                                                  finished,
                                                                  correct_answers,
                                                                  wrong_answers
                                                              }) => (
                        <tr key={id}>
                            <th scope="row">{id}</th>
                            <td><Twemoji text={title}/> {finished == '1' && (<span>[Ukończony <span
                                style={{color: 'green'}}>{correct_answers}</span> / <span
                                style={{color: 'red'}}>{wrong_answers}</span>]</span>)} {course_id != 0 && (
                                <Link to={Routes.SUB_COURSES + course_id?.id}
                                      className="quizzes-list-course-name"><Twemoji text={course_id?.name}/></Link>)}
                            </td>
                            <td>{seconds_for_answer ? seconds_for_answer + ' sekund' : 'Bez limitu czasowego'}</td>
                            <td>
                                <div className="message-avatar">
                                    <img
                                        src={created_by?.profile_image || DefaultAvatarSrc[created_by?.sex_id] || DefaultAvatarSrc[0]}
                                        alt=""/>
                                </div>
                                {created_by?.name} {created_by?.lastname}</td>
                            <td style={{textAlign: 'center'}}>
                                {finished == '0' && (
                                    <button type="button" className="btn btn-info" style={{color: "#FFF"}}
                                            onClick={() => history.push(Routes.QUIZ + id)}>
                                        <FontAwesomeIcon
                                            icon={faRunning}/>
                                    </button>
                                )}
                                {(created_by?.id == userData?.id || userData?.status == StatusUser.ADMIN) && (
                                    <>
                                        <button type="button" className="btn btn-warning"
                                                style={{color: "#FFF", marginLeft: "10px"}}
                                                onClick={() => history.push(Routes.QUIZ_EDIT + id)}>
                                            <FontAwesomeIcon
                                                icon={faEdit}/>
                                        </button>
                                        <button type="button" className="btn btn-danger"
                                                style={{color: "#FFF", marginLeft: "10px"}}
                                                onClick={() => {
                                                    setIdQuizToDelete(id)
                                                    setShowFormAboutDeleteQuiz(true)
                                                }}>
                                            <FontAwesomeIcon
                                                icon={faTrash}/>
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} style={{textAlign: 'center'}}>Brak quizów. Utwórz pierwszy</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={showFormAddQuiz}
                toggle={() => setShowFormAddQuiz(!showFormAddQuiz)}
                className="modal-lg"
            >
                <ModalHeader>Dodaj Quiz</ModalHeader>
                <ModalBody>
                    <label htmlFor="title">Tytuł Quizu</label>
                    <input type="text" className="form-control" name="title"
                           placeholder="Tytuł quizu" value={data.title}
                           onChange={handleOnChange}/>
                    <label htmlFor="description">Opis quizu <sub>(pole opcjonalne)</sub></label>
                    <textarea
                        className="form-control"
                        placeholder="Opis quizu *pole opcjonalne"
                        rows="3"
                        name="description"
                        value={data.description}
                        onChange={handleOnChange}/>
                    <label htmlFor="seconds_for_answer">Czas na udzielenie odpowiedzi <sub>(0:00 sekund oznacza bez
                        ograniczenia czasowego)</sub></label>
                    <input type="text" className="form-control" name="seconds_for_answer"
                           placeholder="Czas na odpowiedź" value={data.seconds_for_answer}
                           onChange={handleOnChange} onBlur={onBlur}/>
                    <label htmlFor="description">Kurs <sub>(pole opcjonalne)</sub></label>
                    <select name="course_id" onChange={handleOnChange}>
                        <option value="0" selected>Wybierz kurs</option>
                        {listOfCourses.map(({id, name}) => (
                            <option value={id} key={id}>{name}</option>
                        ))}
                    </select>
                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-success"
                            onClick={() => handleAddQuiz()}>Dodaj quiz
                    </button>
                    <button type="button" className="btn btn-secondary"
                            onClick={() => setShowFormAddQuiz(false)}>Zamknij okno
                    </button>
                </ModalFooter>
            </Modal>
            <SweetAlert
                warning
                showCancel
                show={showFormAboutDeleteQuiz}
                title="Na pewno?"
                confirmBtnText="Tak, skasuj"
                cancelBtnText="Nie, zostaw"
                confirmBtnBsStyle="danger"
                cancelBtnBsStyle="secondary"
                onConfirm={() => {
                    setShowFormAboutDeleteQuiz(false)
                    handleDeleteQuiz()
                }}
                onCancel={() => {
                    setShowFormAboutDeleteQuiz(false);
                }}
            >
                Czy na pewno chcesz skasować quiz o ID={idQuizToDelete} ? Zostaną też skasowane wszystkie pytania do
                niego przypisane
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
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default MainQuizzes;