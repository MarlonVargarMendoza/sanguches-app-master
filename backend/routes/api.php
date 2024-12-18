<?php

use App\Http\Controllers\Product\ComboController;
use App\Http\Controllers\Product\CompanionController;
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
    Route::get('combo', [DrinkController::class, 'selectDrinksCombo']);
});

Route::prefix('sauces')->group(function () {
    Route::resource('', SauceController::class)->except(['create', 'edit', 'store', 'show', 'edit', 'update', 'destroy']);
});

Route::prefix('combo')->group(function () {
    Route::resource('', ComboController::class)->except(['create', 'edit', 'store', 'show', 'edit', 'update', 'destroy']);
});

Route::prefix('companions')->group(function () {
    Route::resource('', CompanionController::class)->except(['create', 'edit', 'store', 'show', 'edit', 'update', 'destroy']);
    Route::get('combo', [CompanionController::class, 'selectCompanionsCombo']);

});

Route::resource('typeProduct', TypeProductController::class);
