import {Link} from "react-router-dom";
import Routes from "../../../constants/Routes";
import {Icons} from "../../../constants/Icons";
import React, {useState} from "react";
import {faHeart as heartUnchecked} from "@fortawesome/free-regular-svg-icons";
import {faHeart as heartChecked} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {changeFavouriteCourse, getCoursesList} from "../../../helpers/Course";
import {sortAsc} from "../../../helpers/sort";
import LoaderScreen from "../../../components/LoaderScreen";
import SweetAlert from "react-bootstrap-sweetalert";
import {Twemoji} from 'react-emoji-render';

const ListOfCourses = ({courses, updateListCourses}) => {
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

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

    return (
        <>
            <div className="row">
                {courses.map(({id, name, description, icon, isFavourite, isMember}) => (
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
                    </div>
                ))}
            </div>
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
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default ListOfCourses;