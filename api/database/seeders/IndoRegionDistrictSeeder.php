<?php

/*
 * This file is part of the IndoRegion package.
 *
 * (c) Azis Hapidin <azishapidin.com | azishapidin@gmail.com>
 *
 */

namespace Database\Seeders;

use App\Models\District;
use App\Models\Regency;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Seeder;
use AzisHapidin\IndoRegion\RawDataGetter;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class IndoRegionDistrictSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     * @deprecated
     *
     */
    public function run()
    {
        $districts = RawDataGetter::getDistricts();

        foreach ($districts as $district) {
            $regency = Regency::where('regencies.old_id', $district['regency_id'])->first();

            District::create([
                'old_id' => $district['id'],
                'name' => $district['name'],
                'regency_id' => $regency->id,
            ]);
        }


        Schema::table('regencies', function (Blueprint $table) {
            $table->dropColumn('old_id');
        });
    }
}
