<?php

use App\Http\Controllers\Api\Outpatient\OutpatientVisitDashboardCountController;
use Domains\Clinical\Presentation\Controllers\DiagnoseController;
use Domains\Clinical\Presentation\Controllers\PrescriptionController;
use Domains\Facility\Presentation\Controllers\BedController;
use Domains\Facility\Presentation\Controllers\BuildingController;
use Domains\Facility\Presentation\Controllers\RoomController;
use Domains\Facility\Presentation\Controllers\WardController;
use Domains\Inpatient\Presentation\Controllers\BedAssignmentController;
use Domains\Inpatient\Presentation\Controllers\InpatientAdmissionController;
use Domains\Inpatient\Presentation\Controllers\InpatientDailyCareController;
use Domains\Inpatient\Presentation\Controllers\InpatientDailyMedicationController;
use Domains\MasterData\Persentation\Controllers\DegreeController;
use Domains\MasterData\Persentation\Controllers\DepartmentController;
use Domains\MasterData\Persentation\Controllers\DiseaseController;
use Domains\MasterData\Persentation\Controllers\PaymentMethodController;
use Domains\MasterData\Persentation\Controllers\PaymentMethodTypeController;
use Domains\MasterData\Persentation\Controllers\PoliController;
use Domains\MasterData\Persentation\Controllers\RegistrationInstitutionController;
use Domains\MasterData\Persentation\Controllers\RoomTypeController;
use Domains\MedicalWork\Presentation\Controllers\DoctorScheduleController;
use Domains\MedicalWork\Presentation\Controllers\ProfessionController;
use Domains\MedicalWork\Presentation\Controllers\SpecializationController;
use Domains\MedicalWork\Presentation\Controllers\SubSpecializationController;
use Domains\Outpatient\Presentation\Controllers\AppointmentController;
use Domains\Outpatient\Presentation\Controllers\OutpatientVisitController;
use Domains\Outpatient\Presentation\Controllers\QueueController;
use Domains\Patient\Presentation\Controllers\PatientController;
use Illuminate\Support\Facades\Route;


//Domains


// ── Free & semua plan ────────────────────────────────────────────────────────
Route::middleware(['module:Rawat Jalan'])->group(function () {
    Route::get('/patients/emr', [PatientController::class, 'emr']);
    Route::apiResource('/patients', PatientController::class);

    Route::apiResource('poli', PoliController::class);
    Route::apiResource('appointments', AppointmentController::class);
    Route::delete('appointments/bulk', [AppointmentController::class, 'destroy']);

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

    Route::apiResource('diseases', DiseaseController::class);
});

// ── Basic & Pro ──────────────────────────────────────────────────────────────
Route::middleware(['module:Master'])->group(function () {
    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('registration-institutions', RegistrationInstitutionController::class);
    Route::apiResource('payment-method-types', PaymentMethodTypeController::class);


    Route::apiResource('payment-methods', PaymentMethodController::class);
    Route::delete('payment-methods/bulk', [PaymentMethodController::class, 'destroy']);

    Route::apiResource('degrees', DegreeController::class);
    Route::delete('degrees/bulk', [DegreeController::class, 'destroy']);

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
