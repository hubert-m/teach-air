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

    // generuje token na podstawie adresu email i hasla
    $router->post('/auth/verify', ['uses' => 'AuthController@verify']);

    // Protected routes
    $router->group(
        ['middleware' => 'jwt.auth'],
        function () use ($router) {
            $router->get('/auth/verify', ['uses' => 'AuthController@verifyGet']);
            $router->get('/users/me', ['uses' => 'UserController@me']);

            $router->get('/courses', 'CourseController@index');
            $router->post('/courses', 'CourseController@create');
            $router->get('/courses/{id}', 'CourseController@show');
            $router->put('/courses/{id}', 'CourseController@update');
            $router->delete('/courses/{id}', 'CourseController@destroy');
        }
    );


});
