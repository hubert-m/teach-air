import {Link} from "react-router-dom";
import Routes from "../../../constants/Routes";
import {Icons, IconsOptions} from "../../../constants/Icons";
import React, {useState} from "react";
import {faHeart as heartUnchecked} from "@fortawesome/free-regular-svg-icons";
import {faEdit, faHeart as heartChecked, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {changeFavouriteCourse, deleteCourse, editCourse} from "../../../helpers/Course";
import LoaderScreen from "../../../components/LoaderScreen";
import SweetAlert from "react-bootstrap-sweetalert";
import {Twemoji} from 'react-emoji-render';
import {StatusUser} from "../../../constants/StatusUser";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Select from "react-select";
import {isEmpty} from "lodash";
import {getQuestionsList} from "../../../helpers/Quiz";
import {sortDesc} from "../../../helpers/sort";

const ListOfCourses = ({courses, updateListCourses, userData}) => {
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [idCourseToModify, setIdCourseToModify] = useState(null);
    const [showAskAboutDeleteCourse, setShowAskAboutDeleteCourse] = useState(false);
    const [showFormAboutEditCourse, setShowFormAboutEditCourse] = useState(false);
    const [data, setData] = useState({
        name: '',
        description: '',
        icon: null,
    });

    const handleChangeFavourite = (id) => {
        setShowLoader(true);
        changeFavouriteCourse(id).then(() => {
            updateListCourses()
        }).catch(errorMessage => {
            setErrorMessage(errorMessage);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
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

    const handleOnChangeSelect = (e) => {
        setData((prevState) => ({
            ...prevState,
            icon: e,
        }))
    }

    const handleEditCourse = () => {
        setShowLoader(true);
        editCourse(idCourseToModify, data).then(() => {
            setShowFormAboutEditCourse(false);
            setSuccessMessage("Pomyślnie zaktualizowano kurs")
            setShowSuccess(true)
            updateListCourses()
        }).catch((err) => {
            setErrorMessage(err)
            setShowError(true)
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handleDeleteCourse = () => {
        setShowLoader(true);
        deleteCourse(idCourseToModify).then(() => {
            setSuccessMessage("Pomyślnie usunięto kurs")
            setShowSuccess(true)
            updateListCourses()
        }).catch((err) => {
            setErrorMessage(err)
            setShowError(true)
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    return (
        <>
            <div className="row">
                {courses.map(({id, name, description, icon, isFavourite, isMember, created_by}) => (
                    <div className="col-lg-4 col-md-6 course-box-container" key={id}>
                        {isMember == 1 && (
                            <FontAwesomeIcon icon={isFavourite ? heartChecked : heartUnchecked}
                                             className="heart-in-box-course" onClick={() => handleChangeFavourite(id)}/>
                        )}
                        <Link to={Routes.SUB_COURSES + id} className="course-box fadeIn">
                            <div className="course-box-ico">
                                {icon ? Icons[parseInt(icon, 10)] : Icons[1]}
                            </div>
                            <h3 className="course-box-name">{!!name && (<Twemoji text={name}/>)}</h3>
                            <p className="course-box-description">{!!description && (<Twemoji text={description}/>)}</p>
                        </Link>
                        {((created_by == userData?.id) || (userData?.status == StatusUser.ADMIN)) && (
                            <div className="left-top-corner-of-course">
                                <FontAwesomeIcon icon={faEdit} onClick={() => {
                                    setIdCourseToModify(id)
                                    setData({
                                        name: name,
                                        description: description,
                                        icon: icon ? {
                                            value: icon,
                                            label: Icons[icon]
                                        } : null,
                                    })
                                    setShowFormAboutEditCourse(true)
                                }}/>
                                <FontAwesomeIcon icon={faTrash} onClick={() => {
                                    setIdCourseToModify(id)
                                    setShowAskAboutDeleteCourse(true)
                                }}/>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <Modal
                isOpen={showFormAboutEditCourse}
                toggle={() => setShowFormAboutEditCourse(!setShowFormAboutEditCourse())}
                className="modal-lg"
            >
                <ModalHeader>Edytuj Kurs #{idCourseToModify}</ModalHeader>
                <ModalBody className="form-add-question">
                    <label htmlFor="name">Nazwa kursu</label>
                    <input type="text" className="form-control third" name="name"
                           placeholder="Nazwa kursu" value={data.name}
                           style={{marginBottom: '38px'}}
                           onChange={handleOnChange}/>

                    <label htmlFor="icon">Ikona kursu</label>
                    <Select name="icon"
                            options={IconsOptions}
                            className="select-course-icon"
                            value={data.icon}
                            onChange={handleOnChangeSelect}
                            placeholder="Wybierz ikonę dla kursu *pole opcjonalne"
                            theme={(theme) => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                    ...theme.colors,
                                    neutral0: '#eee'
                                },
                            })}/>
                    <label htmlFor="description">Opis kursu</label>
                    <textarea
                        className="form-control"
                        placeholder="Opis kursu *pole opcjonalne"
                        rows="5"
                        name="description"
                        value={data.description}
                        onChange={handleOnChange}/>

                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-success"
                            onClick={() => handleEditCourse()}>Edytuj Kurs
                    </button>
                    <button type="button" className="btn btn-secondary"
                            onClick={() => setShowFormAboutEditCourse(false)}>Zamknij okno
                    </button>
                </ModalFooter>
            </Modal>
            <SweetAlert
                warning
                showCancel
                show={showAskAboutDeleteCourse}
                title="Na pewno?"
                confirmBtnText="Tak, skasuj"
                cancelBtnText="Nie, zostaw"
                confirmBtnBsStyle="danger"
                cancelBtnBsStyle="secondary"
                onConfirm={() => {
                    setShowAskAboutDeleteCourse(false)
                    handleDeleteCourse()
                }}
                onCancel={() => {
                    setShowAskAboutDeleteCourse(false)
                }}
            >
                Czy na pewno chcesz skasować kurs o ID={idCourseToModify} ? Spowoduje to skasowanie również wszystkich kursów podrzędnych oraz wątków i postów powiązanych
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

export default ListOfCourses;