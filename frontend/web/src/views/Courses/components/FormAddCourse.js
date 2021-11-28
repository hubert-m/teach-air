import React, {useState} from "react";
import Select from "react-select";
import {IconsOptions} from "../../../constants/Icons";
import {addCourse, getCoursesList} from "../../../helpers/Course";
import {sortAsc} from "../../../helpers/sort";
import SweetAlert from "react-bootstrap-sweetalert";

const FormAddCourse = ({setCourses, parent_id}) => {

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [data, setData] = useState({
        name: '',
        description: '',
        icon: null,
    });

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
        const payload = {
            ...data,
            parent_id: parent_id
        }
        addCourse(payload).then(() => {

            setData((prevState) => ({
                ...prevState,
                name: '',
                description: '',
                icon: null,
            }))

            setShowSuccess(true);

            getCoursesList(parent_id).then(list => {
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
        </>
    )
}

export default FormAddCourse;