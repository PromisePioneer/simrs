<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AccountTransaction>
 */
class AccountTransactionFactory extends Factory
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
            'account_id' => Account::factory()->create()->id,
            'type' => $this->faker->randomElement(['debit', 'credit']),
            'amount' => $this->faker->randomFloat(2, 10),
            'description' => $this->faker->text(),
        ];
    }
}
