const ApiEndpoints = {
    USERS_ME: '/users/me',
    UPDATE_ME: '/users/update_me',
    CHANGE_PASSWORD: '/users/change_password',
    LOGIN: '/auth/verify',
    REGISTER: '/users',
    GET_USER_BY_ID: '/users/', // :id
    SEND_ACTIVATION_AGAIN: '/users/send_activation_again',
    ACTIVATE_ACCOUNT: '/users/activate_account',
    SEND_RESET_PASSWORD: '/users/send_reset_password', // oprogramowac TODO
    RESET_PASSWORD: '/users/reset_password', // oprogramowac TODO

    SEX_LIST: '/users/sex_list',
    SEX_ADD: '/users/sex_add',
    DELETE_SEX: '/users/delete_sex/', // :id

    SET_USER_STATUS: '/users/set_status/', // :id
    SEARCH_USERS: '/users/search',
    SET_PROFILE_IMAGE: '/users/set_profile_image',

    SEND_MESSAGE: '/messages/send_message',
    GET_MESSAGES: '/messages/get_messages/', // :id
    GET_CONTACT_LIST: '/messages/get_contact_list',

    GET_COURSES_LIST: '/courses/get_courses_list',
    GET_COURSE: '/courses/get_course/', // :id
    ADD_COURSE: '/courses/create_course',
    ADD_MEMBER: '/courses/add_member',
    DELETE_MEMBER: '/courses/delete_member',
    GET_MEMBERS_OF_COURSE: '/courses/get_members_of_course/', // :id
    CHANGE_FAVOURITE_COURSE: '/courses/change_favourite_course',
    GET_COURSES_LIST_FOR_SELECT: '/courses/get_courses_list_for_select',

    UPLOAD_FILE: '/files/upload',
    SEARCH_FILES: '/files/search',
    DELETE_FILE: '/files/delete_file/', // :id

    GET_OPTIONS: '/options/get_options',
    UPDATE_OPTIONS: '/options/update_options',
    ADD_OPTION: '/options/add_option',

    ADD_THREAD: '/threads/add_thread',
    GET_THREAD: '/threads/get_thread/', // :id
    GET_THREADS_LIST: '/threads/get_threads_list',

    GET_POSTS_LIST: '/posts/get_posts_list',
    ADD_POST: '/posts/add_post',

    QUIZZES_LIST: '/quizzes/get_quizzes',
    GET_QUIZ: '/quizzes/get_quiz/', // :id
    CREATE_QUIZ: '/quizzes/create_quiz',
    DELETE_QUIZ: '/quizzes/delete_quiz/', // :id

    CREATE_QUESTION: '/questions/create_question',
    GET_RANDOM_QUESTION: '/questions/random_question/', // :quiz_id
    GET_QUESTION: '/questions/get_question/', // :id
    GET_QUESTIONS: '/questions/get_questions/', // :quiz_id
    CHECK_ANSWER: '/questions/check_answer' // POST
}

export default ApiEndpoints;