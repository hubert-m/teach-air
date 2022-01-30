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
                if (error.response.status == 400 || error.response.status == 401) {
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

const updateMe = (data) => {
    return new Promise((resolve, reject) => {

        let error = null;

        if (!data.name || !data.lastname || !data.sex_id)
            error = "Nie możesz skasować zawartości wymaganych pól";

        if (error) {
            reject(error);
            return;
        }

        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.post(Settings.API + ApiEndpoints.UPDATE_ME, data, config).then((response) => {
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

const changePassword = (data) => {
    return new Promise((resolve, reject) => {

        let error = null;

        if (!data?.new_password || !data?.new_password_repeat || !data?.old_password)
            error = "Musisz wypełnić wszystkie pola";

        if (data?.new_password != data?.new_password_repeat)
            error = "Nowe hasła nie są identyczne";

        if (error) {
            reject(error);
            return;
        }

        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.post(Settings.API + ApiEndpoints.CHANGE_PASSWORD, data, config).then((response) => {
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

const getSearchUsers = (keyword = "", course_id = "", status = "", sex_id = "") => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        const data = {"keyword": keyword, "without_members_of_course_id": course_id, "status": status, "sex_id": sex_id};
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

const setProfileImage = (profileImageUrl) => {
    return new Promise((resolve, reject) => {

        /*
        let error = null;

        if (!profileImageUrl)
            error = "Brakuje URL obrazka";
            // uzywamy tez do usuwania zdjecia


        if (error) {
            reject(error);
            return;
        }

         */

        const data = {
            profile_image: profileImageUrl
        }

        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.post(Settings.API + ApiEndpoints.SET_PROFILE_IMAGE, data, config).then((response) => {
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

const sendActivationAgain = (data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.email)
            error = "Musisz podać email";
        else if (!validateEmail(data.email))
            error = "Wprowadzony adres e-mail jest nieprawidłowy";

        if (error) {
            reject(error);
            return;
        }

        axios.post(Settings.API + ApiEndpoints.SEND_ACTIVATION_AGAIN, data).then((response) => {
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

const activateAccount = (data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.activate_token)
            error = "Musisz podać kod aktywacyjny";

        if (error) {
            reject(error);
            return;
        }

        axios.post(Settings.API + ApiEndpoints.ACTIVATE_ACCOUNT, data).then((response) => {
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

const sendResetPassword = (data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.email)
            error = "Musisz podać email";
        else if (!validateEmail(data.email))
            error = "Wprowadzony adres e-mail jest nieprawidłowy";

        if (error) {
            reject(error);
            return;
        }

        axios.post(Settings.API + ApiEndpoints.SEND_RESET_PASSWORD, data).then((response) => {
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

const resetPassword = (data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.activate_token)
            error = "Musisz podać kod do resetu hasła";
        else if(data.password != data.repeat_password)
            error = "Wprowadzone hasła nie są takie same";

        if (error) {
            reject(error);
            return;
        }

        axios.post(Settings.API + ApiEndpoints.RESET_PASSWORD, data).then((response) => {
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


export {
    getMe,
    updateMe,
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
    setProfileImage,
    changePassword,
    sendActivationAgain,
    activateAccount,
    sendResetPassword,
    resetPassword
    // getUserData,
};