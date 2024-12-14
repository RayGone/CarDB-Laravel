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

    Route::match(["get","post"],'/cars', [CarsController::class, 'index']);
    Route::get('/cars/{id}', [CarsController::class, 'show']);
    Route::post('/cars', [CarsController::class, 'store']);
    Route::put('/cars/{id}', [CarsController::class, 'update']);
    Route::delete('/cars/{id}', [CarsController::class, 'destroy']);
});
