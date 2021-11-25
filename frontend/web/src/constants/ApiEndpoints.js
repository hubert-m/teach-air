const ApiEndpoints = {
    USERS_ME: '/users/me/',
    LOGIN: '/auth/verify/',
    REGISTER: '/users/',
    ALL_USERS: '/users/',
    GET_USER_BY_ID: '/users/', // :id
    SEX_LIST: '/users/sex_list/',
    SEX_ADD: '/users/sex_add/',
    SET_USER_STATUS: '/users/set_status/', // :id
    SEARCH_USERS: '/users/search/',
    SEND_MESSAGE: '/messages/send_message/',
    GET_MESSAGES: '/messages/get_messages/', // :id
    GET_CONTACT_LIST: '/messages/get_contact_list/',
}

export default ApiEndpoints;