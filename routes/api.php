<?php

use App\Http\Controllers\CarsController;
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

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/cars', [CarsController::class, 'index'])->name("Fetch Cars with GET");
    Route::post('/cars/filterSearch', [CarsController::class, 'index'])->name("Fetch Cars with POST");
    Route::get('/cars/{id}', [CarsController::class, 'show'])->name("Get Car By ID");
    Route::post('/cars', [CarsController::class, 'store'])->name("Add Car");
    Route::put('/cars/{id}', [CarsController::class, 'update'])->name("Update Car");
    Route::delete('/cars/{id}', [CarsController::class, 'destroy'])->name("Delete Car");
});
