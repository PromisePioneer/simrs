<?php

use App\Http\Controllers\Api\General\AppointmentController;
use App\Http\Controllers\Api\General\Doctor\DoctorScheduleController;
use App\Http\Controllers\Api\General\Patient\PatientController;
use App\Http\Controllers\Api\General\Patient\VisitListController;
use App\Http\Controllers\Api\Master\General\Degree\DegreeController;
use App\Http\Controllers\Api\Master\General\MedicalWork\ProfessionController;
use App\Http\Controllers\Api\Master\General\MedicalWork\SpecializationController;
use App\Http\Controllers\Api\Master\General\MedicalWork\SubSpecializationController;
use App\Http\Controllers\Api\Master\General\PaymentMethod\PaymentMethodController;
use App\Http\Controllers\Api\Master\General\PaymentMethod\PaymentMethodTypeController;
use App\Http\Controllers\Api\Master\General\Poli\PoliController;
use App\Http\Controllers\Api\Master\General\RegistrationInstitution\RegistrationInstitutionController;
use Illuminate\Support\Facades\Route;

// Core Resources
Route::apiResource('patients', PatientController::class);
Route::apiResource('poli', PoliController::class);
Route::apiResource('appointments', AppointmentController::class);
Route::apiResource('visit-lists', VisitListController::class);
Route::apiResource('doctor-schedules', DoctorScheduleController::class);

// Master Data
Route::apiResource('registration-institutions', RegistrationInstitutionController::class);
Route::apiResource('payment-method-types', PaymentMethodTypeController::class);
Route::apiResource('payment-methods', PaymentMethodController::class);
Route::apiResource('degrees', DegreeController::class);
Route::apiResource('professions', ProfessionController::class);

// Specializations
Route::prefix('specializations')->group(function () {
    Route::get('/', [SpecializationController::class, 'index']);
    Route::post('/', [SpecializationController::class, 'store']);
    Route::get('/{specialization}', [SpecializationController::class, 'show']);
    Route::put('/{specialization}', [SpecializationController::class, 'update']);
    Route::delete('/{specialization}', [SpecializationController::class, 'destroy']);
    Route::get('/professions/{profession}', [SpecializationController::class, 'getByProfession']);
});

// Sub-Specializations
Route::prefix('sub-specializations')->group(function () {
    Route::get('/', [SubSpecializationController::class, 'index']);
    Route::post('/', [SubSpecializationController::class, 'store']);
    Route::get('/{sub_specialization}', [SubSpecializationController::class, 'show']);
    Route::put('/{sub_specialization}', [SubSpecializationController::class, 'update']);
    Route::delete('/{sub_specialization}', [SubSpecializationController::class, 'destroy']);
    Route::get('/specializations/{specialization}', [SubSpecializationController::class, 'getBySpecializations']);
});
