<?php

declare(strict_types=1);

namespace Domains\Tenant\Domain\Entities;

use Domains\Shared\Domain\Entities\BaseEntity;

class Tenant extends BaseEntity
{
    public function __construct(
        private readonly string  $id,
        private string           $name,
        private string           $code,
        private string           $type,
        private ?string          $sio = null,
        private ?string          $nib = null,
        private ?string          $npwpFullName = null,
        private ?string          $npwpType = null,
        private ?string          $nikNpwp = null,
        private ?string          $npwpNumber = null,
        private ?string          $npwpAddress = null,
        private ?string          $npwpProvinceId = null,
        private ?string          $npwpDistrictId = null,
        private ?string          $ktpFullName = null,
        private ?string          $nikKtp = null,
        private ?string          $ktpAttachment = null,
        private ?string          $picFullName = null,
        private ?string          $picRole = null,
        private ?string          $picPhoneNumber = null,
        private ?string          $picEmail = null,
    ) {}

    public static function create(
        string  $name,
        string  $type,
        string  $code,
        ?string $sio = null,
        ?string $nib = null,
        ?string $npwpFullName = null,
        ?string $npwpType = null,
        ?string $nikNpwp = null,
        ?string $npwpNumber = null,
        ?string $npwpAddress = null,
        ?string $npwpProvinceId = null,
        ?string $npwpDistrictId = null,
        ?string $ktpFullName = null,
        ?string $nikKtp = null,
        ?string $ktpAttachment = null,
        ?string $picFullName = null,
        ?string $picRole = null,
        ?string $picPhoneNumber = null,
        ?string $picEmail = null,
    ): self {
        return new self(
            id:             (string) \Str::uuid(),
            name:           $name,
            code:           $code,
            type:           $type,
            sio:            $sio,
            nib:            $nib,
            npwpFullName:   $npwpFullName,
            npwpType:       $npwpType,
            nikNpwp:        $nikNpwp,
            npwpNumber:     $npwpNumber,
            npwpAddress:    $npwpAddress,
            npwpProvinceId: $npwpProvinceId,
            npwpDistrictId: $npwpDistrictId,
            ktpFullName:    $ktpFullName,
            nikKtp:         $nikKtp,
            ktpAttachment:  $ktpAttachment,
            picFullName:    $picFullName,
            picRole:        $picRole,
            picPhoneNumber: $picPhoneNumber,
            picEmail:       $picEmail,
        );
    }

    public function getId(): string         { return $this->id; }
    public function getName(): string       { return $this->name; }
    public function getCode(): string       { return $this->code; }
    public function getType(): string       { return $this->type; }
    public function getSio(): ?string       { return $this->sio; }
    public function getNib(): ?string       { return $this->nib; }
    public function getPicEmail(): ?string  { return $this->picEmail; }

    public function update(array $data): void
    {
        $this->name           = $data['name']            ?? $this->name;
        $this->type           = $data['type']            ?? $this->type;
        $this->sio            = $data['sio']             ?? $this->sio;
        $this->nib            = $data['nib']             ?? $this->nib;
        $this->npwpFullName   = $data['npwp_full_name']  ?? $this->npwpFullName;
        $this->npwpType       = $data['npwp_type']       ?? $this->npwpType;
        $this->nikNpwp        = $data['nik_npwp']        ?? $this->nikNpwp;
        $this->npwpNumber     = $data['npwp_number']     ?? $this->npwpNumber;
        $this->npwpAddress    = $data['npwp_address']    ?? $this->npwpAddress;
        $this->npwpProvinceId = $data['npwp_province_id'] ?? $this->npwpProvinceId;
        $this->npwpDistrictId = $data['npwp_district_id'] ?? $this->npwpDistrictId;
        $this->ktpFullName    = $data['ktp_full_name']   ?? $this->ktpFullName;
        $this->nikKtp         = $data['nik_ktp']         ?? $this->nikKtp;
        $this->ktpAttachment  = $data['ktp_attachment']  ?? $this->ktpAttachment;
        $this->picFullName    = $data['pic_full_name']   ?? $this->picFullName;
        $this->picRole        = $data['pic_role']        ?? $this->picRole;
        $this->picPhoneNumber = $data['pic_phone_number'] ?? $this->picPhoneNumber;
        $this->picEmail       = $data['pic_email']       ?? $this->picEmail;
    }

    public function toArray(): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'code'             => $this->code,
            'type'             => $this->type,
            'sio'              => $this->sio,
            'nib'              => $this->nib,
            'npwp_full_name'   => $this->npwpFullName,
            'npwp_type'        => $this->npwpType,
            'nik_npwp'         => $this->nikNpwp,
            'npwp_number'      => $this->npwpNumber,
            'npwp_address'     => $this->npwpAddress,
            'npwp_province_id' => $this->npwpProvinceId,
            'npwp_district_id' => $this->npwpDistrictId,
            'ktp_full_name'    => $this->ktpFullName,
            'nik_ktp'          => $this->nikKtp,
            'ktp_attachment'   => $this->ktpAttachment,
            'pic_full_name'    => $this->picFullName,
            'pic_role'         => $this->picRole,
            'pic_phone_number' => $this->picPhoneNumber,
            'pic_email'        => $this->picEmail,
        ];
    }
}
