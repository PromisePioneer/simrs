<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use App\Models\PaymentMethodType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
            $type = PaymentMethodType::where('name', $item['tipe'])->first();

            PaymentMethod::create([
                'name' => $item['nama'],
                'payment_method_type_id' => $type->id,
            ]);
        }
    }
}
