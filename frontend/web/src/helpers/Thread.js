import axios from "axios";
import Settings from "../constants/Settings";
import ApiEndpoints from "../constants/ApiEndpoints";

const addThread = (data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.title)
            error = "Musisz wpisać tytuł wątku";

        if (!data.content)
            error = "Musisz wpisać treść pierwszego postu";

        if (error) {
            reject(error);
            return;
        }

        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.post(Settings.API + ApiEndpoints.ADD_THREAD, data, config).then((response) => {
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

const getThreadsList = (id) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        const data = {course_id: id}
        axios.post(Settings.API + ApiEndpoints.GET_THREADS_LIST, data, config).then((response) => {
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
    addThread,
    getThreadsList
}