<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use App\Services\Master\General\Pricing\Repository\PlanRepository;
use App\Services\Master\General\Pricing\Service\SubscriptionService;
use App\Services\Master\General\Tenant\Repository\TenantRepository;
use App\Services\Master\General\Tenant\Service\TenantService;
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

    private TenantRepository $tenantRepository;
    private SubscriptionService $subscriptionService;
    private PlanRepository $planRepository;

    public function __construct()
    {
        $this->tenantRepository = new TenantRepository();
        $this->subscriptionService = new SubscriptionService();
        $this->planRepository = new PlanRepository();
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
            $tenant = $this->tenantRepository->store(data: $tenantData);

            $user = User::create([
                'tenant_id' => $tenant->id,
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->string('password')),
            ]);

            $user->assignRole('Owner');
            $plan = $this->planRepository->findByName('Basic');
            event(new Registered($user));
            Auth::login($user);
            $this->subscriptionService->assignSubs($request, $plan);

            return response()->noContent();
        });
    }
}
