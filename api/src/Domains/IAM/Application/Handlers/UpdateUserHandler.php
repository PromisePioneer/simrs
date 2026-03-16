<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Handlers;

use Domains\IAM\Application\Commands\UpdateUserCommand;
use Domains\IAM\Domain\Entities\User;
use Domains\IAM\Domain\Exceptions\UserNotFoundException;
use Domains\IAM\Domain\Repository\UserRepositoryInterface;
use Domains\IAM\Domain\ValueObjects\DoctorSchedule;
use Domains\IAM\Domain\ValueObjects\UserDegree;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class UpdateUserHandler
{
    public function __construct(
        private UserRepositoryInterface $repository,
        private Dispatcher              $dispatcher,
    )
    {
    }

    /**
     * @throws UserNotFoundException
     */
    public function handle(UpdateUserCommand $command): User
    {
        $dto = $command->dto;
        $user = $this->repository->findById($dto->userId);
        $degrees = array_map(fn(array $d) => UserDegree::fromArray($d), $dto->degrees);
        $schedules = array_map(fn(array $s) => DoctorSchedule::fromArray($s), $dto->doctorSchedules);

        $user->update(
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

        $this->repository->update($user);

        foreach ($user->pullDomainEvents() as $event) {
            $this->dispatcher->dispatch($event);
        }

        return $user;
    }
}
