import axios from "axios";
import Settings from "../constants/Settings";
import validateEmail from "./validateEmail";
import Routes from "../constants/Routes";
import ApiEndpoints from "../constants/ApiEndpoints";

const getMe = () => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.get(Settings.API + ApiEndpoints.USERS_ME, config).then((response) => {
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

        axios.post(Settings.API + ApiEndpoints.LOGIN, data).then((response) => {
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


const register = (data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.email || !data.password || !data.passwordRepeat || !data.name || !data.lastname || !data.sex_id)
            error = "Musisz wypełnić wszystkie pola";
        else if (!validateEmail(data.email))
            error = "Wprowadzony adres e-mail jest nieprawidłowy";
        else if (data.password !== data.passwordRepeat)
            error = "Wprowadzone hasła nie są takie same";


        if (error) {
            reject(error);
            return;
        }

        axios.post(Settings.API + ApiEndpoints.REGISTER, data).then((response) => {
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

const getSexList = () => {
    return new Promise((resolve, reject) => {
        axios.get(Settings.API + ApiEndpoints.SEX_LIST).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const addSex = (data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.sex)
            error = "Musisz wypełnić wszystkie pola";

        if (error) {
            reject(error);
            return;
        }

        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.post(Settings.API + ApiEndpoints.SEX_ADD, data, config).then((response) => {
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

const deleteSex = (id) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.delete(Settings.API + ApiEndpoints.DELETE_SEX + id, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const setUserStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        const data = {'status': status}
        axios.put(Settings.API + ApiEndpoints.SET_USER_STATUS + id, data, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getSearchUsers = (keyword = "") => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        const data = {"keyword": keyword};
        axios.post(Settings.API + ApiEndpoints.SEARCH_USERS, data, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.get(Settings.API + ApiEndpoints.GET_USER_BY_ID + id, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
};


export {
    getMe,
    getToken,
    authenticate,
    logout,
    register,
    getSexList,
    addSex,
    deleteSex,
    setUserStatus,
    getSearchUsers,
    getUserById,
    // getUserData,
};