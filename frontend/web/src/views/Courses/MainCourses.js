import React, {useEffect, useState} from 'react';
import {Icons} from "../../constants/Icons";
import {StatusUser} from "../../constants/StatusUser";
import Routes from "../../constants/Routes";
import {Link} from "react-router-dom";
import {getCoursesList} from "../../helpers/Course";
import LoaderScreen from "../../components/LoaderScreen";
import {sortAsc} from "../../helpers/sort";
import FormAddCourse from "./components/FormAddCourse";
import TitleOfCourse from "./components/TitleOfCourse";
import BreadcrumbList from "./components/BreadcrumbList";

const MainCourses = ({userData}) => {
    const [showLoader, setShowLoader] = useState(false);
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

    const breadcrumbs = [
        {link: null, name: "Kursy"},
    ]

    return (
        <>
            <BreadcrumbList breadcrumbs={breadcrumbs} />
            {userData?.status === StatusUser.ADMIN && <FormAddCourse setCourses={setCourses} parent_id={null} /> }
            <TitleOfCourse title="Kursy" />
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
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default MainCourses;