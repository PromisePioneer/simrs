<?php

declare(strict_types=1);

namespace Domains\IAM\Infrastructure\Persistence\Repositories;

use App\Models\User as EloquentUser;
use Domains\IAM\Domain\Entities\User;
use Domains\IAM\Domain\Exceptions\UserNotFoundException;
use Domains\IAM\Domain\Repository\UserRepositoryInterface;
use Domains\IAM\Domain\ValueObjects\DoctorSchedule;
use Domains\IAM\Domain\ValueObjects\UserDegree;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Adapter: Implementasi Eloquent dari UserRepositoryInterface.
 *
 * Tanggung jawab:
 * 1. Translasi Domain Entity ↔ Eloquent User model
 * 2. Sync degrees (pivot user_degrees)
 * 3. Assign roles via Spatie (tetap di Infrastructure)
 * 4. Sync doctor_schedules
 */
final class EloquentUserRepository implements UserRepositoryInterface
{
    public function save(User $user, string $hashedPassword): void
    {
        DB::transaction(function () use ($user, $hashedPassword) {
            $record = EloquentUser::create([
                'id'                     => $user->id(),
                'tenant_id'              => $user->tenantId(),
                'name'                   => $user->name(),
                'email'                  => $user->email(),
                'password'               => $hashedPassword,
                'phone'                  => $user->phone(),
                'address'                => $user->address(),
                'poli_id'                => $user->poliId(),
                'str_institution_id'     => $user->strInstitutionId(),
                'str_registration_number' => $user->strRegistrationNumber(),
                'str_active_period'      => $user->strActivePeriod(),
                'sip_institution_id'     => $user->sipInstitutionId(),
                'sip_registration_number' => $user->sipRegistrationNumber(),
                'sip_active_period'      => $user->sipActivePeriod(),
                'signature'              => $user->signature(),
                'profile_picture'        => $user->profilePicture(),
            ]);

            $this->syncDegrees($record, $user->degrees());
            $this->syncRoles($record, $user->roles());
            $this->syncSchedules($record, $user->doctorSchedules());
        });
    }

    public function update(User $user): void
    {
        DB::transaction(function () use ($user) {
            $record = EloquentUser::findOrFail($user->id());

            $record->update([
                'name'                   => $user->name(),
                'email'                  => $user->email(),
                'phone'                  => $user->phone(),
                'address'                => $user->address(),
                'poli_id'                => $user->poliId(),
                'str_institution_id'     => $user->strInstitutionId(),
                'str_registration_number' => $user->strRegistrationNumber(),
                'str_active_period'      => $user->strActivePeriod(),
                'sip_institution_id'     => $user->sipInstitutionId(),
                'sip_registration_number' => $user->sipRegistrationNumber(),
                'sip_active_period'      => $user->sipActivePeriod(),
                'signature'              => $user->signature(),
                'profile_picture'        => $user->profilePicture(),
            ]);

            $this->syncDegrees($record, $user->degrees());
            $this->syncRoles($record, $user->roles());
            $this->syncSchedules($record, $user->doctorSchedules());
        });
    }

    public function delete(string $id): void
    {
        EloquentUser::findOrFail($id)->delete();
    }

    public function findById(string $id): User
    {
        $record = EloquentUser::with([
            'degrees',
            'doctorSchedule',
            'roles',
        ])->find($id);

        if (!$record) {
            throw UserNotFoundException::withId($id);
        }

        return $this->mapToEntity($record);
    }

    public function findAll(?string $tenantId, array $filters = [], ?int $perPage = null, ?string $role = null): object
    {
        $query = EloquentUser::with(['poli', 'doctorSchedule', 'roles', 'prefixes', 'suffixes'])
            ->orderBy('name');

        // Filter by role (return collection, not paginator)
        if ($role) {
            return $query->sameTenant()->whereHas('roles', fn($q) => $q->where('name', $role))->get();
        }

        if (!empty($filters['search'])) {
            $search = strtolower($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) like ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(email) like ?', ["%{$search}%"]);
            });
        }

        if ($perPage) {
            return $query->sameTenant()->paginate($perPage);
        }

        return $query->sameTenant()->get();
    }

    public function countByTenant(string $tenantId): int
    {
        return EloquentUser::where('tenant_id', $tenantId)->count();
    }

    public function emailExists(string $email, ?string $excludeId = null): bool
    {
        $query = EloquentUser::where('email', $email);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    // =========================================================================
    // Private Helpers
    // =========================================================================

    /**
     * Eloquent Model → Domain Entity (reconstitute)
     */
    private function mapToEntity(EloquentUser $record): User
    {
        $degrees = $record->degrees->map(function ($d) {
            return UserDegree::fromArray([
                'id'    => $d->id,
                'name'  => $d->name,
                'type'  => $d->type,
                'order' => $d->pivot->order ?? 0,
            ]);
        })->all();

        $schedules = $record->doctorSchedule->map(function ($s) {
            return DoctorSchedule::fromArray([
                'day_of_week' => $s->day_of_week,
                'start_time'  => $s->start_time,
                'end_time'    => $s->end_time,
            ]);
        })->all();

        $roles = $record->roles->pluck('name')->all();

        return User::reconstitute(
            id:                    $record->id,
            tenantId:              $record->tenant_id,
            name:                  $record->name,
            email:                 $record->email,
            phone:                 $record->phone,
            address:               $record->address,
            poliId:                $record->poli_id,
            strInstitutionId:      $record->str_institution_id,
            strRegistrationNumber: $record->str_registration_number,
            strActivePeriod:       $record->str_active_period,
            sipInstitutionId:      $record->sip_institution_id,
            sipRegistrationNumber: $record->sip_registration_number,
            sipActivePeriod:       $record->sip_active_period,
            signature:             $record->signature,
            profilePicture:        $record->profile_picture,
            degrees:               $degrees,
            doctorSchedules:       $schedules,
            roles:                 $roles,
        );
    }

    /**
     * Sync degrees ke pivot table user_degrees.
     *
     * @param UserDegree[] $degrees
     */
    private function syncDegrees(EloquentUser $record, array $degrees): void
    {
        if (empty($degrees)) {
            $record->degrees()->detach();
            return;
        }

        $syncData = [];
        foreach ($degrees as $degree) {
            $syncData[$degree->degreeId()] = ['order' => $degree->order()];
        }

        $record->degrees()->sync($syncData);
    }

    /**
     * Sync roles via Spatie.
     *
     * @param string[] $roles
     */
    private function syncRoles(EloquentUser $record, array $roles): void
    {
        if (!empty($roles)) {
            $record->syncRoles($roles);
        }
    }

    /**
     * Sync doctor schedules — delete lama, insert baru.
     *
     * @param DoctorSchedule[] $schedules
     */
    private function syncSchedules(EloquentUser $record, array $schedules): void
    {
        DB::table('doctor_schedules')->where('user_id', $record->id)->delete();

        foreach ($schedules as $schedule) {
            DB::table('doctor_schedules')->insert([
                'id'          => Str::uuid()->toString(),
                'user_id'     => $record->id,
                'day_of_week' => $schedule->dayOfWeek(),
                'start_time'  => $schedule->startTime(),
                'end_time'    => $schedule->endTime(),
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }
    }
}
