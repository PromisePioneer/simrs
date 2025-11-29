<?php

namespace App\Http\Controllers\Api\General\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\VisitListRequest;
use App\Models\Allergy;
use App\Models\Patient;
use App\Models\PatientAllergy;
use App\Models\PatientVitalSign;
use App\Models\VisitList;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class VisitListController extends Controller
{

    use ApiResponse;

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 20);
        $search = $request->input('search');
        $query = VisitList::query()->orderBy('date', 'desc');

        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        $visits = $query->paginate($perPage);
        return response()->json($visits);
    }


    /**
     * @throws Throwable
     */
    public function store(VisitListRequest $request)
    {
        DB::transaction(function () use ($request) {
            $data = $request->validated();
            $data['tenant_id'] = auth()->user()->tenant_id;
            $visitLists = VisitList::create($data);
            PatientVitalSign::create($data);
            PatientAllergy::create($data);
            return $this->successResponse($visitLists, 'Visit List created successfully.');
        });
    }


    public function show(VisitList $visitList)
    {
        return response()->json($visitList);
    }
}
