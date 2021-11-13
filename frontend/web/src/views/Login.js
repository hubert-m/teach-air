import React from 'react';
import * as _ from "lodash";
import {authenticate, getToken} from "../helpers/User";
import Routes from "../constants/Routes";

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        }
    }

    componentWillMount() {
        if(!!getToken()) {
            this.props.history.push(Routes.HOME);
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="row justify-content-md-center">
                    <div className="col-md-5">
                        <div className="shadow-sm p-5 mb-5 bg-white rounded mt-5">
                            <div className="form-group">
                                <label htmlFor="email">Adres e-mail</label>
                                <input type="email" className="form-control" id="email"
                                       aria-describedby="emailHelp" placeholder="Enter email"
                                       value={this.state.email}
                                       onChange={this.onInputChanged}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Hasło</label>
                                <input type="password" className="form-control" id="password"
                                       placeholder="Password"
                                       value={this.state.password}
                                       onChange={this.onInputChanged}/>
                            </div>
                            <button className="btn btn-primary"
                                    onClick={() => this.login()}>Login
                            </button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    onInputChanged = ({target: {value, id: field}}) => {
        this.setState((prevState) => {
            _.set(prevState, field, value);
            return prevState;
        });
    };

    login() {
        const { history } = this.props;
        authenticate(this.state).then(() => {
            history.push(Routes.HOME);
        }).catch(errorMessage => {
            alert(errorMessage);
        });
    }

}


export default Login;
