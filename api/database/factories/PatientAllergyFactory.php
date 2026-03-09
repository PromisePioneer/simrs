<?php

namespace Database\Factories;

use App\Models\PatientAllergy;
use App\Models\VisitList;
use Illuminate\Database\Eloquent\Factories\Factory;

class PatientAllergyFactory extends Factory
{
    protected $model = PatientAllergy::class;

    public function definition(): array
    {
        return [
            'visit_list_id' => VisitList::factory()->create()->id,
            'patient_allergy' => $this->faker->text,
            'patient_medical_history' => $this->faker->text,
            'patient_family_medical_history' => $this->faker->text,
            'patient_medication_history' => $this->faker->text,
        ];
    }
}
