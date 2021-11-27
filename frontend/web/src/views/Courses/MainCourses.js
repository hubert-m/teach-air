import React, {useEffect, useState} from 'react';
import Select from "react-select";
import {Icons, IconsOptions} from "../../constants/Icons";
import {StatusUser} from "../../constants/StatusUser";
import Routes from "../../constants/Routes";
import {Link} from "react-router-dom";
import {addCourse, getCoursesList} from "../../helpers/Course";
import LoaderScreen from "../../components/LoaderScreen";
import SweetAlert from "react-bootstrap-sweetalert";
import {sortAsc, sortDesc} from "../../helpers/sort";

const MainCourses = ({userData}) => {
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [data, setData] = useState({
        name: '',
        description: '',
        icon: null,
        parent_id: null,
    });
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        setShowLoader(true);
        getCoursesList().then(list => {
            sortAsc(list, "name");
            setCourses(list);
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
        })
    }, [])

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

    const handleAddCourse = () => {
        addCourse(data).then(() => {

            setData((prevState) => ({
                ...prevState,
                name: '',
                description: '',
                icon: null,
                parent_id: null,
            }))

            setShowSuccess(true);

            getCoursesList().then(list => {
                sortAsc(list, "name");
                setCourses(list);
            }).catch(() => {
            })

        }).catch(errorMessage => {
            setErrorMessage(errorMessage);
            setShowError(true);
        })
    }

    return (
        <>
            {userData?.status === StatusUser.ADMIN && (
                <div className="jumbotron" style={{marginTop: '50px'}}>
                    <h1 className="display-7">Dodaj główny kurs</h1>
                    <hr className="my-4"/>
                    <div className="row">
                        <div className="col-lg-6">
                            <input type="text" className="form-control third" name="name"
                                   placeholder="Nazwa kursu" value={data.name}
                                   style={{marginBottom: '38px'}}
                                   onChange={handleOnChange}/>

                            <Select name="icon"
                                    options={IconsOptions}
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
                        </div>
                        <div className="col-lg-6">
                        <textarea
                            className="form-control"
                            placeholder="Opis kursu *pole opcjonalne"
                            rows="5"
                            name="description"
                            value={data.description}
                            onChange={handleOnChange}/>
                        </div>
                        <div className="col-lg-6 offset-lg-3">
                            <button style={{marginTop: '20px'}}
                                    onClick={() => handleAddCourse()}>Dodaj kurs
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Główne kursy</h1>
                <hr className="my-4"/>
            </div>
            <div className="row">
                {courses.map(({id, name, description, icon}) => (
                    <div className="col-lg-4 col-md-6" key={id}>
                        <Link to={Routes.SUB_COURSES + id} className="course-box fadeIn">
                            <div className="course-box-ico">
                                {icon ? Icons[parseInt(icon,10)] : Icons[1]}
                            </div>
                            <h3 className="course-box-name">{name}</h3>
                            <p className="course-box-description">{description}</p>
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
            <SweetAlert
                success
                show={showSuccess}
                title="Hurraaa :)"
                onConfirm={() => setShowSuccess(false)}
            >
                Pomyślnie dodano nowy kurs
            </SweetAlert>
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default MainCourses;