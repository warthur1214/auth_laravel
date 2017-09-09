<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {

    if (session("auth_account_id")) {
        return response()->view('index.index');
    } else {
        return response()->view('index.login');
    }

});

Route::get('/login', 'LoginController@login');
Route::post('/loginAjax', 'LoginController@loginAjax');