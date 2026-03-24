<?php

declare(strict_types=1);

namespace Domains\Billing\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                     => $this->id,
            'bill_number'            => $this->bill_number,
            'status'                 => $this->status,
            'status_label'           => $this->statusLabel(),
            'subtotal'               => (float) $this->subtotal,
            'discount'               => (float) $this->discount,
            'tax'                    => (float) $this->tax,
            'total'                  => (float) $this->total,
            'paid_at'                => $this->paid_at?->toDateTimeString(),
            'notes'                  => $this->notes,
            'created_at'             => $this->created_at?->toDateTimeString(),

            // Relations
            'patient'                => $this->whenLoaded('patient', fn() => [
                'id'         => $this->patient->id,
                'full_name'  => $this->patient->full_name,
                'mrn'        => $this->patient->medical_record_number,
            ]),
            'payment_method'         => $this->whenLoaded('paymentMethod', fn() => [
                'id'   => $this->paymentMethod->id,
                'name' => $this->paymentMethod->name,
            ]),
            'outpatient_visit'       => $this->whenLoaded('outpatientVisit', fn() => [
                'id'         => $this->outpatientVisit->id,
                'visited_at' => $this->outpatientVisit->created_at?->toDateString(),
                'doctor'     => $this->outpatientVisit->relationLoaded('doctor')
                    ? ['name' => $this->outpatientVisit->doctor?->name]
                    : null,
            ]),
            'inpatient_admission'    => $this->whenLoaded('inpatientAdmission', fn() => [
                'id'           => $this->inpatientAdmission->id,
                'admitted_at'  => $this->inpatientAdmission->admitted_at?->toDateString(),
                'discharged_at'=> $this->inpatientAdmission->discharged_at?->toDateString(),
            ]),
            'items'                  => $this->whenLoaded('items', fn() =>
                $this->items->map(fn($item) => [
                    'id'                => $item->id,
                    'item_type'         => $item->item_type,
                    'description'       => $item->description,
                    'quantity'          => $item->quantity,
                    'unit_price'        => (float) $item->unit_price,
                    'subtotal'          => (float) $item->subtotal,
                    'medicine_batch_id' => $item->medicine_batch_id,
                    'medicine_name'     => $item->relationLoaded('medicineBatch')
                        ? $item->medicineBatch?->medicine?->name
                        : null,
                ])
            ),
        ];
    }

    private function statusLabel(): string
    {
        return match($this->status) {
            'draft'     => 'Draft',
            'issued'    => 'Diterbitkan',
            'paid'      => 'Lunas',
            'cancelled' => 'Dibatalkan',
            default     => $this->status,
        };
    }
}
