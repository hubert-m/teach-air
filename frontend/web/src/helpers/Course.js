import axios from "axios";
import Settings from "../constants/Settings";
import ApiEndpoints from "../constants/ApiEndpoints";

const getCoursesList = (id = 0) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        const data = {parent_id: id}
        axios.post(Settings.API + ApiEndpoints.GET_COURSES_LIST, data, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

const addCourse = (data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.name)
            error = "Musisz wpisać nazwę kursu";

        if (error) {
            reject(error);
            return;
        }

        const data_result = {
            ...data,
            icon: data?.icon?.value,
        }

        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.post(Settings.API + ApiEndpoints.ADD_COURSE, data_result, config).then((response) => {
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

const getCourse = (id) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.get(Settings.API + ApiEndpoints.GET_COURSE + id, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

export {
    getCoursesList,
    addCourse,
    getCourse
}