<?php

use Domains\Inpatient\InpatientServiceProvider;

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\FortifyServiceProvider::class,
    Domains\Patient\PatientServiceProvider::class,
    Domains\IAM\IAMServiceProvider::class,
    Domains\Accounting\AccountingServiceProvider::class,
    Domains\Billing\BillingServiceProvider::class,


    Domains\Facility\FacilityServiceProvider::class,
    Domains\Inpatient\InpatientServiceProvider::class,
    Domains\Outpatient\OutpatientServiceProvider::class,
    Domains\Clinical\ClinicalServiceProvider::class,
    Domains\Pharmacy\PharmacyServiceProvider::class,
    Domains\MedicalWork\MedicalWorkServiceProvider::class,
    InpatientServiceProvider::class,
    Domains\MasterData\MasterDataServiceProvider::class,
];
