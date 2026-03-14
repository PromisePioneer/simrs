<?php

namespace App\Http\Controllers\Api\Master\General\User\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\Tenant;
use App\Models\User;
use App\Services\Master\General\UserManagement\User\Repository\UserRepository;
use App\Services\Master\General\UserManagement\User\Service\UserService;
use App\Services\Tenant\TenantContext;
use App\Traits\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Throwable;

class UserController extends Controller
{

    use ApiResponse;

    public function __construct(
        protected UserService $userService
    )
    {
    }

    /**
     * @throws AuthorizationException
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', User::class);
        $users = $this->userService->getUsers(request: $request);
        return response()->json($users);
    }


    /**
     * @throws Throwable
     */
    public function store(UserRequest $request): JsonResponse
    {
        $this->authorize('create', User::class);
        $user = $this->userService->store($request);
        return $this->successResponse($user, 'User Management successfully created.');
    }


    /**
     * @throws Throwable
     */
    public function update(UserRequest $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);
        $user = $this->userService->update($request, $user);
        return $this->successResponse($user, 'User Management successfully updated.');
    }


    /**
     * @throws AuthorizationException
     */
    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);
        $user->load('tenant:id,name');
        $user->load('roles:uuid,name');
        $user->load('str:id,name');
        $user->load('sip:id,name');
        $user->load('doctorSchedule');
        return response()->json($user);
    }


    public function destroy(User $user, UserRepository $userRepository): JsonResponse
    {
        $this->authorize('delete', $user);
        $user = $userRepository->destroy($user->id);
        return $this->successResponse($user, 'User Management successfully deleted.');
    }


    public function me(): JsonResponse
    {
        $user = Auth::user();
        $tenantId = $user->getActiveTenantId();

        TenantContext::set($tenantId);
        setPermissionsTeamId($tenantId);

        $activeRole = $user->getActiveRole();
        $tenant = $tenantId ? Tenant::find($tenantId) : null;
        $subscription = $tenant?->getActiveSubscription();
        $plan = $subscription?->plan;

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'profile_picture' => $user->profile_picture,

            // Role & Permission aktif
            'roles' => $activeRole ? [$activeRole->only('id', 'name')] : $user->getRoleNames()->toArray(),
            'permissions' => $user->getActivePermissions()->pluck('name'),

            // Tenant & plan info
            'tenant' => $tenant ? [
                'id' => $tenant->id,
                'name' => $tenant->name,
            ] : null,

            // Subscription info — null kalau tidak ada subscription aktif
            'subscription' => $subscription ? [
                'status' => $subscription->status,
                'ends_at' => $subscription->ends_at,
                'plan' => $plan ? [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'slug' => $plan->slug,
                    'max_users' => $plan->max_users,
                    'billing_period' => $plan->billing_period,
                ] : null,
            ] : null,

            // Meta (debugging / frontend indicator)
            'meta' => [
                'is_switched' => $user->isSwitchedContext(),
                'original_role' => $user->roles->first()?->name,
                'active_role' => $activeRole?->name,
            ],
        ]);
    }
}
