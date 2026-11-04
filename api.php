<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GenreController;
use App\Http\Controllers\Api\AuthorController;

// --- ROUTE PUBLIK (Tanpa Auth) ---
Route::post('/login', [AuthController::class, 'login']);

// Route khusus untuk: Read & Create Genre/Author
Route::get('/genres', [GenreController::class, 'index']);       // Read All Genres
Route::post('/genres', [GenreController::class, 'store']);      // Create Genre

Route::get('/authors', [AuthorController::class, 'index']);     // Read All Authors
Route::post('/authors', [AuthorController::class, 'store']);    // Create Author

// ✅ TAMBAHKAN ROUTE UPDATE & DELETE DI BAWAH INI:
Route::put('/genres/{id}', [GenreController::class, 'update']);      // Update Genre
Route::delete('/genres/{id}', [GenreController::class, 'destroy']);  // Delete Genre

Route::put('/authors/{id}', [AuthorController::class, 'update']);      // Update Author
Route::delete('/authors/{id}', [AuthorController::class, 'destroy']);  // Delete Author

// --- GROUP MIDDLEWARE AUTH (JWT) & ROLE ---
Route::middleware(['auth:api'])->group(function () {

    // --- ROUTE CUSTOMER ---
    Route::middleware('role:customer')->group(function () {
        Route::post('/transactions', [TransactionController::class, 'store']);
        Route::get('/transactions/{id}', [TransactionController::class, 'show']);
        Route::put('/transactions/{id}', [TransactionController::class, 'update']);
    });
});