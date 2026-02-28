<?php

use App\Http\Controllers\Api\Diagnose\DiagnoseController;
use App\Http\Controllers\Api\General\AppointmentController;
use App\Http\Controllers\Api\General\Doctor\DoctorScheduleController;
use App\Http\Controllers\Api\General\Patient\PatientController;
use App\Http\Controllers\Api\Master\General\Degree\DegreeController;
use App\Http\Controllers\Api\Master\General\MedicalWork\ProfessionController;
use App\Http\Controllers\Api\Master\General\MedicalWork\SpecializationController;
use App\Http\Controllers\Api\Master\General\MedicalWork\SubSpecializationController;
use App\Http\Controllers\Api\Master\General\PaymentMethod\PaymentMethodController;
use App\Http\Controllers\Api\Master\General\PaymentMethod\PaymentMethodTypeController;
use App\Http\Controllers\Api\Master\General\Poli\PoliController;
use App\Http\Controllers\Api\Master\General\RegistrationInstitution\RegistrationInstitutionController;
use App\Http\Controllers\Api\Medicine\PrescriptionController;
use App\Http\Controllers\Api\Outpatient\OutpatientVisitController;
use App\Http\Controllers\Api\Outpatient\OutpatientVisitDashboardCountController;
use App\Http\Controllers\Api\QueueController;
use Illuminate\Support\Facades\Route;

// Core Resources
Route::prefix('/patients')->group(function () {
    Route::apiResource('/', PatientController::class);
    Route::get('/emr', [PatientController::class, 'emr']);
});


Route::apiResource('poli', PoliController::class);
Route::apiResource('appointments', AppointmentController::class);
Route::apiResource('doctor-schedules', DoctorScheduleController::class);

// master Data
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


// Outpatients
Route::apiResource('queues', QueueController::class);


Route::prefix('queues')->group(function () {
    Route::apiResource('/', QueueController::class);
    Route::post('/{queue}/start', [QueueController::class, 'startDiagnose']);
});


Route::apiResource('/outpatient-visits', OutpatientVisitController::class);


Route::prefix('outpatient-dashboard-reports')->group(function () {
    Route::get('/today-patient-count', [OutpatientVisitDashboardCountController::class, 'getTodayPatientCount']);
    Route::get('/today-patient-count-by-status', [OutpatientVisitDashboardCountController::class, 'getPatientBasedOnStatus']);
});


Route::prefix('diagnoses')->group(function () {
    Route::post('/{outpatientVisit}', [DiagnoseController::class, 'store']);
});


Route::prefix('prescriptions')->group(function () {
    Route::apiResource('/', PrescriptionController::class);
    Route::post('/medication-dispensing/{prescription}', [PrescriptionController::class, 'medicationDispensing']);
});




