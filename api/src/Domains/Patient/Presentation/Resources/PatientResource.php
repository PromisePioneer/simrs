<?php

declare(strict_types=1);

namespace Domains\Patient\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * API Resource: Transformasi Eloquent PatientModel → JSON response.
 *
 * Resource ini dipakai di Controller untuk memformat output.
 * Tidak ada logic bisnis di sini.
 *
 * @property string  $id
 * @property string  $medical_record_number
 * @property string  $full_name
 * @property string  $city_of_birth
 * @property string  $date_of_birth
 * @property string  $id_card_number
 * @property string  $gender
 * @property ?string $religion
 * @property ?string $blood_type
 * @property string  $job
 * @property ?string $kis_number
 * @property string  $phone
 * @property ?string $email
 * @property string  $date_of_consultation
 * @property ?string $profile_picture
 * @property mixed   $addresses
 * @property mixed   $paymentMethods
 * @property ?string $created_at
 * @property ?string $updated_at
 */
class PatientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                    => $this->id,
            'medical_record_number' => $this->medical_record_number,
            'full_name'             => $this->full_name,
            'city_of_birth'         => $this->city_of_birth,
            'date_of_birth'         => $this->date_of_birth,
            'id_card_number'        => $this->id_card_number,
            'gender'                => $this->gender,
            'religion'              => $this->religion,
            'blood_type'            => $this->blood_type,
            'job'                   => $this->job,
            'kis_number'            => $this->kis_number,
            'phone'                 => $this->phone,
            'email'                 => $this->email,
            'date_of_consultation'  => $this->date_of_consultation,
            'profile_picture'       => $this->profile_picture
                ? asset('storage/' . $this->profile_picture)
                : null,

            'addresses' => $this->whenLoaded('addresses', fn() =>
                $this->addresses->map(fn($a) => [
                    'address'     => $a->address,
                    'province'    => $a->province,
                    'city'        => $a->city,
                    'subdistrict' => $a->subdistrict,
                    'ward'        => $a->ward,
                    'postal_code' => $a->postal_code,
                ])
            ),

            'payment_methods' => $this->whenLoaded('paymentMethods', fn() =>
                $this->paymentMethods->map(fn($pm) => [
                    'payment_method_type_id' => $pm->payment_method_type_id,
                    'bpjs_number'            => $pm->bpjs_number,
                ])
            ),

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
