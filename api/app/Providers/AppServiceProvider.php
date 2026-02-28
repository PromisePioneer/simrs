<?php

namespace App\Providers;

use App\Models\Degree;
use App\Models\MedicineStockMovement;
use App\Models\OutpatientVisit;
use App\Models\PaymentMethod;
use App\Models\PaymentMethodType;
use App\Models\Poli;
use App\Models\Medicine;
use App\Models\MedicineCategory;
use App\Models\MedicineRack;
use App\Models\Prescription;
use App\Models\ProductUnitType;
use App\Models\MedicineWarehouse;
use App\Models\Profession;
use App\Models\RegistrationInstitution;
use App\Models\Role;
use App\Models\Specialization;
use App\Models\SubSpecialization;
use App\Models\User;
use App\Policies\DegreePolicy;
use App\Policies\MedicineStockMovementPolicy;
use App\Policies\OutpatientVisitPolicy;
use App\Policies\PaymentMethodPolicy;
use App\Policies\PaymentMethodTypePolicy;
use App\Policies\PoliPolicy;
use App\Policies\MedicineCategoryPolicy;
use App\Policies\MedicinePolicy;
use App\Policies\MedicineRackPolicy;
use App\Policies\MedicineUnitTypePolicy;
use App\Policies\MedicineWarehousePolicy;
use App\Policies\PrescriptionPolicy;
use App\Policies\ProfessionPolicy;
use App\Policies\RegistrationInstitutionPolicy;
use App\Policies\RolePolicy;
use App\Policies\SpecializationPolicy;
use App\Policies\SubSpecializationPolicy;
use App\Policies\UserPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url') . "/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        Gate::before(function ($user, $ability) {
            app()->singleton('tenant_id', fn() => Auth::user()->tenant_id);
            return $user->hasRole('Super Admin') ? true : null;
        });

    }


    public function registerPolicies(): void
    {
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);
        Gate::policy(Poli::class, PoliPolicy::class);
        Gate::policy(RegistrationInstitution::class, RegistrationInstitutionPolicy::class);
        Gate::policy(PaymentMethodType::class, PaymentMethodTypePolicy::class);
        Gate::policy(PaymentMethod::class, PaymentMethodPolicy::class);
        Gate::policy(Degree::class, DegreePolicy::class);
        Gate::policy(Profession::class, ProfessionPolicy::class);
        Gate::policy(SubSpecialization::class, SubSpecializationPolicy::class);
        Gate::policy(Specialization::class, SpecializationPolicy::class);


        /*
         *  Pharmacy
         */
        Gate::policy(MedicineRack::class, MedicineRackPolicy::class);
        Gate::policy(MedicineCategory::class, MedicineCategoryPolicy::class);
        Gate::policy(MedicineWarehouse::class, MedicineWarehousePolicy::class);
        Gate::policy(ProductUnitType::class, MedicineUnitTypePolicy::class);
        Gate::policy(Medicine::class, MedicinePolicy::class);
        Gate::policiy(MedicineStockMovement::class, MedicineStockMovementPolicy::class);


        Gate::policy(OutpatientVisit::class, OutpatientVisitPolicy::class);
        Gate::policy(Prescription::class, PrescriptionPolicy::class);
    }
}





















