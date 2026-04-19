<?php

declare(strict_types=1);

namespace Domains\Patient\Infrastructure\Persistence\Repositories;

use DateTimeImmutable;
use Domains\Patient\Domain\Entities\Patient;
use Domains\Patient\Domain\Exceptions\PatientNotFoundException;
use Domains\Patient\Domain\Repository\PatientRepositoryInterface;
use Domains\Patient\Domain\ValueObjects\Gender;
use Domains\Patient\Domain\ValueObjects\MedicalRecordNumber;
use Domains\Patient\Domain\ValueObjects\PatientAddress;
use Domains\Patient\Domain\ValueObjects\PatientPaymentMethod;
use Domains\Patient\Infrastructure\Persistence\Models\PatientModel;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class EloquentPatientRepository implements PatientRepositoryInterface
{
    public function __construct(
        private PatientModel $model,
    )
    {
    }

    // =========================================================================
    // Write Operations
    // =========================================================================

    /**
     * @throws Throwable
     */
    public function save(Patient $patient): void
    {
        DB::transaction(function () use ($patient) {
            $record = $this->model->newInstance();
            $this->mapEntityToModel($patient, $record);
            $record->save();

            $record->addresses()->delete();
            $record->addresses()->createMany(
                array_map(fn(PatientAddress $a) => $a->toArray(), $patient->addresses())
            );

            $record->paymentMethods()->delete();
            $record->paymentMethods()->createMany(
                array_map(fn(PatientPaymentMethod $pm) => $pm->toArray(), $patient->paymentMethods())
            );
        });
    }

    /**
     * @throws Throwable
     */
    public function update(Patient $patient): void
    {
        DB::transaction(function () use ($patient) {
            $record = PatientModel::findOrFail($patient->id());
            $this->mapEntityToModel($patient, $record);
            $record->save();

            // Replace addresses
            $record->addresses()->delete();
            $record->addresses()->createMany(
                array_map(fn(PatientAddress $a) => $a->toArray(), $patient->addresses())
            );

            // Replace payment methods
            $record->paymentMethods()->delete();
            $record->paymentMethods()->createMany(
                array_map(fn(PatientPaymentMethod $pm) => $pm->toArray(), $patient->paymentMethods())
            );
        });
    }

    public function delete(Patient $patient): void
    {
        PatientModel::findOrFail($patient->id())->delete();
    }

    // =========================================================================
    // Read Operations
    // =========================================================================

    /**
     * @throws PatientNotFoundException
     */
    public function findById(string $id): Patient
    {
        $record = PatientModel::with(['addresses', 'paymentMethods'])->find($id);

        if ($record === null) {
            throw PatientNotFoundException::withId($id);
        }

        return $this->mapModelToEntity($record);
    }

    public function findByIdCardNumber(string $idCardNumber, ?string $tenantId): ?Patient
    {
        $record = PatientModel::withoutGlobalScopes()
            ->where('id_card_number', $idCardNumber)
            ->where('tenant_id', $tenantId)
            ->with(['addresses', 'paymentMethods'])
            ->first();

        return $record ? $this->mapModelToEntity($record) : null;
    }

    public function findByEmail(string $email, ?string $tenantId): ?Patient
    {
        $record = PatientModel::withoutGlobalScopes()
            ->where('email', $email)
            ->where('tenant_id', $tenantId)
            ->with(['addresses', 'paymentMethods'])
            ->first();

        return $record ? $this->mapModelToEntity($record) : null;
    }

    public function getLastMedicalRecordSequence(?string $tenantId): int
    {
        $last = PatientModel::withoutGlobalScopes()
            ->where('tenant_id', $tenantId)
            ->orderByDesc('created_at')
            ->value('medical_record_number');

        if ($last === null) {
            return 0;
        }

        // Extract angka dari format "PREFIX-NNNN"
        $parts = explode('-', $last);
        return (int)end($parts);
    }

    public function findAll(?string $tenantId, array $filters = [], int $perPage = 15, int $page = 1): object
    {
        $query = PatientModel::withoutGlobalScopes()
            ->when(!empty($tenantId), fn($q) => $q->where('tenant_id', $tenantId))
            ->orderByDesc('created_at');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // kembalikan object paginator langsung, bukan di-cast ke array
        return $query->paginate(perPage: $perPage, page: $page);
    }

    public function findAllWithEMR(?string $tenantId, array $filters = [], int $perPage = 15): object
    {
        $query = PatientModel::withoutGlobalScopes()
            ->when(!empty($tenantId), fn($q) => $q->where('tenant_id', $tenantId))
            ->whereHas('outpatientVisits')
            ->with([
                'outpatientVisits.vitalSign',
                'outpatientVisits.diagnoses',
                'outpatientVisits.procedures',
                'outpatientVisits.prescriptions',
                'outpatientVisits.doctor',
                'outpatientVisits.prescriptions.medicine',
            ]);

        if (!empty($filters['search'])) {
            $query->where('full_name', 'like', '%' . $filters['search'] . '%');
        }

        return $query->paginate($perPage);
    }

    public function countByTenant(string $tenantId): int
    {
        return PatientModel::withoutGlobalScopes()
            ->where('tenant_id', $tenantId)
            ->count();
    }

    // =========================================================================
    // Private Mapping Methods (Anti-Corruption Layer)
    // =========================================================================

    /**
     * Domain Entity → Eloquent Model
     */
    private function mapEntityToModel(Patient $entity, PatientModel $model): void
    {
        $model->id = $entity->id();
        $model->tenant_id = $entity->tenantId();
        $model->medical_record_number = $entity->medicalRecordNumber()->value();
        $model->full_name = $entity->fullName();
        $model->city_of_birth = $entity->cityOfBirth();
        $model->date_of_birth = $entity->dateOfBirth()->format('Y-m-d');
        $model->id_card_number = $entity->idCardNumber();
        $model->gender = $entity->gender()->value();
        $model->religion = $entity->religion();
        $model->blood_type = $entity->bloodType();
        $model->job = $entity->job();
        $model->kis_number = $entity->kisNumber();
        $model->phone = $entity->phone();
        $model->email = $entity->email();
        $model->date_of_consultation = $entity->dateOfConsultation()->format('Y-m-d');
        $model->profile_picture = $entity->profilePicture();
    }

    /**
     * Eloquent Model → Domain Entity (reconstitute)
     */
    private function mapModelToEntity(PatientModel $model): Patient
    {
        $addresses = $model->addresses->map(
            fn($a) => PatientAddress::fromArray($a->toArray())
        )->all();

        $paymentMethods = $model->paymentMethods->map(
            fn($pm) => PatientPaymentMethod::fromArray($pm->toArray())
        )->all();

        return Patient::reconstitute(
            id: $model->id,
            tenantId: $model->tenant_id,
            medicalRecordNumber: MedicalRecordNumber::fromString($model->medical_record_number),
            fullName: $model->full_name,
            cityOfBirth: $model->city_of_birth,
            dateOfBirth: DateTimeImmutable::createFromMutable($model->date_of_birth->toDateTime()),       // ← fix
            idCardNumber: $model->id_card_number,
            gender: Gender::fromString($model->gender),
            religion: $model->religion,
            bloodType: $model->blood_type,
            job: $model->job,
            phone: $model->phone,
            email: $model->email,
            dateOfConsultation: DateTimeImmutable::createFromMutable($model->date_of_consultation->toDateTime()), // ← fix
            kisNumber: $model->kis_number,
            profilePicture: $model->profile_picture,
            addresses: $addresses,
            paymentMethods: $paymentMethods,
        );
    }
}
