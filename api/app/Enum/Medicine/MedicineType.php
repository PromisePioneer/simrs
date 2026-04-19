<?php

namespace App\Enum\Medicine;

enum MedicineType: string
{
    case TABLET = 'tablets';
    case CAPSULE = 'capsule';
    case SYRUP = 'syrup';
    case INJECTION = 'injection';
    case OINTMENT = 'ointment';
}
