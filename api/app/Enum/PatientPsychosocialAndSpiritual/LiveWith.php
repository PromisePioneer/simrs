<?php

namespace App\Enum\PatientPsychosocialAndSpiritual;

enum LiveWith: string
{
    case ALONE = 'Sendiri';
    case PARENTS = 'Orang Tua';
    case FAMILY = 'Keluarga';
    case OTHER = 'Lainnya';
}
