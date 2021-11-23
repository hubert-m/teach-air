import React, {useState} from 'react';
import {getSearchUsers} from "../../helpers/User";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import Routes from "../../constants/Routes";
import {useHistory} from "react-router";
import {size, isNull} from "lodash";
import {StatusUser, StatusUserName} from "../../constants/StatusUser";

const MessagesList = () => {
    const history = useHistory();
    const [loadOptions, setLoadOptions] = useState([]);
    const [lengthKeywordWhenOneRecord, setLengthKeywordWhenOneRecord] = useState(null);
    const [data, setData] = useState({
        keyword: '',
    });

    const handleOnChange = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))

        if (e.target.value.length >= 3) {

            if (size(loadOptions) === 1 && isNull(lengthKeywordWhenOneRecord)) {
                setLengthKeywordWhenOneRecord(e.target.value.length);
            }

            console.log(lengthKeywordWhenOneRecord);

            if(size(loadOptions) > 1) {
                setLengthKeywordWhenOneRecord(null);
            }

            if(e.target.value.length < lengthKeywordWhenOneRecord || isNull(lengthKeywordWhenOneRecord)) {
                getSearchUsers(e.target.value).then(list => {
                    setLoadOptions(list);
                }).catch(() => {
                })
            }
        }
    }

    return (
        <>
            <p>Do kogo chcesz napisać wiadomość? (wprowadź przynajmniej 3 znaki)</p>
            <input type="text" id="keyword" className="form-control third" name="keyword"
                   placeholder="Wpisz przynajmniej 3 znaki" value={data.keyword}
                   onChange={handleOnChange}/>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Imię</th>
                    <th scope="col">Nazwisko</th>
                    <th scope="col">Email</th>
                    <th scope="col">&nbsp;</th>
                    <th scope="col" style={{textAlign: 'center'}}>Napisz wiadomość</th>
                </tr>
                </thead>
                <tbody>
                {loadOptions.map(({id, email, name, second_name, lastname, status}) => (
                    <tr key={id}>
                        <th scope="row">{id}</th>
                        <td>{name} {second_name}</td>
                        <td>{lastname}</td>
                        <td>{email}</td>
                        {status === StatusUser.ADMIN ?
                            (
                                <td><span className="badge bg-danger">{StatusUserName[StatusUser.ADMIN]}</span>
                                </td>
                            ) : status === StatusUser.UNACTIVATED ?
                                (
                                    <td><span
                                        className="badge bg-secondary">{StatusUserName[StatusUser.UNACTIVATED]}</span>
                                    </td>
                                ) : status === StatusUser.TEACHER ?
                                    (
                                        <td><span
                                            className="badge bg-warning">{StatusUserName[StatusUser.TEACHER]}</span>
                                        </td>
                                    ) : (
                                        <td><span
                                            className="badge bg-primary">{StatusUserName[StatusUser.STUDENT]}</span>
                                        </td>
                                    )
                        }
                        <td style={{textAlign: 'center'}}>
                            <button type="button" className="btn btn-info" style={{color: "#FFF"}}
                                    onClick={() => history.push(Routes.MESSAGES_WITH_USER + id)}><FontAwesomeIcon
                                icon={faEnvelope}/>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Aktywne konwersacje</h1>
                <hr className="my-4"/>
            </div>
            <p>Brak</p>
        </>
    )
}

export default MessagesList;