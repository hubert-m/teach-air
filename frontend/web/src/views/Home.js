import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Routes from "../constants/Routes";
import {StatusUserName} from "../constants/StatusUser";
import {Twemoji} from "react-emoji-render";
import TitleOfCourse from "./Courses/components/TitleOfCourse";
import ListOfCourses from "./Courses/components/ListOfCourses";
import {getCoursesList} from "../helpers/Course";
import {sortAsc} from "../helpers/sort";
import LoaderScreen from "../components/LoaderScreen";
import {isEmpty} from "lodash";

function Home({userToken, userData}) {
    const [showLoader, setShowLoader] = useState(false);
    const [favouriteCourses, setFavouriteCourses] = useState([]);

    useEffect(() => {
        if(userToken) {
            setShowLoader(true);
            getCoursesList(0, true).then(list => {
                sortAsc(list, "name");
                setFavouriteCourses(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })
        }
    }, [])

    const updateListCourses = () => {
        setShowLoader(true);
        getCoursesList(0, true).then(list => {
            sortAsc(list, "name");
            setFavouriteCourses(list);
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    return (
        <>
            <div className="jumbotron">
                <h1 className="display-4">Teach Air <Twemoji text={":airplane:"} /><Twemoji text={":teacher:"} /></h1>
                <p className="lead">Aplikacja wspomagająca prowadzenie szkoleń i kursów online<br/>
                    zrealizowana w językach <span className="badge bg-primary">JavaScript</span> i <span className="badge bg-primary">PHP</span> z wykorzystaniem bazy
                    danych <span className="badge bg-primary">MySQL</span></p>

                <hr className="my-4"/>
                {userToken ? (
                    <>
                        <p>Jesteś zalogowany jako {userData?.name} {userData?.second_name} {userData?.lastname}</p>
                        <p>E-mail: {userData?.email}</p>
                        <p>Płeć: {userData?.sex_id?.value}</p>
                        <p>Status: {StatusUserName[userData?.status]} - {userData?.status}</p>
                        {!isEmpty(favouriteCourses) && (
                          <>
                              <TitleOfCourse title="Ulubione kursy" />
                              <ListOfCourses courses={favouriteCourses} updateListCourses={updateListCourses} />
                          </>
                        )}
                    </>
                ) : (
                    <>
                        <p>Zarejestruj się już teraz i bierz udział w zajęciach</p>
                        <p className="lead">
                            <Link className="btn btn-primary btn-lg" to={Routes.REGISTER} role="button">Zarejestruj
                                się</Link>
                        </p>
                    </>
                )}

            </div>
            {showLoader && <LoaderScreen/>}
        </>
    );

}

export default Home;