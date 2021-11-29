import React from "react";

const TitleOfCourse = ({ title, description }) => {
    return (
        <div className="jumbotron" style={{marginTop: '50px'}}>
            <h1 className="display-7">{title}</h1>
            {!!description && (<p>{description}</p>)}
            <hr className="my-4"/>
        </div>
    )
}

export default TitleOfCourse;