<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
// use Laravel\Fortify\Features;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login', [
        // 'canRegister' => Features::enabled(Features::registration()),
        'canResetPassword' => false,
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('charts', function () {
        return Inertia::render('charts');
    })->name('charts');

    Route::post('/apiToken', function () {
        $user = request()->user();
        $token = '';
        if ($user) {
            $user = User::find($user['id']);
            $user->tokens()->delete();
            $token = $user->createToken('Access Token')->plainTextToken;
        }

        return response()->json([
            'apiToken' => $token,
        ]);
    })->name('getApiToken');
});

require __DIR__.'/settings.php';
