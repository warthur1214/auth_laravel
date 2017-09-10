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

//登录模块
Route::get('/login', 'LoginController@login');
Route::get('/', 'LoginController@index');
Route::post('/loginAjax', 'LoginController@loginAjax');
Route::get('/loginOut', 'LoginController@loginOut');

// 首页模块
Route::get('/index', 'LoginController@index');
Route::get("/index/menu", "LoginController@menu");
Route::get('/index/main', 'LoginController@main');