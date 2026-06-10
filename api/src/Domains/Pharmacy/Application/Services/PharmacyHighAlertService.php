<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyHighAlertClassification;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyLASAClassification;
use Illuminate\Support\Str;

/**
 * PharmacyHighAlertService
 *
 * Pengelolaan obat High Alert dan LASA (Look Alike Sound Alike).
 * Digunakan saat dispensing untuk memunculkan peringatan otomatis.
 */
class PharmacyHighAlertService
{
    /**
     * Klasifikasikan obat sebagai High Alert
     */
    public function classifyHighAlert(string $tenantId, array $data): array
    {
        $existing = PharmacyHighAlertClassification::where('tenant_id', $tenantId)
            ->where('medicine_id', $data['medicine_id'])
            ->first();

        if ($existing) {
            $existing->update([
                'alert_level' => $data['alert_level'],
                'warning_label' => $data['warning_label'] ?? null,
                'storage_requirement' => $data['storage_requirement'] ?? null,
                'dispensing_precaution' => $data['dispensing_precaution'] ?? null,
                'double_check_required' => $data['double_check_required'] ?? true,
                'requires_special_storage' => $data['requires_special_storage'] ?? false,
                'visual_alert_color' => $data['visual_alert_color'] ?? '#FF0000',
                'is_active' => true,
                'updated_by' => auth()->id(),
            ]);
            return ['status' => 'updated', 'id' => $existing->id];
        }

        $classification = PharmacyHighAlertClassification::create([
            'id' => Str::uuid(),
            'tenant_id' => $tenantId,
            'medicine_id' => $data['medicine_id'],
            'alert_level' => $data['alert_level'],
            'warning_label' => $data['warning_label'] ?? null,
            'storage_requirement' => $data['storage_requirement'] ?? null,
            'dispensing_precaution' => $data['dispensing_precaution'] ?? null,
            'double_check_required' => $data['double_check_required'] ?? true,
            'requires_special_storage' => $data['requires_special_storage'] ?? false,
            'visual_alert_color' => $data['visual_alert_color'] ?? '#FF0000',
            'is_active' => true,
            'classified_by' => auth()->id(),
        ]);

        return ['status' => 'created', 'id' => $classification->id];
    }

    /**
     * Daftar semua High Alert aktif
     */
    public function getHighAlertList(string $tenantId, ?string $level = null): array
    {
        $query = PharmacyHighAlertClassification::byTenant($tenantId)->active()->with('medicine');

        if ($level) {
            $query->byLevel($level);
        }

        return $query->orderBy('alert_level')->get()->toArray();
    }

    /**
     * Cek apakah obat termasuk High Alert (saat dispensing)
     */
    public function checkHighAlert(string $tenantId, array $medicineIds): array
    {
        $alerts = PharmacyHighAlertClassification::byTenant($tenantId)
            ->active()
            ->whereIn('medicine_id', $medicineIds)
            ->get()
            ->keyBy('medicine_id');

        $result = [];
        foreach ($medicineIds as $medicineId) {
            $alert = $alerts->get($medicineId);
            $result[$medicineId] = [
                'is_high_alert' => $alert !== null,
                'alert_level' => $alert?->alert_level,
                'warning_label' => $alert?->warning_label,
                'double_check_required' => $alert?->double_check_required ?? false,
                'dispensing_precaution' => $alert?->dispensing_precaution,
                'visual_alert_color' => $alert?->visual_alert_color ?? null,
            ];
        }

        return $result;
    }

    /**
     * Daftarkan pasangan LASA
     */
    public function registerLASAPair(string $tenantId, array $data): array
    {
        // Pastikan order konsisten: medicine_a < medicine_b
        [$a, $b] = [$data['medicine_a_id'], $data['medicine_b_id']];
        if ($a > $b) [$a, $b] = [$b, $a];

        $existing = PharmacyLASAClassification::where('tenant_id', $tenantId)
            ->where('medicine_a_id', $a)
            ->where('medicine_b_id', $b)
            ->first();

        if ($existing) {
            $existing->update([
                'lasa_type' => $data['lasa_type'],
                'similarity_reason' => $data['similarity_reason'] ?? null,
                'requires_tall_man_lettering' => $data['requires_tall_man_lettering'] ?? false,
                'tall_man_lettering_a' => $data['tall_man_lettering_a'] ?? null,
                'tall_man_lettering_b' => $data['tall_man_lettering_b'] ?? null,
                'is_active' => true,
            ]);
            return ['status' => 'updated', 'id' => $existing->id];
        }

        $pair = PharmacyLASAClassification::create([
            'id' => Str::uuid(),
            'tenant_id' => $tenantId,
            'medicine_a_id' => $a,
            'medicine_b_id' => $b,
            'lasa_type' => $data['lasa_type'],
            'similarity_reason' => $data['similarity_reason'] ?? null,
            'requires_tall_man_lettering' => $data['requires_tall_man_lettering'] ?? false,
            'tall_man_lettering_a' => $data['tall_man_lettering_a'] ?? null,
            'tall_man_lettering_b' => $data['tall_man_lettering_b'] ?? null,
            'is_active' => true,
            'classified_by' => auth()->id(),
        ]);

        return ['status' => 'created', 'id' => $pair->id];
    }

    /**
     * Cek LASA pairs untuk daftar obat (saat input resep/dispensing)
     */
    public function checkLASAWarnings(string $tenantId, array $medicineIds): array
    {
        if (empty($medicineIds)) return [];

        $pairs = PharmacyLASAClassification::byTenant($tenantId)
            ->active()
            ->where(function ($q) use ($medicineIds) {
                $q->whereIn('medicine_a_id', $medicineIds)
                    ->orWhereIn('medicine_b_id', $medicineIds);
            })
            ->with(['medicineA', 'medicineB'])
            ->get();

        return $pairs->map(fn($pair) => [
            'lasa_type' => $pair->lasa_type,
            'similarity_reason' => $pair->similarity_reason,
            'medicine_a' => [
                'id' => $pair->medicine_a_id,
                'name' => $pair->medicineA?->name,
                'tall_man' => $pair->tall_man_lettering_a,
            ],
            'medicine_b' => [
                'id' => $pair->medicine_b_id,
                'name' => $pair->medicineB?->name,
                'tall_man' => $pair->tall_man_lettering_b,
            ],
            'requires_tall_man_lettering' => $pair->requires_tall_man_lettering,
        ])->toArray();
    }

    /**
     * Daftar LASA aktif
     */
    public function getLASAList(string $tenantId): array
    {
        return PharmacyLASAClassification::byTenant($tenantId)
            ->active()
            ->with(['medicineA', 'medicineB'])
            ->orderBy('lasa_type')
            ->get()
            ->toArray();
    }

    /**
     * Nonaktifkan klasifikasi high alert
     */
    public function deactivateHighAlert(string $tenantId, string $medicineId): array
    {
        PharmacyHighAlertClassification::where('tenant_id', $tenantId)
            ->where('medicine_id', $medicineId)
            ->update(['is_active' => false, 'updated_by' => auth()->id()]);

        return ['status' => 'success'];
    }
}
