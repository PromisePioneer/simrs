<?php

namespace App\Services\Master\General\UserManagement\User\Repository;

use App\Models\DoctorProfile;
use Illuminate\Http\Request;

class DoctorProfileRepository
{

    protected DoctorProfile $doctorProfile;

    public function __construct()
    {
        $this->doctorProfile = new DoctorProfile();
    }

    public function updateOrCreate(string $userId, Request $request): DoctorProfile
    {
        return DoctorProfile::updateOrCreate([
            'user_id' => $userId,
        ], [
            'poli_id' => $request->get('poli_id'),
            'sip' => $request->get('sip'),
            'specialization' => $request->get('specialization'),
            'estimated_consultation_time' => $request->get('estimated_consultation_time'),
        ]);
    }
}
