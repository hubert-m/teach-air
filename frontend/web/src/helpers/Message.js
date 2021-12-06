import axios from "axios";
import Settings from "../constants/Settings";
import ApiEndpoints from "../constants/ApiEndpoints";

const getContacts = () => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.get(Settings.API + ApiEndpoints.GET_CONTACT_LIST, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

const getMessages = (id) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.get(Settings.API + ApiEndpoints.GET_MESSAGES + id, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

const sendMessage = (data) => {
    return new Promise((resolve, reject) => {
        let error = null;
        if (!data.message)
            error = "Musisz wpisać treść wiadomości";

        if (error) {
            reject(error);
            return;
        }
        console.log(data);
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.post(Settings.API + ApiEndpoints.SEND_MESSAGE, data, config).then((response) => {
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
    getContacts,
    getMessages,
    sendMessage
}