<?php

declare(strict_types=1);

namespace Domains\Outpatient\Domain\Entities;

use Domains\Outpatient\Domain\ValueObjects\VisitNumber;
use Domains\Outpatient\Domain\ValueObjects\VisitStatus;
use Domains\Shared\Domain\Entities\BaseEntity;

class Appointment extends BaseEntity
{
    public function __construct(
        public readonly string      $id,
        public readonly VisitNumber $visitNumber,
        public readonly string      $date,
        public readonly VisitStatus $status,
        public readonly string      $registrationStatus,
        public readonly string      $advancedStatus,
        public readonly ?string     $patientId,
        public readonly ?string     $tenantId,
        public readonly ?string     $outpatientVisitId   = null,
        public readonly ?string     $inpatientAdmissionId = null,
        public readonly ?string     $regNumber           = null,
        public readonly ?string     $emr                 = null,
        public readonly ?string     $guarantorName       = null,
        public readonly ?string     $guarantorAddress    = null,
        public readonly ?string     $guarantorRelationship = null,
        public readonly ?float      $registrationFee     = null,
        public readonly ?string     $birthDate           = null,
    ) {}
}
