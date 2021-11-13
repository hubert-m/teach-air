import axios from "axios";
import Settings from "../constants/Settings";
import validateEmail from "./validateEmail";
import Routes from "../constants/Routes";

const getMe = () => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.get(Settings.API + '/users/me/', config).then((response) => {
            // localStorage.setItem("userData", JSON.stringify(response.data));
            resolve(response.data);
        }).catch((error) => {
            let message = "Nie udało się połączyć z serwerem";
            if (error.response) {
                if (error.response.status === 400) {
                    localStorage.clear();
                    this.props.history.push(Routes.LOGIN);
                    message = null;
                }
            } else if (error.message) {
                message = error.message;
            }
            if (message)
                alert(message);
        });
    });
};

const getToken = () => {
    return localStorage.getItem("userToken");
};

/*
const getUserData = () => {
    return localStorage.getItem("userData");
};
 */


const authenticate = (data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.email || !data.password)
            error = "Musisz wprowadzić e-mail i hasło";
        else if (!validateEmail(data.email))
            error = "Wprowadzony adres e-mail jest nieprawidłowy";


        if (error) {
            reject(error);
            return;
        }

        axios.post(Settings.API + '/auth/verify/', data).then((response) => {
            localStorage.setItem("userToken", response.data.token);
            resolve(response.data);
        }).catch((error) => {
            let message = "Nie udało się połączyć z serwerem";
            if (error.response && error.response.data.error) {
                message = error.response.data.error;
            }
            reject(message);
        });
    });
}

const logout = () => {
    localStorage.clear();
}


export {
    getMe,
    getToken,
    authenticate,
    logout,
    // getUserData,
};