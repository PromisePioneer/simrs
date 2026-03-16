<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                      => $this->id,
            'name'                    => $this->name,
            'email'                   => $this->email,
            'phone'                   => $this->phone,
            'address'                 => $this->address,
            'poli_id'                 => $this->poli_id,
            'str_institution_id'      => $this->str_institution_id,
            'str_registration_number' => $this->str_registration_number,
            'str_active_period'       => $this->str_active_period,
            'sip_institution_id'      => $this->sip_institution_id,
            'sip_registration_number' => $this->sip_registration_number,
            'sip_active_period'       => $this->sip_active_period,
            'signature'               => $this->signature ? asset('storage/' . $this->signature) : null,
            'profile_picture'         => $this->profile_picture ? asset('storage/' . $this->profile_picture) : null,
            'full_name_with_degrees'  => $this->full_name_with_degrees,

            'poli' => $this->whenLoaded('poli', fn() => [
                'id'   => $this->poli?->id,
                'name' => $this->poli?->name,
            ]),

            'roles' => $this->whenLoaded('roles', fn() =>
                $this->roles->map(fn($r) => ['id' => $r->uuid, 'name' => $r->name])
            ),

            'degrees' => $this->whenLoaded('degrees', fn() =>
                $this->degrees->map(fn($d) => [
                    'id'    => $d->id,
                    'name'  => $d->name,
                    'type'  => $d->type,
                    'order' => $d->pivot->order ?? 0,
                ])
            ),

            'doctor_schedule' => $this->whenLoaded('doctorSchedule', fn() =>
                $this->doctorSchedule->map(fn($s) => [
                    'day_of_week' => $s->day_of_week,
                    'start_time'  => $s->start_time,
                    'end_time'    => $s->end_time,
                ])
            ),

            'str'    => $this->whenLoaded('str',    fn() => ['id' => $this->str?->id,    'name' => $this->str?->name]),
            'sip'    => $this->whenLoaded('sip',    fn() => ['id' => $this->sip?->id,    'name' => $this->sip?->name]),
            'tenant' => $this->whenLoaded('tenant', fn() => ['id' => $this->tenant?->id, 'name' => $this->tenant?->name]),

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
