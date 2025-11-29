<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductRack;
use App\Models\ProductUnitType;
use App\Models\ProductWarehouse;
use App\Models\Tenant;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory()->create()->id,
            'sku' => $this->faker->unique()->ean8(),
            'name' => $this->faker->name(),
            'code' => $this->faker->unique()->ean8(),
            'must_has_receipt' => $this->faker->boolean(),
            'type' => $this->faker->randomElement(['general', 'medicine', 'medical_devices', 'service']),
            'warehouse_id' => ProductWarehouse::factory()->create()->id,
            'category_id' => ProductCategory::factory()->create()->id,
            'rack_id' => ProductRack::factory()->create()->id,
            'is_for_sell' => $this->faker->boolean(),
            'unit_type_id' => ProductUnitType::factory()->create()->id,
            'expired_date' => $this->faker->date(),
            'expired_notification_days' => $this->faker->randomDigit(),
            'stock_amount' => $this->faker->randomDigit(),
            'minimum_stock_amount' => $this->faker->randomDigit(),
            'reference_purchase_price' => $this->faker->randomDigit()
        ];
    }
}
