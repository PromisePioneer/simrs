<?php

namespace Database\Factories;

use App\Models\Patient;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Patient>
 */
class PatientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name' => $this->faker->name(),
            'tenant_id' => Tenant::factory()->create()->id,
            'medical_record_number' => $this->faker->randomNumber(),
            'city_of_birth' => $this->faker->city(),
            'date_of_birth' => $this->faker->date(),
            'id_card_number' => $this->faker->randomNumber(),
            'gender' => $this->faker->randomElement(['pria', 'wanita']),
            'religion' => $this->faker->randomElement(['islam', 'protestan', 'katholik', 'hindu', 'budha', 'konghucu']),
            'blood_type' => $this->faker->randomElement(['a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-']),
            'job' => $this->faker->jobTitle(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'date_of_consultation' => $this->faker->date(),
            'profile_picture' => $this->faker->imageUrl(),
        ];
    }
}
