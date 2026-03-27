<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Handlers;

use Domains\IAM\Commands\CreateUserCommand;
use Domains\IAM\Domain\Entities\User;
use Domains\IAM\Domain\Repository\UserRepositoryInterface;
use Domains\IAM\Domain\ValueObjects\UserDegree;
use Domains\IAM\Infrastructure\Services\PlanLimitService;
use Domains\MedicalWork\Infrastructure\Persistence\Models\DoctorScheduleModel;
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

        if ($dto->tenantId) {
            $this->planLimitService->assertUserLimitNotReached($dto->tenantId);
        }

        $degrees = array_map(
            fn(array $d) => UserDegree::fromArray($d),
            $dto->degrees
        );

        $schedules = array_map(
            fn(array $s) => DoctorScheduleModel::fromArray($s),
            $dto->doctorSchedules
        );

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
