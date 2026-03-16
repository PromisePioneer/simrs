<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Handlers;

use App\Models\DoctorSchedule;
use App\Models\UserDegree;
use Domains\IAM\Application\Commands\CreateUserCommand;
use Domains\IAM\Domain\Entities\User;
use Domains\IAM\Domain\Repository\UserRepositoryInterface;
use Domains\IAM\Infrastructure\Services\PlanLimitService;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;


final readonly class CreateUserHandler
{
    public function __construct(
        private UserRepositoryInterface $repository,
        private PlanLimitService        $planLimitService,
        private Dispatcher              $dispatcher,
    )
    {
    }

    public function handle(CreateUserCommand $command): User
    {
        $dto = $command->dto;

        // Business rule: cek batas user dari plan
        if ($dto->tenantId) {
            $this->planLimitService->assertUserLimitNotReached($dto->tenantId);
        }

        // Bangun Value Objects
        $degrees = array_map(
            fn(array $d) => UserDegree::fromArray($d),
            $dto->degrees
        );

        $schedules = array_map(
            fn(array $s) => DoctorSchedule::fromArray($s),
            $dto->doctorSchedules
        );

        // Buat entity
        $user = User::create(
            id: Str::uuid()->toString(),
            tenantId: $dto->tenantId,
            name: $dto->name,
            email: $dto->email,
            phone: $dto->phone,
            address: $dto->address,
            poliId: $dto->poliId,
            strInstitutionId: $dto->strInstitutionId,
            strRegistrationNumber: $dto->strRegistrationNumber,
            strActivePeriod: $dto->strActivePeriod,
            sipInstitutionId: $dto->sipInstitutionId,
            sipRegistrationNumber: $dto->sipRegistrationNumber,
            sipActivePeriod: $dto->sipActivePeriod,
            signature: $dto->signaturePath,
            profilePicture: $dto->profilePicturePath,
            degrees: $degrees,
            doctorSchedules: $schedules,
            roles: $dto->roles,
        );

        // Hash password dan simpan
        $hashedPassword = Hash::make($dto->password);
        $this->repository->save($user, $hashedPassword);

        // Dispatch domain events
        foreach ($user->pullDomainEvents() as $event) {
            $this->dispatcher->dispatch($event);
        }

        return $user;
    }
}
