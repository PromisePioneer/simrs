<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Domain\Repository\IHighAlertRepository;
use Domains\Pharmacy\Domain\Repository\ILASARepository;

class PharmacyHighAlertService
{
    public function __construct(
        private readonly IHighAlertRepository $highAlertRepo,
        private readonly ILASARepository $lasaRepo,
    ) {}

    public function classifyHighAlert(string $tenantId, array $data): array
    {
        $record = $this->highAlertRepo->upsert($tenantId, $data['medicine_id'], [
            'classified_by' => auth()->id(),
            'updated_by' => auth()->id(),
            ...$data,
        ]);
        return ['status' => 'success', 'id' => $record->id];
    }

    public function getHighAlertList(string $tenantId, ?string $level): array
    {
        return collect($this->highAlertRepo->getActive($tenantId, $level))->toArray();
    }

    public function checkHighAlert(string $tenantId, array $medicineIds): array
    {
        $alerts = collect($this->highAlertRepo->getByMedicineIds($tenantId, $medicineIds))->keyBy('medicine_id');
        return collect($medicineIds)->mapWithKeys(fn($id) => [$id => [
            'is_high_alert' => $alerts->has($id),
            'alert_level' => $alerts->get($id)?->alert_level,
            'warning_label' => $alerts->get($id)?->warning_label,
            'double_check_required' => $alerts->get($id)?->double_check_required ?? false,
            'dispensing_precaution' => $alerts->get($id)?->dispensing_precaution,
            'visual_alert_color' => $alerts->get($id)?->visual_alert_color,
        ]])->toArray();
    }

    public function deactivateHighAlert(string $tenantId, string $medicineId): array
    {
        $this->highAlertRepo->deactivate($tenantId, $medicineId, auth()->id());
        return ['status' => 'success'];
    }

    public function registerLASAPair(string $tenantId, array $data): array
    {
        $record = $this->lasaRepo->upsert(
            $tenantId,
            $data['medicine_a_id'],
            $data['medicine_b_id'],
            ['classified_by' => auth()->id(), ...$data]
        );
        return ['status' => 'success', 'id' => $record->id];
    }

    public function getLASAList(string $tenantId): array
    {
        return collect($this->lasaRepo->getActive($tenantId))->toArray();
    }

    public function checkLASAWarnings(string $tenantId, array $medicineIds): array
    {
        return collect($this->lasaRepo->getByMedicineIds($tenantId, $medicineIds))
            ->map(fn($p) => [
                'lasa_type' => $p->lasa_type,
                'similarity_reason' => $p->similarity_reason,
                'medicine_a' => ['id' => $p->medicine_a_id, 'name' => $p->medicineA?->name, 'tall_man' => $p->tall_man_lettering_a],
                'medicine_b' => ['id' => $p->medicine_b_id, 'name' => $p->medicineB?->name, 'tall_man' => $p->tall_man_lettering_b],
                'requires_tall_man_lettering' => $p->requires_tall_man_lettering,
            ])
            ->toArray();
    }
}
