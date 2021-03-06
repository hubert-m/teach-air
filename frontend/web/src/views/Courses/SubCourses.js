import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {Link} from "react-router-dom";
import Routes from "../../constants/Routes";
import LoaderScreen from "../../components/LoaderScreen";
import {getCourse, getCoursesList} from "../../helpers/Course";
import {sortAsc, sortDesc} from "../../helpers/sort";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import FormAddCourse from "./components/FormAddCourse";
import TitleOfCourse from "./components/TitleOfCourse";
import ListOfCourses from "./components/ListOfCourses";
import FormAddMember from "./components/FormAddMember";
import FormAddThread from "./components/FormAddThread";
import {StatusUser} from "../../constants/StatusUser";

const SubCourses = ({userData}) => {
    let {id} = useParams();
    const [showLoader, setShowLoader] = useState(false);
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState({});

    useEffect(() => {
        setShowLoader(true);
        getCourse(id).then(obj => {
            sortDesc(obj?.navi, "order");
            setCourse(obj);
            getCoursesList(id).then(list => {
                sortAsc(list, "name");
                setCourses(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })
        }).catch(() => {
        })
    }, [id])

    const updateListCourses = () => {
        setShowLoader(true);
        getCourse(id).then(obj => {
            sortDesc(obj?.navi, "order");
            setCourse(obj);
            getCoursesList(id).then(list => {
                sortAsc(list, "name");
                setCourses(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })
        }).catch(() => {
        })
    }

    const updateCourse = () => {
        setShowLoader(true);
        getCourse(id).then(obj => {
            sortDesc(obj?.navi, "order");
            setCourse(obj);
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    return (
        <>
            <Breadcrumb>
                <BreadcrumbItem><Link to={Routes.MAIN_COURSES}>Kursy</Link></BreadcrumbItem>
                {course?.navi?.map(({id, name}, key) => (
                    <BreadcrumbItem key={key}><Link to={Routes.SUB_COURSES + id}>{name}</Link></BreadcrumbItem>
                ))}
                <BreadcrumbItem active>{course?.name}</BreadcrumbItem>
            </Breadcrumb>
            <TitleOfCourse title={course?.name} description={course?.description} course={course} updateCourse={updateCourse} icon={course?.icon}/>

            {course?.isMember == 0 && (
                <div className="alert alert-warning" role="alert">
                    Nie jeste?? cz??onkiem tego kursu, wi??c nie masz uprawnie?? do tworzenia kolejnych kategorii i pisania
                    w??tk??w<br/>
                    Skontaktuj si?? z wyk??adowc?? lub administratorem (prawy g??rny r??g -> Wiadomo??ci)
                </div>
            )}

            {course?.isMember == 1 && ((userData?.status == StatusUser.ADMIN || userData?.status == StatusUser.TEACHER) && (
                <FormAddCourse setCourses={setCourses} parent_id={id}/>
            ))}

            <ListOfCourses courses={courses} updateListCourses={updateListCourses} userData={userData}/>

            {course?.isMember == 1 && ((userData?.status == StatusUser.ADMIN || userData?.status == StatusUser.TEACHER) && (
                <FormAddMember courseId={id}/>
            ))}

            {course?.isMember == 1 && (
                <>
                    <FormAddThread course_id={id}/>
                </>
            )}

            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default SubCourses;