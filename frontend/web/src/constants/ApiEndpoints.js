const ApiEndpoints = {
    USERS_ME: '/users/me/',
    LOGIN: '/auth/verify/',
    REGISTER: '/users/',
    GET_USER_BY_ID: '/users/', // :id

    SEX_LIST: '/users/sex_list/',
    SEX_ADD: '/users/sex_add/',
    DELETE_SEX: '/users/delete_sex/', // :id

    SET_USER_STATUS: '/users/set_status/', // :id
    SEARCH_USERS: '/users/search/',

    SEND_MESSAGE: '/messages/send_message/',
    GET_MESSAGES: '/messages/get_messages/', // :id
    GET_CONTACT_LIST: '/messages/get_contact_list/',

    GET_COURSES_LIST: '/courses/get_courses_list',
    GET_COURSE: '/courses/get_course/', // :id
    ADD_COURSE: '/courses/create_course',
    ADD_MEMBER: '/courses/add_member',
    GET_MEMBERS_OF_COURSE: '/courses/get_members_of_course/' // :id
}

export default ApiEndpoints;