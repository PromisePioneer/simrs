<?php

namespace Database\Factories;

use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MedicineBatchFactory extends Factory
{
    protected $model = MedicineBatch::class;

    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::inRandomOrder()->value('id'),
            'medicine_id' => Medicine::query()->inRandomOrder()->value('id'),
            'batch_number' => 'BATCH-' . strtoupper(Str::random(8)),
            'sequence' => random_int(1, 100),
            'is_auto_batch' => $this->faker->boolean(30),
            'expired_date' => $this->faker->dateTimeBetween('+1 month', '+2 years'),
        ];
    }
}
