import React, {useEffect, useState} from 'react';
import {StatusUser} from "../../constants/StatusUser";
import {getCoursesList} from "../../helpers/Course";
import LoaderScreen from "../../components/LoaderScreen";
import {sortAsc} from "../../helpers/sort";
import FormAddCourse from "./components/FormAddCourse";
import TitleOfCourse from "./components/TitleOfCourse";
import BreadcrumbList from "./components/BreadcrumbList";
import ListOfCourses from "./components/ListOfCourses";

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
            <ListOfCourses courses={courses} />
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default MainCourses;