<?php

use App\Http\Controllers\Api\Diagnose\DiagnoseController;
use App\Http\Controllers\Api\Facilities\Building\BuildingController;
use App\Http\Controllers\Api\Facilities\Room\RoomTypeController;
use App\Http\Controllers\Api\Facilities\Ward\WardController;
use App\Http\Controllers\Api\General\AppointmentController;
use App\Http\Controllers\Api\General\Doctor\DoctorScheduleController;
use App\Http\Controllers\Api\General\Patient\PatientController;
use App\Http\Controllers\Api\Master\General\Degree\DegreeController;
use App\Http\Controllers\Api\Master\General\Department\DepartmentController;
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
Route::get('/patients/emr', [PatientController::class, 'emr']);
Route::apiResource('/patients', PatientController::class);


Route::apiResource('poli', PoliController::class);
Route::apiResource('appointments', AppointmentController::class);
Route::apiResource('doctor-schedules', DoctorScheduleController::class);
Route::apiResource('departments', DepartmentController::class);


// master Data
Route::apiResource('registration-institutions', RegistrationInstitutionController::class);
Route::apiResource('payment-method-types', PaymentMethodTypeController::class);
Route::apiResource('payment-methods', PaymentMethodController::class);
Route::apiResource('degrees', DegreeController::class);
Route::apiResource('professions', ProfessionController::class);
Route::apiResource('room-types', RoomTypeController::class);


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
Route::get('queues/count-today-queues', [QueueController::class, 'countTodayQueues']);
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


// inpatient
Route::prefix('facilities')->group(function () {
    Route::apiResource('buildings', BuildingController::class);
    Route::apiResource('wards', WardController::class);
});
