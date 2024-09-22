<?php

use App\Http\Controllers\Api\Auth\CustomerGoogleController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('login', function () {
    return view('login');
})->name('login');

Route::get('customer/oauth/google', [CustomerGoogleController::class, 'redirectToGoogle']);
Route::get('customer/oauth/google/callback', [CustomerGoogleController::class, 'handleGoogleCallback']);
