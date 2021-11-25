import React from 'react';
import {useParams} from "react-router";

const SubCourses = () => {
    let {id} = useParams();
    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">ID kursu - {id}</h1>
                <hr className="my-4"/>
            </div>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Formularz dodawania kursu dla admina / wykładowcy który jest członkiem tego kursu</h1>
                <hr className="my-4"/>
            </div>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Formularz dodawania członków do kursu dla admina / wykładowcy który jest członkiem tego kursu</h1>
                <hr className="my-4"/>
            </div>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Lista kursów</h1>
                <hr className="my-4"/>
            </div>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Formularz dodawania wątków dla wszystkich, którzy są członkami tego kursu</h1>
                <hr className="my-4"/>
            </div>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Lista wątków</h1>
                <hr className="my-4"/>
            </div>
        </>
    )
}

export default SubCourses;