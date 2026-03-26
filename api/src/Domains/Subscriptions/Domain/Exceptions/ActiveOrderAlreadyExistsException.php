<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Domain\Exceptions;

use RuntimeException;

final class ActiveOrderAlreadyExistsException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('Masih ada order aktif yang belum dibayar.');
    }
}
