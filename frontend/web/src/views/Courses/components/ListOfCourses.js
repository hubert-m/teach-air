import {Link} from "react-router-dom";
import Routes from "../../../constants/Routes";
import {Icons} from "../../../constants/Icons";
import React from "react";

const ListOfCourses = ({ courses }) => {
    return (
        <div className="row">
            {courses.map(({id, name, description, icon}) => (
                <div className="col-lg-4 col-md-6" key={id}>
                    <Link to={Routes.SUB_COURSES + id} className="course-box fadeIn">
                        <div className="course-box-ico">
                            {icon ? Icons[parseInt(icon, 10)] : Icons[1]}
                        </div>
                        <h3 className="course-box-name">{name}</h3>
                        <p className="course-box-description">{description}</p>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default ListOfCourses;