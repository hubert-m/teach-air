import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart as heartChecked} from "@fortawesome/free-solid-svg-icons";
import {faHeart as heartUnchecked} from "@fortawesome/free-regular-svg-icons";
import {changeFavouriteCourse} from "../../../helpers/Course";
import SweetAlert from "react-bootstrap-sweetalert";
import LoaderScreen from "../../../components/LoaderScreen";
import {Twemoji} from 'react-emoji-render';
import {Icons} from "../../../constants/Icons";

const TitleOfCourse = ({title, description, course, updateCourse, icon}) => {

    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChangeFavourite = (id) => {
        setShowLoader(true);
        changeFavouriteCourse(id).then(() => {
            updateCourse()
        }).catch(errorMessage => {
            setErrorMessage(errorMessage);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">{!!icon && Icons[parseInt(icon, 10)]} {!!title && (<Twemoji text={title} />)}</h1>
                {course?.isMember === 1 && (
                    <FontAwesomeIcon icon={course?.isFavourite ? heartChecked : heartUnchecked}
                                     className="heart-in-head-course"
                                     onClick={() => handleChangeFavourite(course?.id)}/>
                )}
                {!!description && (<p><Twemoji text={description} /></p>)}
                <hr className="my-4"/>
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

export default TitleOfCourse;