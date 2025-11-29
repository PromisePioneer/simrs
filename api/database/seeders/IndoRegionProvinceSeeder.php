<?php

/*
 * This file is part of the IndoRegion package.
 *
 * (c) Azis Hapidin <azishapidin.com | azishapidin@gmail.com>
 *
 */

namespace Database\Seeders;

use App\Models\Province;
use Illuminate\Database\Seeder;
use AzisHapidin\IndoRegion\RawDataGetter;
use Illuminate\Support\Facades\DB;

class IndoRegionProvinceSeeder extends Seeder
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
        // Get Data
        $provinces = RawDataGetter::getProvinces();
        foreach ($provinces as $province) {
            Province::create([
                'name' => $province['name'],
                'old_id' => $province['id'],
            ]);
        }
    }
}
