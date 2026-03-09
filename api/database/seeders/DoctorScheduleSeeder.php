<?php

namespace Database\Seeders;

use App\Models\DoctorSchedule;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DoctorScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $user = User::whereHas('roles', function ($query) {
            $query->where('name', 'Dokter');
        })->get();

        $day = [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday'
        ];


        foreach ($user as $u) {
            foreach ($day as $d) {
                DoctorSchedule::create([
                    'user_id' => $u->id,
                    'day_of_week' => $d,
                    'start_time' => "9:00",
                    'end_time' => "16:00"
                ]);
            }
        }
    }
}
