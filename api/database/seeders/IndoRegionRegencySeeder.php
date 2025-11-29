<?php

/*
 * This file is part of the IndoRegion package.
 *
 * (c) Azis Hapidin <azishapidin.com | azishapidin@gmail.com>
 *
 */

namespace Database\Seeders;

use App\Models\Regency;
use App\Models\Province;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Seeder;
use AzisHapidin\IndoRegion\RawDataGetter;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class IndoRegionRegencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     * @deprecated
     *
     */
    public function run(): void
    {
        // Get Data
        $regencies = RawDataGetter::getRegencies();
        foreach ($regencies as $regency) {
            // Cari Province berdasarkan old_id
            $province = Province::where('old_id', $regency['province_id'])->first();

            if ($province) {
                Regency::create([
                    'id' => Str::uuid()->toString(),
                    'old_id' => $regency['id'],
                    'old_province_id' => $regency['id'],
                    'name' => $regency['name'],
                    'province_id' => $province->id,
                ]);
            }
        }

        Schema::table('provinces', function (Blueprint $table) {
            $table->dropColumn('old_id');
        });

        Schema::table('regencies', function (Blueprint $table) {
            $table->dropColumn('old_province_id');
        });
    }
}
