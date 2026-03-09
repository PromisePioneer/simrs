<?php

namespace App\Http\Controllers\Api\General\Patient;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientComboSourceController extends Controller
{
    public function getAllPatients(Request $request)
    {
        $this->authorize('viewAllPatientComboSource', Patient::class);
        $query = Patient::query()->orderBy('full_name');
        $search = $request->query('search');
        if ($search) {
            $query->where('full_name', 'like', '%' . $search . '%');
        }
        return response()->json($query->get(['id', 'full_name']));
    }
}
