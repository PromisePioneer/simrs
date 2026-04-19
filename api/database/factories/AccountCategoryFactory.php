<?php

namespace Database\Factories;

use App\Models\AccountCategory;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AccountCategory>
 */
class AccountCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'tenant_id' => Tenant::factory()->create()->id,
        ];
    }
}
