import React from "react";

const TitleOfCourse = ({ title }) => {
    return (
        <div className="jumbotron" style={{marginTop: '50px'}}>
            <h1 className="display-7">{title}</h1>
            <hr className="my-4"/>
        </div>
    )
}

export default TitleOfCourse;