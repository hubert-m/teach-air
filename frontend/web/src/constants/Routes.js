const Routes = {
    HOME: '/',
    LOGIN: '/login',
    LOGOUT: '/logout',
    FORGET_PASSWORD: '/forget-password',
    REGISTER: '/register',
    SETTINGS: '/account/settings',
    USER_ACTIVATION_MAIN: '/activation',
    USER_ACTIVATION: '/activation/', // :code (można traktować jak unique, nie trzeba przekazywać id usera)
    GLOBAL_SETTINGS: '/settings',
    GLOBAL_SETTINGS_USERS: '/settings/users',
    GLOBAL_SETTINGS_SEX: '/settings/sex',
    GLOBAL_SETTINGS_SITE_OPTIONS: '/settings/options',
    MESSAGES_LIST: '/messages',
    MESSAGES_WITH_USER: '/messages/', // :id
    MAIN_COURSES: '/courses',
    SUB_COURSES: '/courses/', // :id
    THREAD: '/thread/', // :id
    HOSTING_FILES: '/files',
    QUIZ: '/quiz'
}

export default Routes;