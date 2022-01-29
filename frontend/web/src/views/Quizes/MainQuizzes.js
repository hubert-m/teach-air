import React, {useEffect, useState} from "react";
import {sortDesc} from "../../helpers/sort";
import {getQuizzesList} from "../../helpers/Quiz";
import LoaderScreen from "../../components/LoaderScreen";
import {DefaultAvatarSrc} from "../../constants/DefaultAvatar";
import Routes from "../../constants/Routes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRunning, faEdit, faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import UploadFile from "../Hosting/components/UploadFile";
import {isEmpty} from "lodash";
import SweetAlert from "react-bootstrap-sweetalert";

const MainQuizzes = ({userData}) => {
    const history = useHistory();
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [quizzesList, setQuizzesList] = useState([]);
    const [showFormAddQuiz, setShowFormAddQuiz] = useState(false);

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
    }



    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Lista quizów</h1>
                {(userData?.status == 2 || userData?.status == 3) && (
                    <button type="button" className="btn btn-success button-add-quiz" style={{color: "#FFF"}}
                            onClick={() => {
                                setShowFormAddQuiz(true)
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
                    {quizzesList.map(({id, title, seconds_for_answer, created_by}) => (
                        <tr key={id}>
                            <th scope="row">{id}</th>
                            <td>{title}</td>
                            <td>{seconds_for_answer ? seconds_for_answer+' sekund' : 'Bez limitu czasowego'}</td>
                            <td>
                                <div className="message-avatar">
                                    <img
                                        src={created_by?.profile_image || DefaultAvatarSrc[created_by?.sex_id] || DefaultAvatarSrc[0]}
                                        alt=""/>
                                </div>
                                {created_by?.name} {created_by?.lastname}</td>
                            <td style={{textAlign: 'center'}}>
                                <button type="button" className="btn btn-info" style={{color: "#FFF"}}
                                        onClick={() => history.push(Routes.QUIZ + id)}>
                                    <FontAwesomeIcon
                                        icon={faRunning}/>
                                </button>
                                {created_by?.id == userData?.id && (
                                    <button type="button" className="btn btn-warning" style={{color: "#FFF", marginLeft: "10px"}}
                                            onClick={() => history.push(Routes.QUIZ_EDIT + id)}>
                                        <FontAwesomeIcon
                                            icon={faEdit}/>
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
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
                    <p>Tresc</p>
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