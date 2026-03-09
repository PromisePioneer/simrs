<?php

namespace App\Enum\Queue;

enum QueueStatus: string
{
    case WAITING = 'waiting';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
}
