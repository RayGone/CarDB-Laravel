<?php

use App\Http\Controllers\CarsController;
use App\Http\Controllers\ChartsController;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\ThrottleRequests;
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
    })->name('api.user');

    Route::group(['prefix' => 'charts'], function () {
        Route::post('/countPerYear', [ChartsController::class, 'modelPerYear'])->name('api.charts.countPerYear');
        Route::post('/carAttributes', [ChartsController::class, 'highLowAttributes'])->name('api.charts.carAttributes');
    });

    Route::group(['prefix' => 'cars'], function () {
        Route::get('/', [CarsController::class, 'index'])->name('api.cars.getbyquery');
        Route::post('/filterSearch', [CarsController::class, 'index'])->name('api.cars.getbyfilter');
        Route::get('/{id}', [CarsController::class, 'show'])->name('api.cars.getbyid');
        Route::middleware(ThrottleRequests::with(20, 1))->group(function () {// 20 requests per minute.
            Route::post('/', [CarsController::class, 'store'])
                ->name('api.cars.add');
            Route::patch('/{id}', [CarsController::class, 'update'])->name('api.cars.edit');
            Route::delete('/{id}', [CarsController::class, 'destroy'])->name('api.cars.delete');
        });

        Route::match(['GET', 'POST'], '/download/{type}', [CarsController::class, 'download'])
            ->name('api.cars.download')
            ->withoutMiddleware('auth:sanctum')
            ->middleware(ThrottleRequests::with(5, 2));

    });
})->namespace('Cars');
