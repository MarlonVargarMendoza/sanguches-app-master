<?php

use App\Http\Controllers\Product\DrinkController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Product\SauceController;
use App\Http\Controllers\Product\TypeProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::resource('products', ProductController::class)->except('create', 'edit', 'store', 'edit', 'update', 'destroy');
Route::get('additions', [ProductController::class, 'additions']);

Route::prefix('drinks')->group(function () {
    Route::resource('', DrinkController::class)->except(['create', 'edit', 'store', 'show', 'edit', 'update', 'destroy']);
    Route::get('select', [DrinkController::class, 'selectDrinks']);
});

Route::prefix('sauces')->group(function () {
    Route::resource('', SauceController::class)->except(['create', 'edit', 'store', 'show', 'edit', 'update', 'destroy']);
});

Route::resource('typeProduct', TypeProductController::class);
