<?php

namespace Database\Factories;

use App\Models\PatientVitalSign;
use App\Models\VisitList;
use Illuminate\Database\Eloquent\Factories\Factory;

class PatientVitalSignFactory extends Factory
{
    protected $model = PatientVitalSign::class;

    public function definition(): array
    {
        return [
            'visit_list_id' => VisitList::factory()->create()->create()->id,
        ];
    }
}
