const Routes = {
    HOME: '/',
    LOGIN: '/login',
    LOGOUT: '/logout',
    FORGET_PASSWORD: '/forget-password',
    FORGET_PASSWORD_WITH_CODE: '/forget-password/', // :code (można traktować jak unique, nie trzeba przekazywać id usera)
    REGISTER: '/register',
    SETTINGS: '/account/settings',
    USER_ACTIVATION_MAIN: '/activation',
    USER_ACTIVATION: '/activation/', // :code (można traktować jak unique, nie trzeba przekazywać id usera)
    GLOBAL_SETTINGS: '/settings/home', // samo /settings powoduje, że zakladka w menu jest caly czas zaznaczona
    GLOBAL_SETTINGS_USERS: '/settings/users',
    GLOBAL_SETTINGS_SEX: '/settings/sex',
    GLOBAL_SETTINGS_SITE_OPTIONS: '/settings/options',
    MESSAGES_LIST: '/messages',
    MESSAGES_WITH_USER: '/messages/', // :id
    MAIN_COURSES: '/courses',
    SUB_COURSES: '/courses/', // :id
    THREAD: '/thread/', // :id
    HOSTING_FILES: '/files',
    QUIZZES: '/quizzes',
    QUIZ: '/quiz/', // :id
    QUIZ_EDIT: '/quiz/edit/' // :id
}

export default Routes;