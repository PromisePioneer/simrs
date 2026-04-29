<?php

declare(strict_types=1);

namespace Domains\Outpatient\Application\DTO;

class UpdateAppointmentDTO
{
    public function __construct(
        public readonly ?string $date                  = null,
        public readonly ?string $status                = null,
        public readonly ?string $registrationStatus    = null,
        public readonly ?string $advancedStatus        = null,
        public readonly ?string $outpatientVisitId     = null,
        public readonly ?string $inpatientAdmissionId  = null,
        public readonly ?string $guarantorName         = null,
        public readonly ?string $guarantorAddress      = null,
        public readonly ?string $guarantorRelationship = null,
        public readonly ?float  $registrationFee       = null,
        public readonly ?string $emr                   = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            date:                  $data['date']                   ?? null,
            status:                $data['status']                 ?? null,
            registrationStatus:    $data['registration_status']    ?? null,
            advancedStatus:        $data['advanced_status']        ?? null,
            outpatientVisitId:     $data['outpatient_visit_id']    ?? null,
            inpatientAdmissionId:  $data['inpatient_admission_id'] ?? null,
            guarantorName:         $data['guarantor_name']         ?? null,
            guarantorAddress:      $data['guarantor_address']      ?? null,
            guarantorRelationship: $data['guarantor_relationship'] ?? null,
            registrationFee:       isset($data['registration_fee'])
                                       ? (float) $data['registration_fee']
                                       : null,
            emr:                   $data['emr'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'date'                   => $this->date,
            'status'                 => $this->status,
            'registration_status'    => $this->registrationStatus,
            'advanced_status'        => $this->advancedStatus,
            'outpatient_visit_id'    => $this->outpatientVisitId,
            'inpatient_admission_id' => $this->inpatientAdmissionId,
            'guarantor_name'         => $this->guarantorName,
            'guarantor_address'      => $this->guarantorAddress,
            'guarantor_relationship' => $this->guarantorRelationship,
            'registration_fee'       => $this->registrationFee,
            'emr'                    => $this->emr,
        ], fn($v) => ! is_null($v));
    }
}
