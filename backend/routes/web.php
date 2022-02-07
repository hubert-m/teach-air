<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version()." - Teach-Air - Projekt inżynierski Hubert Machała - Backend działa poprawnie :)";
});


// generuje token na podstawie adresu email i hasla - nie wymaga podania tokenu, bo go jeszcze nie ma
$router->post('/auth/verify', ['uses' => 'AuthController@verify']);
// rejestracja nowego użytkownika - nie wymaga tokenu
$router->post('/users', 'UserController@create');
// lista płci potrzebna przy rejestracji - nie wymaga tokenu
$router->get('/users/sex_list', 'UserController@sex_list');

$router->post('/users/send_activation_again', 'UserController@send_activation_again');

// przyjmuje kod aktywacji i emaila => aktywuje konto - status 1
$router->post('/users/activate_account', 'UserController@activate_account');

$router->post('/users/send_reset_password', 'UserController@send_reset_password');

$router->post('/users/reset_password', 'UserController@reset_password');

// Protected routes
$router->group(
    ['middleware' => 'jwt.auth'],
    function () use ($router) {
        $router->get('/users/me', ['uses' => 'UserController@me']);

        $router->post('/users/sex_add', 'UserController@sex_add');
        $router->delete('/users/delete_sex/{id}', 'UserController@delete_sex');

        $router->post('/users/search', 'UserController@search');
        $router->put('/users/set_status/{id}', 'UserController@set_status');
        $router->get('/users/{id}', 'UserController@show');
        $router->post('/users/update_me', 'UserController@update_me');
        $router->post('/users/change_password', 'UserController@change_password'); // dla zalogowanego usera
        $router->post('/users/set_profile_image', 'UserController@set_profile_image');

        $router->post('/messages/send_message', 'MessageController@send_message');
        $router->get('/messages/get_messages/{id}', 'MessageController@get_messages');
        $router->get('/messages/get_contact_list', 'MessageController@get_contact_list');

        $router->post('/courses/get_courses_list', 'CourseController@get_courses_list');
        $router->get('/courses/get_course/{id}', 'CourseController@get_course');
        $router->post('/courses/create_course', 'CourseController@create_course');
        $router->get('/courses/get_members_of_course/{id}', 'CourseController@get_members_of_course');
        $router->post('/courses/add_member', 'CourseController@add_member');
        $router->post('/courses/delete_member', 'CourseController@delete_member');
        $router->post('/courses/change_favourite_course', 'CourseController@change_favourite_course');
        $router->get('/courses/get_courses_list_for_select', 'CourseController@get_courses_list_for_select');
        $router->delete('/courses/delete_course/{id}', 'CourseController@delete_course');
        $router->put('/courses/update_course/{id}', 'CourseController@update_course');

        $router->post('/files/upload', 'FileController@upload');
        $router->post('/files/search', 'FileController@search');
        $router->delete('/files/delete_file/{id}', 'FileController@delete_file');

        $router->get('/options/get_options', 'OptionController@get_options');
        $router->post('/options/update_options', 'OptionController@update_options');
        $router->post('/options/add_option', 'OptionController@add_option');

        $router->post('/threads/add_thread', 'ThreadController@add_thread');
        $router->get('/threads/get_thread/{id}', 'ThreadController@get_thread');
        $router->post('/threads/get_threads_list', 'ThreadController@get_threads_list');

        $router->post('/posts/get_posts_list', 'ThreadController@get_posts_list');
        $router->post('/posts/add_post', 'ThreadController@add_post');

        $router->post('/quizzes/create_quiz', 'QuizController@create_quiz');
        $router->put('/quizzes/update_quiz/{id}', 'QuizController@update_quiz');
        $router->get('/quizzes/get_quiz/{id}', 'QuizController@get_quiz');
        $router->get('/quizzes/get_quizzes', 'QuizController@get_quizzes_list');
        $router->delete('/quizzes/delete_quiz/{id}', 'QuizController@delete_quiz');
        $router->post('/quizzes/finish_quiz', 'QuizController@finish_quiz');
        $router->get('/quizzes/users_finished/{quiz_id}', 'QuizController@users_finished_quiz');
        $router->post('/quizzes/give_another_chance', 'QuizController@give_another_chance');

        $router->post('/questions/create_question', 'QuizController@create_question');
        $router->get('/questions/random_question/{quiz_id}', 'QuizController@random_question');
        $router->get('/questions/get_question/{id}', 'QuizController@get_question');
        $router->get('/questions/get_questions/{quiz_id}', 'QuizController@get_questions_list');
        $router->post('/questions/check_answer', 'QuizController@check_correct_answer');
        $router->delete('/questions/delete_question/{id}', 'QuizController@delete_question');
        $router->put('/questions/update_question/{id}', 'QuizController@update_question');
    }
);

