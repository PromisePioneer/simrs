<?php

use App\Http\Controllers\Api\General\AppointmentController;
use App\Http\Controllers\Api\General\Doctor\DoctorScheduleController;
use App\Http\Controllers\Api\Master\General\MedicalWork\SpecializationController;
use App\Http\Controllers\Api\Master\General\MedicalWork\SubSpecializationController;
use App\Http\Controllers\Api\Outpatient\OutpatientVisitController;
use App\Http\Controllers\Api\Outpatient\OutpatientVisitDashboardCountController;
use App\Http\Controllers\Api\QueueController;
use Domains\Clinical\Presentation\Controllers\DiagnoseController;
use Domains\Clinical\Presentation\Controllers\PrescriptionController;
use Domains\Inpatient\Presentation\Controllers\InpatientDailyCareController;
use Domains\Inpatient\Presentation\Controllers\InpatientDailyMedicationController;
use Domains\MedicalWork\Presentation\Controllers\ProfessionController;
use Illuminate\Support\Facades\Route;


//Domains
use Domains\Patient\Presentation\Controllers\PatientController;
use Domains\IAM\Presentation\Controllers\DegreeController;
use Domains\IAM\Presentation\Controllers\PoliController;
use Domains\IAM\Presentation\Controllers\DepartmentController;
use Domains\IAM\Presentation\Controllers\PaymentMethodController;
use Domains\IAM\Presentation\Controllers\PaymentMethodTypeController;
use Domains\IAM\Presentation\Controllers\RegistrationInstitutionController;
use Domains\IAM\Presentation\Controllers\RoomTypeController;
use Domains\Facility\Presentation\Controllers\BedController;
use Domains\Facility\Presentation\Controllers\RoomController;
use Domains\Facility\Presentation\Controllers\WardController;
use Domains\Facility\Presentation\Controllers\BuildingController;
use Domains\Inpatient\Presentation\Controllers\InpatientAdmissionController;
use Domains\Inpatient\Presentation\Controllers\BedAssignmentController;


// ── Free & semua plan ────────────────────────────────────────────────────────
Route::middleware(['module:Rawat Jalan'])->group(function () {
    Route::get('/patients/emr', [PatientController::class, 'emr']);
    Route::apiResource('/patients', PatientController::class);

    Route::apiResource('poli', PoliController::class);
    Route::apiResource('appointments', AppointmentController::class);
    Route::apiResource('doctor-schedules', DoctorScheduleController::class);

    Route::get('queues/count-today-queues', [QueueController::class, 'countTodayQueues']);
    Route::apiResource('queues', QueueController::class);
    Route::post('/queues/{queue}/start', [QueueController::class, 'startDiagnose']);

    Route::apiResource('/outpatient-visits', OutpatientVisitController::class);

    Route::prefix('outpatient-dashboard-reports')->group(function () {
        Route::get('/today-patient-count', [OutpatientVisitDashboardCountController::class, 'getTodayPatientCount']);
        Route::get('/today-patient-count-by-status', [OutpatientVisitDashboardCountController::class, 'getPatientBasedOnStatus']);
    });

    Route::prefix('diagnoses')->group(function () {
        Route::post('/{outpatientVisit}', [DiagnoseController::class, 'store']);
    });
});

// ── Basic & Pro ──────────────────────────────────────────────────────────────
Route::middleware(['module:Master'])->group(function () {
    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('registration-institutions', RegistrationInstitutionController::class);
    Route::apiResource('payment-method-types', PaymentMethodTypeController::class);
    Route::apiResource('payment-methods', PaymentMethodController::class);
    Route::apiResource('degrees', DegreeController::class);
    Route::apiResource('professions', ProfessionController::class);
    Route::apiResource('room-types', RoomTypeController::class);

    Route::prefix('specializations')->group(function () {
        Route::get('/', [SpecializationController::class, 'index']);
        Route::post('/', [SpecializationController::class, 'store']);
        Route::get('/{specialization}', [SpecializationController::class, 'show']);
        Route::put('/{specialization}', [SpecializationController::class, 'update']);
        Route::delete('/{specialization}', [SpecializationController::class, 'destroy']);
        Route::get('/professions/{profession}', [SpecializationController::class, 'getByProfession']);
    });

    Route::prefix('sub-specializations')->group(function () {
        Route::get('/', [SubSpecializationController::class, 'index']);
        Route::post('/', [SubSpecializationController::class, 'store']);
        Route::get('/{sub_specialization}', [SubSpecializationController::class, 'show']);
        Route::put('/{sub_specialization}', [SubSpecializationController::class, 'update']);
        Route::delete('/{sub_specialization}', [SubSpecializationController::class, 'destroy']);
        Route::get('/specializations/{specialization}', [SubSpecializationController::class, 'getBySpecializations']);
    });
});

Route::middleware(['module:Rawat Inap'])->group(function () {
    Route::prefix('facilities')->group(function () {
        Route::apiResource('buildings', BuildingController::class);
        Route::apiResource('wards', WardController::class);
        Route::apiResource('rooms', RoomController::class);
        Route::apiResource('beds', BedController::class);
    });

    Route::apiResource('inpatient-admissions', InpatientAdmissionController::class);

    Route::post('inpatient-admissions/{inpatientAdmission}/transfer-bed', [BedAssignmentController::class, 'transferBed']);

    Route::prefix('inpatient-admissions/{inpatientAdmission}/daily-medications')
        ->group(function () {
            Route::get('/', [InpatientDailyMedicationController::class, 'index']);
            Route::post('/', [InpatientDailyMedicationController::class, 'store']);
            Route::get('/{dailyMedication}', [InpatientDailyMedicationController::class, 'show']);
            Route::put('/{dailyMedication}', [InpatientDailyMedicationController::class, 'update']);
            Route::delete('/{dailyMedication}', [InpatientDailyMedicationController::class, 'destroy']);
            Route::post('/{dailyMedication}/dispense', [InpatientDailyMedicationController::class, 'dispense']);
            Route::post('/{dailyMedication}/cancel', [InpatientDailyMedicationController::class, 'cancel']);
        });

    Route::prefix('inpatient-admissions/{inpatientAdmission}/daily-cares')
        ->group(function () {
            Route::get('/', [InpatientDailyCareController::class, 'index']);
            Route::post('/', [InpatientDailyCareController::class, 'store']);
//            Route::get('/{dailyCare}', [InpatientDailyCareController::class, 'show']);
            Route::put('/{dailyCare}', [InpatientDailyCareController::class, 'update']);
            Route::delete('/{dailyCare}', [InpatientDailyCareController::class, 'destroy']);
        });
});

// ── Pro only ─────────────────────────────────────────────────────────────────
Route::middleware(['module:Electronic Medical Record'])->group(function () {
    Route::prefix('prescriptions')->group(function () {
        Route::apiResource('/', PrescriptionController::class);
        Route::post('/medication-dispensing/{prescription}', [PrescriptionController::class, 'medicationDispensing']);
    });
});
