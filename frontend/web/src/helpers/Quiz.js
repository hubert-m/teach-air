import axios from "axios";
import Settings from "../constants/Settings";
import ApiEndpoints from "../constants/ApiEndpoints";

const getQuizzesList = () => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.get(Settings.API + ApiEndpoints.QUIZZES_LIST, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            let message = "Nie udało się połączyć z serwerem";
            if (error.response && error.response.data.error) {
                message = error.response.data.error;
            }
            reject(message);
        });
    });
};

const addQuiz = (data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.title)
            error = "Musisz wpisać tytuł quizu";

        if (error) {
            reject(error);
            return;
        }

        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.post(Settings.API + ApiEndpoints.CREATE_QUIZ, data, config).then((response) => {
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

const updateQuiz = (id, data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.title)
            error = "Nie możesz zmienić tytułu na pusty";

        if (error) {
            reject(error);
            return;
        }

        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.put(Settings.API + ApiEndpoints.UPDATE_QUIZ + id, data, config).then((response) => {
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

const deleteQuiz = (id) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.delete(Settings.API + ApiEndpoints.DELETE_QUIZ + id, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            let message = "Nie udało się połączyć z serwerem";
            if (error.response && error.response.data.error) {
                message = error.response.data.error;
            }
            reject(message);
        });
    });
};

const getQuizById = (id) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.get(Settings.API + ApiEndpoints.GET_QUIZ + id, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            let message = "Nie udało się połączyć z serwerem";
            if (error.response && error.response.data.error) {
                message = error.response.data.error;
            }
            reject(message);
        });
    });
};

const finishQuiz = (data) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.post(Settings.API + ApiEndpoints.FINISH_QUIZ, data, config).then((response) => {
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

const getQuestionsList = (quiz_id) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.get(Settings.API + ApiEndpoints.GET_QUESTIONS + quiz_id, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            let message = "Nie udało się połączyć z serwerem";
            if (error.response && error.response.data.error) {
                message = error.response.data.error;
            }
            reject(message);
        });
    });
};

const addQuestion = (quiz_id, data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.correct_answer)
            error = "Musisz oznaczyć prawidłową odpowiedź na pytanie";

        if(!data.answer_a || !data.answer_b || !data.answer_c || !data.answer_d)
            error = "Musisz wpisać wszystkie 4 możliwe odpowiedzi";

        if (!data.question)
            error = "Musisz wpisać treść pytania";

        if (error) {
            reject(error);
            return;
        }

        data = {
            ...data,
            quiz_id: quiz_id
        }

        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.post(Settings.API + ApiEndpoints.CREATE_QUESTION, data, config).then((response) => {
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

const updateQuestion = (question_id, data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.correct_answer)
            error = "Musisz oznaczyć prawidłową odpowiedź na pytanie";

        if(!data.answer_a || !data.answer_b || !data.answer_c || !data.answer_d)
            error = "Nie możesz zmienić odpowiedzi na puste";

        if (!data.question)
            error = "Nie możesz zmienić treści pytania na puste pole";

        if (error) {
            reject(error);
            return;
        }

        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.put(Settings.API + ApiEndpoints.UPDATE_QUESTION + question_id, data, config).then((response) => {
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

const deleteQuestion = (id) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.delete(Settings.API + ApiEndpoints.DELETE_QUESTION + id, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            let message = "Nie udało się połączyć z serwerem";
            if (error.response && error.response.data.error) {
                message = error.response.data.error;
            }
            reject(message);
        });
    });
};

const getListOfFinishedUsers = (quiz_id) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.get(Settings.API + ApiEndpoints.GET_USERS_FINISHED_QUIZ + quiz_id, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            let message = "Nie udało się połączyć z serwerem";
            if (error.response && error.response.data.error) {
                message = error.response.data.error;
            }
            reject(message);
        });
    });
};

const giveAnotherChance = (data) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.post(Settings.API + ApiEndpoints.GIVE_ANOTHER_CHANCE, data, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            let message = "Nie udało się połączyć z serwerem";
            if (error.response && error.response.data.error) {
                message = error.response.data.error;
            }
            reject(message);
        });
    });
};

export {
    getQuizzesList,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    getQuizById,
    finishQuiz,
    getQuestionsList,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    getListOfFinishedUsers,
    giveAnotherChance
}