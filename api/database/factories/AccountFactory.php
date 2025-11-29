<?php

namespace Database\Factories;

use App\Models\AccountCategory;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
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
            'account_category_id' => AccountCategory::factory()->create()->id,
            'code' => $this->faker->uuid(),
            'name' => $this->faker->name(),
            'parent_id' => null,
        ];
    }
}
