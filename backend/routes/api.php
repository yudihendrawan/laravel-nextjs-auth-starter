<?php

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ManageUserController;
use App\Http\Controllers\Api\Admin\MasterDataController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AdminAuthController as AuthAdminAuthController;
use App\Http\Controllers\Api\Auth\CustomerAuthController as AuthCustomerAuthController;
use App\Http\Controllers\Api\Auth\MerchantAuthController as AuthMerchantAuthController;
use App\Http\Controllers\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Api\Auth\VerifyEmailController;
use App\Http\Controllers\Api\Customer\HomeController;
use App\Http\Controllers\Api\Merchant\ManageProductController;

// ========== auth admin ===========
Route::post('admin/register', [AuthAdminAuthController::class, 'register'])->middleware('api');
Route::post('admin/login', [AuthAdminAuthController::class, 'login']);
Route::post('admin/logout', [AuthAdminAuthController::class, 'logout']);
Route::post('admin/refresh', [AuthAdminAuthController::class, 'refresh']);
Route::post('admin/me', [AuthAdminAuthController::class, 'me']);
// ========== auth admin ===========

// ========== auth customer ===========
Route::post('customer/register', [AuthCustomerAuthController::class, 'register'])->middleware('api');
Route::get('customer/{code}', [AuthCustomerAuthController::class, 'getUserGoogle']);
Route::post('customer/login', [AuthCustomerAuthController::class, 'login']);
Route::post('customer/logout', [AuthCustomerAuthController::class, 'logout']);
Route::post('customer/refresh', [AuthCustomerAuthController::class, 'refresh']);
Route::post('customer/me', [AuthCustomerAuthController::class, 'me']);
// ========== auth customer ===========

// ========== auth merchant ===========
Route::post('merchant/register', [AuthMerchantAuthController::class, 'register'])->middleware('api');
Route::post('merchant/login', [AuthMerchantAuthController::class, 'login']);
Route::post('merchant/logout', [AuthMerchantAuthController::class, 'logout']);
Route::post('merchant/refresh', [AuthMerchantAuthController::class, 'refresh']);
Route::post('merchant/me', [AuthMerchantAuthController::class, 'me']);
// ========== auth merchant customer ===========



// Verify email
Route::get('/email/verify/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
    ->middleware(['throttle:6,1'])
    ->name('verification.verify');

Route::get('/verify/send/{uuid}', [VerifyEmailController::class, 'resend'])
    ->middleware(['throttle:6,1', 'api']);

Route::post('/user/forgot-password', [ResetPasswordController::class, 'forgotPassword'])
    ->middleware(['throttle:6,1']);
Route::get('/user/password/email-find/{token}', [ResetPasswordController::class, 'findEmail'])
    ->middleware(['throttle:6,1']);
Route::post('/user/password/reset-password', [ResetPasswordController::class, 'resetPassword'])
    ->middleware(['throttle:6,1']);

// Resend link to verify email
// Route::post('/email/verify/resend', function (Request $request) {
//     $request->user()->sendEmailVerificationNotification();
//     return back()->with('message', 'Verification link sent!');
// })->middleware(['auth:api', 'throttle:6,1'])->name('verification.send');

Route::middleware('auth:api')->group(function () {
    // Route::post('/verify-token', [VerifyToken::class, 'verifyToken']);
    // Route::get('email/verify', function () {
    //     return response()->json(['message' => 'Email verification notice']);
    // })->name('verification.notice');

    // Route::get('email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    //     $request->fulfill();
    //     Log::info('vrifty email');
    //     return response()->json(['message' => 'Email verified']);
    // })->middleware(['signed'])->name('verification.verify');

    // Route::post('email/resend', function (Request $request) {
    //     $request->user()->sendEmailVerificationNotification();
    //     return response()->json(['message' => 'Verification link sent']);
    // })->name('verification.resend');
});


Route::group(['middleware' => ['role:customer']], function () {
    Route::get('/', [HomeController::class, 'index']);
});

Route::group(['middleware' => ['role:admin']], function () {
    Route::get('/admin-dashboard', [DashboardController::class, 'index']);
    Route::get('/admin-dashboard/get-users', [ManageUserController::class, 'getUsers']);
    Route::put('/admin-dashboard/confirm-tenant', [ManageUserController::class, 'confirmRegisterTenant']);
    Route::get('/admin-dashboard/get-categories', [MasterDataController::class, 'getCategories']);
    Route::post('/admin-dashboard/add-category', [MasterDataController::class, 'addCategory']);
    Route::post('/admin-dashboard/add-sub-category', [MasterDataController::class, 'addSubCategory']);
});

Route::group(['middleware' => ['role:merchant']], function () {
    // Route::get('/merchant-dashboard', [RecruiterController::class, 'index']);
    Route::get('/merchant-dashboard/products', [ManageProductController::class, 'getProducts']);
    Route::post('/merchant-dashboard/products/add', [ManageProductController::class, 'addProduct']);
});
