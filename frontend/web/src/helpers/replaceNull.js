import {isEmpty, isNull} from "lodash";

const replaceNull = (list) => {
    if (!isEmpty(list)) {
        Object.keys(list).forEach(function (key) {
            if (isNull(list[key])) {
                list[key] = "";
            }
        });
    }
    return list;
}

export default replaceNull;