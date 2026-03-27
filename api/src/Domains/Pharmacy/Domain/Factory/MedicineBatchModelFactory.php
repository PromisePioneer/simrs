<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Domain\Factory;

use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineModel;
use Domains\Tenant\Infrastructure\Persistence\Models\TenantModel;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Random\RandomException;

class MedicineBatchModelFactory extends Factory
{
    protected $model = MedicineBatchModel::class;

    /**
     * @throws RandomException
     */
    public function definition(): array
    {
        return [
            'tenant_id'    => TenantModel::inRandomOrder()->value('id'),
            'medicine_id'  => MedicineModel::inRandomOrder()->value('id'),
            'batch_number' => 'BATCH-' . strtoupper(Str::random(8)),
            'sequence'     => random_int(1, 100),
            'is_auto_batch'=> $this->faker->boolean(30),
            'expired_date' => $this->faker->dateTimeBetween('+1 month', '+2 years'),
            'selling_price'=> $this->faker->randomFloat(2, 1000, 100000),
        ];
    }
}
