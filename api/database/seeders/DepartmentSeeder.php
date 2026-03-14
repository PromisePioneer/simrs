<?php

namespace Database\Seeders;

use App\Models\Building;
use App\Models\Department;
use App\Models\Tenant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Department::insert([
            [
                'id' => Str::uuid()->toString(),
                'name' => 'Penyakit Dalam',
                'description' => fake()->sentence(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'name' => 'Bedah',
                'description' => fake()->sentence(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'name' => 'Anak',
                'description' => fake()->sentence(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'name' => 'Obstetri & Ginekologi',
                'description' => fake()->sentence(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'name' => 'ICU',
                'description' => fake()->sentence(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'name' => 'NICU',
                'description' => fake()->sentence(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'name' => 'HCU',
                'description' => fake()->sentence(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'name' => 'Isolasi',
                'description' => fake()->sentence(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'name' => 'Rehabilitasi Medik',
                'description' => fake()->sentence(),
            ],
        ]);
    }
}
