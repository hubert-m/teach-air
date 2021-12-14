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
    return $router->app->version();
});

$router->group(['prefix'=>'api/v1'], function() use($router){

    // generuje token na podstawie adresu email i hasla - nie wymaga podania tokenu, bo go jeszcze nie ma
    $router->post('/auth/verify', ['uses' => 'AuthController@verify']);
    // rejestracja nowego użytkownika - nie wymaga tokenu
    $router->post('/users', 'UserController@create');
    // lista płci potrzebna przy rejestracji - nie wymaga tokenu
    $router->get('/users/sex_list', 'UserController@sex_list');

    // Protected routes
    $router->group(
        ['middleware' => 'jwt.auth'],
        function () use ($router) {

            //$router->put('/courses/{id}', 'CourseController@update');
            //$router->delete('/courses/{id}', 'CourseController@destroy');

            $router->get('/users/me', ['uses' => 'UserController@me']);
            //$router->put('/users/{id}', 'UserController@update');
            //$router->delete('/users/{id}', 'UserController@destroy');

            $router->post('/users/sex_add', 'UserController@sex_add');
            $router->delete('/users/delete_sex/{id}', 'UserController@delete_sex');

            $router->post('/users/search', 'UserController@search');
            $router->put('/users/set_status/{id}', 'UserController@set_status');
            $router->get('/users/{id}', 'UserController@show');
            $router->post('/users/update_me', 'UserController@update_me');
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

            $router->post('/files/upload', 'FileController@upload');
            $router->post('/files/search', 'FileController@search');
            $router->delete('/files/delete_file/{id}', 'FileController@delete_file');

            $router->get('/options/get_options', 'OptionController@get_options');
            $router->post('/options/update_options', 'OptionController@update_options');
            $router->post('/options/add_option', 'OptionController@add_option');

            $router->post('/threads/add_thread', 'ThreadController@add_thread');
        }
    );


});
