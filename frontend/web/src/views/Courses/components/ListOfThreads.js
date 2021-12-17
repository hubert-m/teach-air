import React from "react";
import Routes from "../../../constants/Routes";
import {Icons} from "../../../constants/Icons";
import {Link} from "react-router-dom";
import {isEmpty} from "lodash";
import {StatusUser, StatusUserName} from "../../../constants/StatusUser";
import {DefaultAvatarSrc} from "../../../constants/DefaultAvatar";
import parseTimeStamp from "../../../helpers/parseTimeStamp";
import {Twemoji} from 'react-emoji-render';

Twemoji.propTypes = {};
const ListOfThreads = ({threadsList}) => {
    return (
        <>
            <div className="row">
                {isEmpty(threadsList) ? (
                    <div className="alert alert-warning" role="alert">Brak wątków - utwórz pierwszy</div>
                ) : threadsList.map(({id, title, description, icon, created_by, created_at}) => (
                    <div className="col-lg-12 thread-box-container" key={id}>
                        <Link to={Routes.THREAD + id} className="thread-box fadeIn">
                            <div className="thread-box-header">
                                <div className="thread-box-ico">
                                    {icon ? Icons[parseInt(icon, 10)] : Icons[1]}
                                </div>
                                <h3 className="thread-box-name"><Twemoji text={title}/></h3>
                            </div>
                            <p className="thread-box-description"><Twemoji text={description}/></p>
                            <div className="thread-box-author-information">
                                Wątek stworzony przez
                                <img
                                    src={created_by?.profile_image || DefaultAvatarSrc[created_by?.sex_id] || DefaultAvatarSrc[0]}
                                    alt=""/>
                                {created_by?.name} {created_by?.lastname}
                                {created_by?.status === StatusUser.ADMIN ?
                                    (
                                        <span className="badge bg-danger">{StatusUserName[StatusUser.ADMIN]}</span>
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
                                <br/>dnia {parseTimeStamp(created_at)}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ListOfThreads;