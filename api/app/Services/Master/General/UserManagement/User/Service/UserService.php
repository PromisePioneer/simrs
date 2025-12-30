<?php

namespace App\Services\Master\General\UserManagement\User\Service;

use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Services\Global\FileUploadService;
use App\Services\Master\General\UserManagement\User\Repository\UserRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Throwable;

class UserService
{

    private static string $signaturePath = "images/users/signature";
    private static string $profilePicturePath = "images/users/profile_picture";
    private UserRepository $userRepository;
    private FileUploadService $fileUploadService;

    public function __construct()
    {
        $this->userRepository = new UserRepository();
        $this->fileUploadService = new FileUploadService();
    }

    public function getUsers(Request $request): Collection|LengthAwarePaginator
    {
        $perPage = $request->input('per_page');
        $filters = $request->only(['search']);
        return $this->userRepository->getAll($filters, $perPage);
    }

    /**
     * @throws Throwable
     */
    public function store(UserRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();

            $data['tenant_id'] = $request->get('tenant_id');
            $data['password'] = Hash::make($request->get('zyntera'));

            if ($request->hasFile('signature')) {
                $data['signature'] = $this->fileUploadService->handle(
                    propertyName: 'signature',
                    path: self::$signaturePath,
                    request: $request
                );
            }


            if ($request->hasFile('profile_picture')) {
                $data['profile_picture'] = $this->fileUploadService->handle(
                    propertyName: 'profile_picture',
                    path: self::$profilePicturePath,
                    request: $request
                );
            }

            $user = UserRepository::store($data);

            $degrees = $request->input('degrees', []);
            if (is_string($degrees)) {
                $degrees = json_decode($degrees, true);
            }

            if (!empty($degrees)) {
                if (isset($degrees[0]['id'])) {
                    $syncData = collect($degrees)->mapWithKeys(fn($degree) => [
                        $degree['id'] => ['order' => $degree['order'] ?? 0],
                    ])->toArray();

                    $user->degrees()->sync($syncData);
                } else {
                    $user->degrees()->sync($degrees);
                }
            }

            $roles = $request->input('roles');
            if (!empty($roles)) {
                $user->assignRole($roles);
            }

            $this->syncDoctorSchedule($user, $request->input('doctor_schedule', []));

            return [
                'user' => $user,
                'roles' => $roles,
            ];
        });
    }

    /**
     * @throws Throwable
     */
    public function update(UserRequest $request, User $user): array
    {
        return DB::transaction(function () use ($user, $request) {

            $data = $request->validated();

            if ($request->hasFile('signature')) {
                $data['signature'] = $this->fileUploadService->handle(
                    propertyName: 'signature',
                    path: self::$signaturePath,
                    request: $request,
                    oldFile: $user->signature
                );
            }

            if ($request->hasFile('profile_picture')) {
                $data['profile_picture'] = $this->fileUploadService->handle(
                    propertyName: 'profile_picture',
                    path: self::$profilePicturePath,
                    request: $request,
                    oldFile: $user->profile_picture
                );
            }

            $degrees = $request->input('degrees', []);
            if (is_string($degrees)) {
                $degrees = json_decode($degrees, true);
            }

            if (!empty($degrees)) {
                if (isset($degrees[0]['id'])) {
                    $syncData = collect($degrees)->mapWithKeys(fn($degree) => [
                        $degree['id'] => ['order' => $degree['order'] ?? 0],
                    ])->toArray();

                    $user->degrees()->sync($syncData);
                } else {
                    $user->degrees()->sync($degrees);
                }
            }

            $user->update($data);

            $roles = $request->input('roles');
            if (!empty($roles)) {
                $user->syncRoles($roles);
            }


            $schedule = $request->input('schedule', []);

            if (is_string($schedule)) {
                $schedule = json_decode($schedule, true);
            }


            if (!empty($schedule)) {
                $this->syncDoctorSchedule($user, $schedule);
            }

            return [
                'user' => $user,
                'roles' => $roles,
            ];
        });
    }

    private function syncDoctorSchedule(User $user, array $schedule): void
    {
        DB::table('doctor_schedules')->where('user_id', $user->id)->delete();

        if (!empty($schedule)) {
            foreach ($schedule as $shifts) {
                foreach ($shifts as $shiftDay => $day) {
                    foreach ($day as $shiftData) {
                        DB::table('doctor_schedules')->insert([
                            'id' => Str::uuid()->toString(),
                            'user_id' => $user->id,
                            'day_of_week' => $shiftDay,
                            'start_time' => $shiftData['start'],
                            'end_time' => $shiftData['end'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }
    }

}
