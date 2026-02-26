<?php

namespace App\Http\Controllers\Api\Medicine;

use App\Http\Controllers\Controller;
use App\Services\Prescription\Service\PrescriptionService;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{

    protected PrescriptionService $prescriptionService;

    public function __construct()
    {
        $this->prescriptionService = new PrescriptionService();
    }


    public function index(Request $request)
    {
        $data = $this->prescriptionService->getPrescriptions(request: $request);
    }


    public function store()
    {

    }


    public function update()
    {

    }


    public function show()
    {

    }


    public function destroy()
    {

    }
}
