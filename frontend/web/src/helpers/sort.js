import {isNull} from 'lodash';

const sortAsc = (arr, field, subfield = null, isDate = false) => {
    return arr.sort((a, b) => {
        let fieldA = a[field];
        let fieldB = b[field];

        if(!isNull(subfield)) {
            fieldA = a[field][subfield];
            fieldB = b[field][subfield];
        }

        if (typeof fieldA =='string' || fieldA instanceof String) {
            if(isDate) {
                fieldA = new Date(fieldA);
                fieldB = new Date(fieldB);
                return fieldB - fieldA;
            } else {
                fieldA = fieldA.toUpperCase();
                fieldB = fieldB.toUpperCase();
            }
        }

        if (fieldA > fieldB) {
            return 1;
        }
        if (fieldB > fieldA) {
            return -1;
        }
        return 0;
    })
}

const sortDesc = (arr, field, subfield = null, isDate = false) => {
    return arr.sort((a, b) => {
        let fieldA = a[field];
        let fieldB = b[field];

        if(!isNull(subfield)) {
            fieldA = a[field][subfield];
            fieldB = b[field][subfield];
        }

        if (typeof fieldA =='string' || fieldA instanceof String) {
            if(isDate) {
                fieldA = new Date(fieldA);
                fieldB = new Date(fieldB);
                return fieldB - fieldA;
            } else {
                fieldA = fieldA.toUpperCase();
                fieldB = fieldB.toUpperCase();
            }
        }

        if (fieldA > fieldB) {
            return -1;
        }
        if (fieldB > fieldA) {
            return 1;
        }
        return 0;
    })
}

export {
    sortAsc,
    sortDesc,
}