<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Handlers;

use Domains\IAM\Application\Commands\DeleteUserCommand;
use Domains\IAM\Domain\Exceptions\UserNotFoundException;
use Domains\IAM\Domain\Repository\UserRepositoryInterface;

final class DeleteUserHandler
{
    public function __construct(
        private readonly UserRepositoryInterface $repository,
    ) {}

    /**
     * @throws UserNotFoundException
     */
    public function handle(DeleteUserCommand $command): void
    {
        $this->repository->findById($command->userId);
        $this->repository->delete($command->userId);
    }
}
