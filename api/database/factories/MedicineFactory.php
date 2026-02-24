<?php

namespace Database\Factories;

use App\Models\Medicine;
use App\Models\MedicineCategory;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Random\RandomException;

class MedicineFactory extends Factory
{
    protected $model = Medicine::class;

    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::query()->inRandomOrder()->value('id'),
            'sku' => strtoupper(Str::random(10)),
            'sequence' => fake()->unique()->randomNumber(),
            'name' => $this->faker->randomElement([
                'Paracetamol 500mg',
                'Amoxicillin 500mg',
                'Ibuprofen 400mg',
                'Cefixime 200mg',
                'Vitamin C 500mg',
                'CTM 4mg',
                'Metformin 500mg',
                'Amlodipine 10mg'
            ]),
            'base_unit' => $this->faker->randomElement([
                'tablet',
                'capsule',
                'bottle',
                'ampoule',
                'vial',
                'sachet'
            ]),
            'type' => $this->faker->randomElement([
                'medicine',
                'consumable'
            ]),
            'must_has_receipt' => $this->faker->boolean(70),
            'is_for_sell' => true,
            'category_id' => MedicineCategory::inRandomOrder()->value('id'),
            'reference_purchase_price' => $this->faker->numberBetween(1000, 100000),
            'minimum_stock_amount' => $this->faker->numberBetween(10, 200),
        ];
    }
}
