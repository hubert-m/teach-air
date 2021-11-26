import React, {useState} from 'react';
import Select from "react-select";
import {IconsOptions} from "../../constants/Icons";
import {StatusUser} from "../../constants/StatusUser";

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
                <h1 className="display-7">Lista głównych kursów</h1>
                <hr className="my-4"/>
            </div>
        </>
    )
}

export default MainCourses;