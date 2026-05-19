<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Handlers;

use Domains\IAM\Commands\DeleteUserCommand;
use Domains\IAM\Domain\Repository\UserRepositoryInterface;

final readonly class DeleteUserHandler
{
    public function __construct(
        private UserRepositoryInterface $repository,
    ) {}

    public function handle(DeleteUserCommand $command): void
    {
        $this->repository->bulkDelete($command->userIds);
    }
}
