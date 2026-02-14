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
        $users = $this->userService->getUsers($request);
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
    public function show(UserRepository $userRepository, User $user): JsonResponse
    {
        $this->authorize('view', $user);
        $user->load('tenant:id,name');
        $user->load('roles:uuid,name');
        $user->load('str:id,name');
        $user->load('sip:id,name');
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
        $tenant = Tenant::find($tenantId);
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,

            // Role & Permission yang AKTIF (ini yang dipakai di frontend)
            'roles' => $activeRole ? [$activeRole] : $user->getRoleNames()->toArray(),
            'permissions' => $user->getActivePermissions()->pluck('name'),

            // Tenant info
            'tenant' => [
                'id' => $tenant->id ?? null,
                'name' => $tenant->name ?? null,
                'plan' => $tenant?->getCurrentPlan()?->name ?? null
            ],

            // Meta info (optional, untuk debugging atau indicator)
            'meta' => [
                'is_switched' => $user->isSwitchedContext(),
                'original_role' => $user->roles->first()?->name,
                'active_role' => $activeRole?->name,
            ]
        ]);
    }
}
