import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {Link} from "react-router-dom";
import Routes from "../../constants/Routes";
import {Icons} from "../../constants/Icons";
import LoaderScreen from "../../components/LoaderScreen";
import {getCourse, getCoursesList} from "../../helpers/Course";
import {sortAsc, sortDesc} from "../../helpers/sort";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import FormAddCourse from "./components/FormAddCourse";
import TitleOfCourse from "./components/TitleOfCourse";

const SubCourses = () => {
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

    return (
        <>
            <Breadcrumb>
                <BreadcrumbItem><Link to={Routes.MAIN_COURSES}>Kursy</Link></BreadcrumbItem>
                {course?.navi?.map(({id, name}) => (
                    <BreadcrumbItem><Link to={Routes.SUB_COURSES + id}>{name}</Link></BreadcrumbItem>
                ))}
                <BreadcrumbItem active>{course?.name}</BreadcrumbItem>
            </Breadcrumb>
            <TitleOfCourse title={course?.name}/>
            <FormAddCourse setCourses={setCourses} parent_id={id}/>

            <div className="row">
                {courses.map(({id, name, description, ico}) => (
                    <div className="col-lg-4 col-md-6" key={id}>
                        <Link to={Routes.SUB_COURSES + id} className="course-box fadeIn">
                            <div className="course-box-ico">
                                {ico ? Icons[ico] : Icons[1]}
                            </div>
                            <h3 className="course-box-name">{name}</h3>
                            <p className="course-box-description">{description}</p>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <p>Formularz dodawania członków do kursu dla admina / wykładowcy który jest
                    członkiem tego kursu</p>
                <hr className="my-4"/>
            </div>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <p>Formularz dodawania wątków dla wszystkich, którzy są członkami tego kursu</p>
                <hr className="my-4"/>
            </div>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <p>Lista wątków</p>
                <hr className="my-4"/>
            </div>
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default SubCourses;