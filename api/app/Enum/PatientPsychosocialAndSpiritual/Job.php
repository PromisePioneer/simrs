<?php

namespace App\Enum\PatientPsychosocialAndSpiritual;

enum Job: string
{

    case SELF_EMPLOYED = 'Wiraswasta';
    case EMPLOYED = 'Pegawai Swasta';
    case UNEMPLOYED = 'Tidak Bekerja';
    case OTHER = 'Lainnya';
}
