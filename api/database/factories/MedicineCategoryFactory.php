<?php

namespace Database\Factories;

use App\Models\MedicineCategory;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MedicineCategory>
 */
class MedicineCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory()->create()->id,
            'code' => $this->faker->randomDigit(),
            'name' => $this->faker->word(),
            'type' => $this->faker->randomElement(['general', 'medicine', 'medical_devices', 'service']),
        ];
    }
}
