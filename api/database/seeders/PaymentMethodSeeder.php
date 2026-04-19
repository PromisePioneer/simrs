<?php

namespace Database\Seeders;

use Domains\MasterData\Infrastructure\Persistent\Models\PaymentMethodModel;
use Domains\MasterData\Infrastructure\Persistent\Models\PaymentMethodTypeModel;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = public_path('json/paymentMethods.json');
        $data = json_decode(file_get_contents($path), true);

        foreach ($data as $item) {
            $type = PaymentMethodTypeModel::where('name', $item['tipe'])->first();

            PaymentMethodModel::create([
                'name' => $item['nama'],
                'payment_method_type_id' => $type->id,
            ]);
        }
    }
}
