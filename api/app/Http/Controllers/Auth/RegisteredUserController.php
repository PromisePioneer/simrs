<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Master\General\Pricing\Repository\PlanRepository;
use App\Services\Master\General\Pricing\Service\SubscriptionService;
use Domains\Subscriptions\Infrastructure\Persistence\Repositories\EloquentPlanRepository;
use Domains\Subscriptions\Infrastructure\Persistence\Repositories\EloquentSubscriptionRepository;
use Domains\Tenant\Infrastructure\Persistence\Models\TenantModel;
use Domains\Tenant\Infrastructure\Persistence\Repositories\EloquentTenantRepository;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Throwable;

class RegisteredUserController extends Controller
{

    private EloquentTenantRepository $eloquentTenantRepository;
    private EloquentSubscriptionRepository $eloquentSubscriptionRepository;
    private EloquentPlanRepository $elqoeuntPlanRepository;

    public function __construct()
    {
        $this->eloquentTenantRepository = new EloquentTenantRepository(new TenantModel());
        $this->eloquentSubscriptionRepository = new EloquentSubscriptionRepository();
        $this->elqoeuntPlanRepository = new EloquentPlanRepository();
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     * @throws Throwable
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'tenant_name' => ['required', 'string', 'max:255'],
            'tenant_type' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $tenantData = [
            'name' => $request->tenant_name,
            'type' => $request->tenant_type,
            'code' => now()->format('YmdHis'),
        ];


        return DB::transaction(function () use ($request, $tenantData) {
            $tenant = $this->eloquentTenantRepository->store(data: $tenantData);

            $user = User::create([
                'tenant_id' => $tenant->id,
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->string('password')),
            ]);

            $user->assignRole('Owner');
            $plan = $this->elqoeuntPlanRepository->findByName('Basic');
            event(new Registered($user));
            Auth::login($user);
            $this->eloquentSubscriptionRepository->assignSubscription([
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
                'status' => 'active',
                'starts_at' => now(),
                'trial_ends_at' => now()->addDays(7),
                'ends_at' => null,
                'cancelled_at' => null,
            ]);

            return response()->noContent();
        });
    }
}
