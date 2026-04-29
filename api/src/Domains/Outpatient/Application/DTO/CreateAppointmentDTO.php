<?php

declare(strict_types=1);

namespace Domains\Outpatient\Application\DTO;

use Domains\Tenant\Infrastructure\Services\TenantContext;

readonly class CreateAppointmentDTO
{
    public function __construct(
        public string  $visitNumber,
        public string  $date,
        public ?string $tenantId = null,
        public ?string $patientId = null,
        public ?string $outpatientVisitId = null,
        public ?string $inpatientAdmissionId = null,
        public ?string $regNumber = null,
        public ?string $emr = null,
        public ?string $guarantorName = null,
        public ?string $guarantorAddress = null,
        public ?string $guarantorRelationship = null,
        public ?float  $registrationFee = null,
        public ?string $status = 'not_yet',
        public string  $registrationStatus = '-',
        public string  $advancedStatus = 'outpatient',
    )
    {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            visitNumber: $data['visit_number'],
            date: $data['date'],
            tenantId: TenantContext::getId(),
            patientId: $data['patient_id'] ?? null,
            outpatientVisitId: $data['outpatient_visit_id'] ?? null,
            inpatientAdmissionId: $data['inpatient_admission_id'] ?? null,
            regNumber: $data['reg_number'] ?? null,
            emr: $data['emr'] ?? null,
            guarantorName: $data['guarantor_name'] ?? null,
            guarantorAddress: $data['guarantor_address'] ?? null,
            guarantorRelationship: $data['guarantor_relationship'] ?? null,
            registrationFee: isset($data['registration_fee'])
                ? (float)$data['registration_fee']
                : null,
            status: $data['status'] ?? 'not_yet',
            registrationStatus: $data['registration_status'] ?? '-',
            advancedStatus: $data['advanced_status'] ?? 'outpatient',
        );
    }

    public function toArray(): array
    {
        return [
            'visit_number' => $this->visitNumber,
            'date' => $this->date,
            'tenant_id' => $this->tenantId,
            'patient_id' => $this->patientId,
            'outpatient_visit_id' => $this->outpatientVisitId,
            'inpatient_admission_id' => $this->inpatientAdmissionId,
            'reg_number' => $this->regNumber,
            'emr' => $this->emr,
            'guarantor_name' => $this->guarantorName,
            'guarantor_address' => $this->guarantorAddress,
            'guarantor_relationship' => $this->guarantorRelationship,
            'registration_fee' => $this->registrationFee,
            'status' => $this->status,
            'registration_status' => $this->registrationStatus,
            'advanced_status' => $this->advancedStatus,
        ];
    }
}
