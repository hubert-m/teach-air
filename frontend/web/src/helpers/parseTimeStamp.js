import {isEmpty} from 'lodash';

const parseTimeStamp = (date) => {
    if (isEmpty(date)) {
        return date;
    }
    return new Intl.DateTimeFormat('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}

export default parseTimeStamp;