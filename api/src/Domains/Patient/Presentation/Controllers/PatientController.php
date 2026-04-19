<?php

declare(strict_types=1);

namespace Domains\Patient\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Patient\Application\Commands\DeletePatientCommand;
use Domains\Patient\Application\Commands\RegisterPatientCommand;
use Domains\Patient\Application\Commands\UpdatePatientCommand;
use Domains\Patient\Application\DTO\RegisterPatientDTO;
use Domains\Patient\Application\DTO\UpdatePatientDTO;
use Domains\Patient\Application\Handlers\DeletePatientHandler;
use Domains\Patient\Application\Handlers\RegisterPatientHandler;
use Domains\Patient\Application\Handlers\UpdatePatientHandler;
use Domains\Patient\Application\QueryHandlers\GetPatientEMRQueryHandler;
use Domains\Patient\Application\QueryHandlers\GetPatientsQueryHandler;
use Domains\Patient\Application\Queries\GetPatientEMRQuery;
use Domains\Patient\Application\Queries\GetPatientsQuery;
use Domains\Patient\Domain\Exceptions\PatientAlreadyExistsException;
use Domains\Patient\Domain\Exceptions\PatientNotFoundException;
use Domains\Patient\Infrastructure\Persistence\Models\PatientModel;
use Domains\Patient\Infrastructure\Services\PatientFileUploadService;
use Domains\Patient\Presentation\Requests\RegisterPatientRequest;
use Domains\Patient\Presentation\Requests\UpdatePatientRequest;
use Domains\Patient\Presentation\Resources\PatientResource;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Throwable;

/**
 * Presentation Controller: Patient
 *
 * Tanggung jawab controller dalam DDD:
 * 1. Validasi HTTP (dilakukan oleh FormRequest)
 * 2. Handle file upload (delegasi ke FileUploadService)
 * 3. Rakit DTO dari data request yang sudah bersih
 * 4. Bungkus DTO dalam Command/Query
 * 5. Serahkan Command/Query ke Handler yang sesuai
 * 6. Format response dari hasil Handler
 *
 * Controller TIDAK mengandung business logic sama sekali.
 * Controller TIDAK tahu tentang database.
 */
class PatientController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly RegisterPatientHandler    $registerHandler,
        private readonly UpdatePatientHandler      $updateHandler,
        private readonly DeletePatientHandler      $deleteHandler,
        private readonly GetPatientsQueryHandler   $getPatientsHandler,
        private readonly GetPatientEMRQueryHandler $getEMRHandler,
        private readonly PatientFileUploadService  $fileUpload,
    )
    {
    }

    // =========================================================================
    // GET /patients
    // =========================================================================

    /**
     * @throws AuthorizationException
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('view', PatientModel::class);

        $tenantId = $request->user()->tenant_id;

        $result = $this->getPatientsHandler->handle(new GetPatientsQuery(
            tenantId: $tenantId,
            search: $request->input('search'),
            perPage: (int)$request->input('per_page', 15),
            page: (int)$request->input('page', 1),
        ));

        return PatientResource::collection($result);
    }

    // =========================================================================
    // POST /patients
    // =========================================================================

    /**
     * @throws Throwable
     */
    public function store(RegisterPatientRequest $request): JsonResponse
    {
        // 1. Handle file upload di Presentation layer, sebelum masuk ke DTO
        $profilePicturePath = null;
        if ($request->hasFile('profile_picture')) {
            $profilePicturePath = $this->fileUpload->upload($request->file('profile_picture'));
        }

        // 2. Rakit DTO dari validated data
        $dto = new RegisterPatientDTO(
            tenantId: $request->user()->tenant_id ?? $request->tenant_id,
            fullName: $request->validated('full_name'),
            cityOfBirth: $request->validated('city_of_birth'),
            dateOfBirth: $request->validated('date_of_birth'),
            idCardNumber: $request->validated('id_card_number'),
            gender: $request->validated('gender'),
            religion: $request->validated('religion'),
            bloodType: $request->validated('blood_type'),
            job: $request->validated('job'),
            phone: $request->validated('phone'),
            email: $request->validated('email'),
            dateOfConsultation: $request->validated('date_of_consultation'),
            kisNumber: $request->validated('kis_number'),
            profilePicturePath: $profilePicturePath,
            addresses: $request->validated('addresses'),
            paymentMethods: $request->validated('payment_methods'),
        );

        try {
            // 3. Dispatch command ke handler
            $patient = $this->registerHandler->handle(new RegisterPatientCommand($dto));

            $model = PatientModel::with(['addresses', 'paymentMethods'])->findOrFail($patient->id());

            return $this->successResponse(new PatientResource($model), message: "Data successfully registered");

        } catch (PatientAlreadyExistsException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    // =========================================================================
    // GET /patients/{patient}
    // =========================================================================

    public function show(string $patientId): JsonResponse
    {
        try {
            $model = PatientModel::with([
                'addresses',
                'paymentMethods',
                'outpatientVisits',
                'outpatientVisits.vitalSign',
                'outpatientVisits.diagnoses',
                'outpatientVisits.procedures',
                'outpatientVisits.prescriptions',
            ])->findOrFail($patientId);

            return response()->json(new PatientResource($model));

        } catch (PatientNotFoundException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    // =========================================================================
    // PUT /patients/{patient}
    // =========================================================================

    /**
     * @throws Throwable
     */
    public function update(UpdatePatientRequest $request, string $patientId): JsonResponse
    {
        // Ambil path foto lama untuk dihapus jika ada foto baru
        $existingModel = PatientModel::findOrFail($patientId);
        $existingPicturePath = $existingModel->profile_picture;

        $profilePicturePath = $existingPicturePath; // default: tetap foto lama
        if ($request->hasFile('profile_picture')) {
            $profilePicturePath = $this->fileUpload->upload(
                $request->file('profile_picture'),
                $existingPicturePath
            );
        }

        $dto = new UpdatePatientDTO(
            patientId: $patientId,
            tenantId: $request->user()->tenant_id ?? $request->tenant_id,
            fullName: $request->validated('full_name'),
            cityOfBirth: $request->validated('city_of_birth'),
            dateOfBirth: $request->validated('date_of_birth'),
            idCardNumber: $request->validated('id_card_number'),
            gender: $request->validated('gender'),
            religion: $request->validated('religion'),
            bloodType: $request->validated('blood_type'),
            job: $request->validated('job'),
            phone: $request->validated('phone'),
            email: $request->validated('email'),
            dateOfConsultation: $request->validated('date_of_consultation'),
            kisNumber: $request->validated('kis_number'),
            profilePicturePath: $profilePicturePath,
            addresses: $request->validated('addresses'),
            paymentMethods: $request->validated('payment_methods'),
        );

        try {
            $patient = $this->updateHandler->handle(new UpdatePatientCommand($dto));

            $model = PatientModel::with(['addresses', 'paymentMethods'])->findOrFail($patient->id());

            return $this->successResponse(new PatientResource($model));

        } catch (PatientNotFoundException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    // =========================================================================
    // DELETE /patients/{patient}
    // =========================================================================

    public function destroy(string $patientId): JsonResponse
    {
        try {
            $this->deleteHandler->handle(new DeletePatientCommand(
                patientId: $patientId,
                tenantId: request()->user()->tenant_id,
            ));

            return $this->successResponse(['message' => 'Pasien berhasil dihapus.']);

        } catch (PatientNotFoundException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    // =========================================================================
    // GET /patients/emr
    // =========================================================================

    public function emr(Request $request): JsonResponse
    {
        $result = $this->getEMRHandler->handle(new GetPatientEMRQuery(
            tenantId: $request->user()->tenant_id ?? $request->tenant_id,
            search: $request->input('search'),
            perPage: (int)$request->input('per_page', 15),
        ));

        return response()->json($result);
    }
}
