<?php

namespace App\Enum\PatientPsychosocialAndSpiritual;

enum MaritalStatus: string
{
    case MARRIED = 'Menikah';
    case SINGLE = 'Belum Menikah';
    case DIVORCED = 'Janda/Duda';
}
