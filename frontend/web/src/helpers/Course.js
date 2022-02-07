import axios from "axios";
import Settings from "../constants/Settings";
import ApiEndpoints from "../constants/ApiEndpoints";

const getCoursesList = (id = 0, only_favourites = false) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        const data = {parent_id: id, only_favourites: only_favourites}
        axios.post(Settings.API + ApiEndpoints.GET_COURSES_LIST, data, config).then((response) => {
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
            let message = "Nie udało się połączyć z serwerem";
            if (error.response && error.response.data.error) {
                message = error.response.data.error;
            }
            reject(message);
        });
    });
}

const getMembersOfCourse = (id) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.get(Settings.API + ApiEndpoints.GET_MEMBERS_OF_COURSE + id, config).then((response) => {
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

const addMember = (course_id, user_id) => {
    return new Promise((resolve, reject) => {
        const data = {course_id, user_id}
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.post(Settings.API + ApiEndpoints.ADD_MEMBER, data, config).then((response) => {
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

const deleteMember = (course_id, user_id) => {
    return new Promise((resolve, reject) => {
        const data = {course_id, user_id}
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.post(Settings.API + ApiEndpoints.DELETE_MEMBER, data, config).then((response) => {
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

const changeFavouriteCourse = (course_id) => {
    return new Promise((resolve, reject) => {
        const data = {course_id}
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.post(Settings.API + ApiEndpoints.CHANGE_FAVOURITE_COURSE, data, config).then((response) => {
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

const getCoursesListForSelect = () => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.get(Settings.API + ApiEndpoints.GET_COURSES_LIST_FOR_SELECT, config).then((response) => {
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

const editCourse = (course_id, data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.name)
            error = "Nie możesz zmienić nazwy kursu na puste pole";

        if (error) {
            reject(error);
            return;
        }

        const data_result = {
            ...data,
            icon: data?.icon?.value,
        }

        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.put(Settings.API + ApiEndpoints.UPDATE_COURSE + course_id, data_result, config).then((response) => {
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

const deleteCourse = (course_id) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.delete(Settings.API + ApiEndpoints.DELETE_COURSE + course_id, config).then((response) => {
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
    getCoursesList,
    addCourse,
    getCourse,
    getMembersOfCourse,
    addMember,
    deleteMember,
    changeFavouriteCourse,
    getCoursesListForSelect,
    editCourse,
    deleteCourse
}