import axios from "axios";
import Settings from "../constants/Settings";
import ApiEndpoints from "../constants/ApiEndpoints";

const uploadFile = (file, onUploadProgress) => {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append("file", file);

        console.log(formData);

        const config = {
            headers: {
                token: localStorage.getItem("userToken"),
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress
        };

        axios.post(Settings.API + ApiEndpoints.UPLOAD_FILE, formData, config).then((response) => {
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

const getFiles = () => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                token: localStorage.getItem("userToken"),
                "Content-type": "application/json"
            }
        };

        axios.get(Settings.API + ApiEndpoints.GET_FILES, config).then((response) => {
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
    uploadFile,
    getFiles
}