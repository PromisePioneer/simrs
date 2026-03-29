<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Controllers;

use App\Models\User as EloquentUser;
use App\Services\Tenant\TenantContext;
use App\Traits\ApiResponse;
use Domains\IAM\Application\Commands\DeleteUserCommand;
use Domains\IAM\Application\Commands\UpdateUserCommand;
use Domains\IAM\Application\DTO\UpdateUserDTO;
use Domains\IAM\Application\Handlers\CreateUserHandler;
use Domains\IAM\Application\Handlers\DeleteUserHandler;
use Domains\IAM\Application\Handlers\UpdateUserHandler;
use Domains\IAM\Application\QueryHandlers\GetUsersQueryHandler;
use Domains\IAM\Application\Queries\GetUsersQuery;
use Domains\IAM\Commands\CreateUserCommand;
use Domains\IAM\Domain\Exceptions\UserLimitExceededException;
use Domains\IAM\Domain\Exceptions\UserNotFoundException;
use Domains\IAM\DTO\CreateUserDTO;
use Domains\IAM\Infrastructure\Services\UserFileUploadService;
use Domains\IAM\Presentation\Requests\CreateUserRequest;
use Domains\IAM\Presentation\Requests\UpdateUserRequest;
use Domains\IAM\Presentation\Resources\UserResource;
use Domains\Tenant\Infrastructure\Persistence\Models\TenantModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Throwable;

class UserController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly CreateUserHandler     $createHandler,
        private readonly UpdateUserHandler     $updateHandler,
        private readonly DeleteUserHandler     $deleteHandler,
        private readonly GetUsersQueryHandler  $getUsersHandler,
        private readonly UserFileUploadService $fileUpload,
    )
    {
    }

    // ── GET /users ────────────────────────────────────────────────────────────

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('view', EloquentUser::class);

        $result = $this->getUsersHandler->handle(new GetUsersQuery(
            tenantId: $request->user()->getActiveTenantId(),
            search: $request->input('search'),
            perPage: $request->input('per_page') ? (int)$request->input('per_page') : null,
            role: $request->input('role'),
        ));

        return UserResource::collection($result);
    }

    // ── POST /users ───────────────────────────────────────────────────────────

    /**
     * @throws Throwable
     */
    public function store(CreateUserRequest $request): JsonResponse
    {
        $this->authorize('create', EloquentUser::class);

        // Handle file uploads di Presentation layer
        $profilePicturePath = null;
        $signaturePath = null;

        if ($request->hasFile('profile_picture')) {
            $profilePicturePath = $this->fileUpload->uploadProfilePicture($request->file('profile_picture'));
        }
        if ($request->hasFile('signature')) {
            $signaturePath = $this->fileUpload->uploadSignature($request->file('signature'));
        }

        // Normalize degrees
        $degrees = $this->normalizeDegrees($request->input('degrees', []));

        $dto = new CreateUserDTO(
            tenantId: $request->user()->getActiveTenantId(),
            name: $request->validated('name'),
            email: $request->validated('email'),
            password: $request->validated('password'),
            phone: $request->validated('phone'),
            address: $request->validated('address'),
            poliId: $request->validated('poli_id'),
            strInstitutionId: $request->validated('str_institution_id'),
            strRegistrationNumber: $request->validated('str_registration_number'),
            strActivePeriod: $request->validated('str_active_period'),
            sipInstitutionId: $request->validated('sip_institution_id'),
            sipRegistrationNumber: $request->validated('sip_registration_number'),
            sipActivePeriod: $request->validated('sip_active_period'),
            signaturePath: $signaturePath,
            profilePicturePath: $profilePicturePath,
            degrees: $degrees,
            doctorSchedules: $request->validated('doctor_schedule', []),
            roles: $request->validated('roles', []),
        );

        try {
            $user = $this->createHandler->handle(new CreateUserCommand($dto));

            $model = EloquentUser::with(['roles', 'prefixes', 'suffixes', 'poli', 'doctorSchedule'])
                ->findOrFail($user->id());

            return $this->successResponse(new UserResource($model), 'User berhasil dibuat.');

        } catch (UserLimitExceededException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    // ── GET /users/{user} ─────────────────────────────────────────────────────

    public function show(EloquentUser $user): JsonResponse
    {
        $this->authorize('view', $user);

        $user->load(['tenant', 'roles', 'str', 'sip', 'doctorSchedule', 'prefixes', 'suffixes', 'degrees', 'poli']);

        return response()->json(new UserResource($user));
    }

    // ── PUT /users/{user} ─────────────────────────────────────────────────────

    /**
     * @throws Throwable
     */
    public function update(UpdateUserRequest $request, EloquentUser $user): JsonResponse
    {
        $this->authorize('update', $user);

        $profilePicturePath = $user->profile_picture;
        $signaturePath = $user->signature;

        if ($request->hasFile('profile_picture')) {
            $profilePicturePath = $this->fileUpload->uploadProfilePicture(
                $request->file('profile_picture'),
                $user->profile_picture
            );
        }
        if ($request->hasFile('signature')) {
            $signaturePath = $this->fileUpload->uploadSignature(
                $request->file('signature'),
                $user->signature
            );
        }

        $degrees = $this->normalizeDegrees($request->input('degrees', []));

        $dto = new UpdateUserDTO(
            userId: $user->id,
            tenantId: $request->user()->getActiveTenantId(),
            name: $request->validated('name'),
            email: $request->validated('email'),
            phone: $request->validated('phone'),
            address: $request->validated('address'),
            poliId: $request->validated('poli_id'),
            strInstitutionId: $request->validated('str_institution_id'),
            strRegistrationNumber: $request->validated('str_registration_number'),
            strActivePeriod: $request->validated('str_active_period'),
            sipInstitutionId: $request->validated('sip_institution_id'),
            sipRegistrationNumber: $request->validated('sip_registration_number'),
            sipActivePeriod: $request->validated('sip_active_period'),
            signaturePath: $signaturePath,
            profilePicturePath: $profilePicturePath,
            degrees: $degrees,
            doctorSchedules: $request->validated('doctor_schedule', []),
            roles: $request->validated('roles', []),
        );

        try {
            $updatedUser = $this->updateHandler->handle(new UpdateUserCommand($dto));

            $model = EloquentUser::with(['roles', 'prefixes', 'suffixes', 'poli', 'doctorSchedule'])
                ->findOrFail($updatedUser->id());

            return $this->successResponse(new UserResource($model), 'User berhasil diperbarui.');

        } catch (UserNotFoundException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    // ── DELETE /users/{user} ──────────────────────────────────────────────────

    public function destroy(EloquentUser $user): JsonResponse
    {
        $this->authorize('delete', $user);

        try {
            $this->deleteHandler->handle(new DeleteUserCommand($user->id));
            return $this->successResponse(null, 'User berhasil dihapus.');

        } catch (UserNotFoundException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    // ── GET /users/me ─────────────────────────────────────────────────────────

    public function me(): JsonResponse
    {
        $user = Auth::user();
        $tenantId = $user->getActiveTenantId();

        TenantContext::set($tenantId);
        setPermissionsTeamId($tenantId);

        $activeRole = $user->getActiveRole();
        $tenant = $tenantId ? TenantModel::find($tenantId) : null;
        $subscription = $tenant?->activeSubscription;
        $plan = $subscription?->plan;

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'profile_picture' => $user->profile_picture,

            'roles' => $activeRole
                ? [$activeRole->only('uuid', 'name')]
                : $user->getRoleNames()->toArray(),
            'permissions' => $user->getActivePermissions()->pluck('name'),

            'tenant' => $tenant ? ['id' => $tenant->id, 'name' => $tenant->name] : null,

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

            'meta' => [
                'is_switched' => $user->isSwitchedContext(),
                'original_role' => $user->roles->first()?->name,
                'active_role' => $activeRole?->name,
            ],
        ]);
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    private function normalizeDegrees(mixed $degrees): array
    {
        if (is_string($degrees)) {
            $degrees = json_decode($degrees, true) ?? [];
        }

        if (empty($degrees)) {
            return [];
        }

        // Support format [['id' => ..., 'order' => ...]] dan ['uuid1', 'uuid2']
        if (isset($degrees[0]) && is_string($degrees[0])) {
            return array_map(fn($id) => ['id' => $id, 'order' => 0, 'name' => '', 'type' => 'prefix'], $degrees);
        }

        return $degrees;
    }
}
