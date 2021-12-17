import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {getPosts, getThreadById} from "../../helpers/Thread";
import LoaderScreen from "../../components/LoaderScreen";
import {Twemoji} from 'react-emoji-render';
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import {isEmpty, isNull} from "lodash";
import {Link} from "react-router-dom";
import Routes from "../../constants/Routes";
import {DefaultAvatarSrc} from "../../constants/DefaultAvatar";
import parseTimeStamp from "../../helpers/parseTimeStamp";
import {StatusUser, StatusUserName} from "../../constants/StatusUser";
import {faFacebook} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Icons} from "../../constants/Icons";

const Thread = () => {
    let {id} = useParams();
    const [showLoader, setShowLoader] = useState(false);
    const [threadData, setThreadData] = useState({});
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        setShowLoader(true);
        getThreadById(id).then(obj => {
            setThreadData(obj);
            getPosts(id).then(list => {
                setPosts(list);
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
                <BreadcrumbItem>
                    <Link to={Routes.SUB_COURSES + threadData?.course_id?.id}>Powrót do kursu
                        "{!!threadData?.course_id?.name && (
                            <Twemoji text={threadData?.course_id?.name}/>)}"</Link>
                </BreadcrumbItem>
            </Breadcrumb>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">{threadData?.icon ? Icons[parseInt(threadData?.icon, 10)] : Icons[1]} {!!threadData?.title && (<Twemoji text={threadData?.title}/>)}</h1>
                {!!threadData?.description && (<p><Twemoji text={threadData?.description}/></p>)}
                <hr className="my-4"/>
            </div>
            {posts.map(({id, content, created_by, created_at, files}) => (
                <div className="container-fluid mt-100" key={id}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <div
                                        className="media d-flex flex-wrap justify-content-between align-items-center px-0 pt-0 pb-3">
                                        <div className="media-body ml-3" style={{textAlign: 'center'}}>
                                            <img
                                                src={created_by?.profile_image || DefaultAvatarSrc[created_by?.sex_id?.id] || DefaultAvatarSrc[0]}
                                                className="d-block ui-w-40 rounded-circle"
                                                alt="" style={{maxWidth: '100px'}}/>
                                            {created_by?.name} {created_by?.second_name} {created_by?.lastname}<br/>
                                            {created_by?.status === StatusUser.ADMIN ?
                                                (
                                                    <span
                                                        className="badge bg-danger">{StatusUserName[StatusUser.ADMIN]}</span>
                                                ) : created_by?.status === StatusUser.UNACTIVATED ?
                                                    (
                                                        <span
                                                            className="badge bg-secondary">{StatusUserName[StatusUser.UNACTIVATED]}</span>
                                                    ) : created_by?.status === StatusUser.TEACHER ?
                                                        (
                                                            <span
                                                                className="badge bg-warning">{StatusUserName[StatusUser.TEACHER]}</span>
                                                        ) : (
                                                            <span
                                                                className="badge bg-primary">{StatusUserName[StatusUser.STUDENT]}</span>
                                                        )
                                            }
                                        </div>
                                        <div className="text-muted small ml-3">
                                            {created_by?.show_email === 1 && (
                                                <div>E-mail <strong>{created_by?.email}</strong></div>)}
                                            {!!created_by?.phone && (
                                                <div>Tel.: <strong>{created_by?.phone}</strong></div>)}
                                            {!!created_by?.hobby && (
                                                <div>Hobby: <strong><Twemoji text={created_by?.hobby}/></strong></div>)}
                                            {!!created_by?.description && (
                                                <div>Opis: <strong><Twemoji text={created_by?.description}/></strong>
                                                </div>)}
                                            {!!created_by?.facebook && (<div style={{
                                                fontSize: '31px',
                                                position: 'absolute',
                                                top: '0',
                                                right: '10px'
                                            }}><a href={created_by?.facebook} target="_blank"><FontAwesomeIcon
                                                icon={faFacebook}/></a></div>)}
                                            {!!created_by?.sex_id?.value && (
                                                <div>Płeć: <strong>{created_by?.sex_id?.value}</strong>
                                                </div>)}
                                        </div>
                                        <div className="text-muted small ml-3">
                                            <div>Data
                                                rejestracji<br/><strong>{parseTimeStamp(created_by?.created_at)}</strong>
                                            </div>
                                            <div><strong>{created_by?.count_of_posts}</strong> postów</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body" style={{ position: 'relative', paddingBottom: '30px' }}>
                                    {!!content && (<Twemoji text={content}/>)}
                                    <div className="text-muted small ml-3" style={{ position: 'absolute',
                                        bottom: '0',
                                        right: '5px' }}>
                                        Post napisany {parseTimeStamp(created_at)}
                                    </div>
                                </div>
                                {!isEmpty(files) && (
                                <div
                                    className="card-footer d-flex flex-wrap justify-content-between align-items-center px-0 pt-0 pb-3">
                                    <div className="px-4 pt-3"><strong>Załączone pliki:</strong> <sub>(kliknij aby
                                        pobrać)</sub>

                                        {files.map(({name, url, extension}) => (
                                                <a href={url} className="file-under-message"
                                                   download={name}>{name}.{extension}</a>
                                            )
                                        )}
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default Thread;