<?php

namespace App\Enum\Prescriptions;

enum PrescriptionStatus: string
{
    case DRAFT = 'draft';
    case DISPENDED = 'dispended';
    case cancelled = 'cancelled';
}
