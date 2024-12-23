<?php

use App\Http\Controllers\Order\OrderController;
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

// Products Routes
Route::resource('products', ProductController::class)->except(['create', 'edit', 'store', 'update', 'destroy'])->names('products');
Route::get('additions', [ProductController::class, 'additions'])->name('products.additions');

// Drinks Routes
Route::prefix('drinks')->group(function () {
    Route::resource('/', DrinkController::class)->except(['create', 'edit', 'store', 'show', 'update', 'destroy'])->names('drinks');
    Route::get('select', [DrinkController::class, 'selectDrinks'])->name('drinks.select');
    Route::get('combo', [DrinkController::class, 'selectDrinksCombo'])->name('drinks.combo');
});

// Sauces Routes
Route::prefix('sauces')->group(function () {
    Route::resource('/', SauceController::class)->except(['create', 'edit', 'store', 'show', 'update', 'destroy'])->names('sauces');
});

// Combo Routes
Route::prefix('combo')->group(function () {
    Route::resource('/', ComboController::class)->except(['create', 'edit', 'store', 'show', 'update', 'destroy'])->names('combo');
});

// Companions Routes
Route::prefix('companions')->group(function () {
    Route::resource('/', CompanionController::class)->except(['create', 'edit', 'store', 'show', 'update', 'destroy'])->names('companions');
    Route::get('combo', [CompanionController::class, 'selectCompanionsCombo'])->name('companions.combo');
});

// Type Product Routes
Route::resource('typeProduct', TypeProductController::class)->names('typeProduct');

// Orders Routes
Route::prefix('orders')->group(function () {
    Route::resource('/', OrderController::class)->except(['create', 'edit', 'show', 'update', 'destroy'])->names('orders');
});
