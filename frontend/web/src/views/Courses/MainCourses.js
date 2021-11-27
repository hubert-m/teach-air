import React, {useState} from 'react';
import Select from "react-select";
import {Icons, IconsOptions} from "../../constants/Icons";
import {StatusUser} from "../../constants/StatusUser";
import Routes from "../../constants/Routes";
import {Link} from "react-router-dom";

const MainCourses = ({userData}) => {
    const [data, setData] = useState({
        name: '',
        description: '',
        ico: ''
    });

    const handleOnChange = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    const handleAddCourse = () => {

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

                            <Select name="ico"
                                    options={IconsOptions}
                                    placeholder="Wybierz ikonę dla kursu"/>
                        </div>
                        <div className="col-lg-6">
                        <textarea
                            className="form-control"
                            placeholder="Opis kursu"
                            rows="5"
                            name="description"
                            value={data.description}
                            onChange={handleOnChange}/>
                        </div>
                        <div className="col-lg-6 offset-lg-3">
                            <button className="fourth" style={{marginTop: '20px'}}
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
                <div className="col-lg-4 col-md-6">
                    <Link to={Routes.LOGIN} className="course-box fadeIn">
                        <div className="course-box-ico">
                            {Icons[2]}
                        </div>
                        <h3 className="course-box-name">Nazwa kursu</h3>
                        <p className="course-box-description">Lorem ipsum opis kursu</p>
                    </Link>
                </div>
                <div className="col-lg-4 col-md-6">
                    <Link to={Routes.LOGIN} className="course-box fadeIn">
                        <div className="course-box-ico">
                            {Icons[2]}
                        </div>
                        <h3 className="course-box-name">Nazwa kursu</h3>
                        <p className="course-box-description">Lorem ipsum opis kursu</p>
                    </Link>
                </div>
                <div className="col-lg-4 col-md-6">
                    <Link to={Routes.LOGIN} className="course-box fadeIn">
                        <div className="course-box-ico">
                            {Icons[2]}
                        </div>
                        <h3 className="course-box-name">Nazwa kursu</h3>
                        <p className="course-box-description">Lorem ipsum opis kursu</p>
                    </Link>
                </div>
                <div className="col-lg-4 col-md-6">
                    <Link to={Routes.LOGIN} className="course-box fadeIn">
                        <div className="course-box-ico">
                            {Icons[2]}
                        </div>
                        <h3 className="course-box-name">Nazwa kursu</h3>
                        <p className="course-box-description">Lorem ipsum opis kursu</p>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default MainCourses;