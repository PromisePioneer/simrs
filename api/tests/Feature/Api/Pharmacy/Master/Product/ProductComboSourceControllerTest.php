<?php

use App\Models\Product;
use Illuminate\Support\Carbon;

it('returns all products', function () {
    Product::factory()->create(['tenant_id' => $this->tenant->id]);
    Product::factory()->create(['tenant_id' => $this->tenant->id]);

    $response = $this->getJson('/api/v1/combo-sources/products/');
    $response->assertStatus(200)
        ->assertJsonStructure([
            '*' => [
                'id',
                'name',
            ]
        ]);
});

it('returns only expired products', function () {
    Product::factory()->create([
        'name' => 'Expired Product',
        'expired_date' => Carbon::now()->subDay(),
        'tenant_id' => $this->tenant->id,
    ]);

    Product::factory()->create([
        'name' => 'Active Product',
        'expired_date' => Carbon::now()->addDay(),
        'tenant_id' => $this->tenant->id,
    ]);

    $response = $this->getJson('/api/v1/combo-sources/products/expired?status=expired');


    $response->assertStatus(200)
        ->assertJsonCount(1)
        ->assertJsonFragment(['name' => 'Expired Product']);
});

it('returns only active products', function () {
    Product::factory()->create([
        'name' => 'Expired Product',
        'expired_date' => Carbon::now()->subDay(),
        'tenant_id' => $this->tenant->id,
    ]);

    Product::factory()->create([
        'name' => 'Active Product',
        'expired_date' => Carbon::now()->addDay(),
        'tenant_id' => $this->tenant->id,
    ]);

    $response = $this->getJson('/api/v1/combo-sources/products/active?status=active');


    $response->assertStatus(200)
        ->assertJsonCount(1)
        ->assertJsonFragment(['name' => 'Active Product'])
        ->assertJsonMissing(['name' => 'Expired Product']);
});

it('can search products by name or code', function () {
    Product::factory()->create([
        'name' => 'Apple',
        'code' => 'APL001',
        'tenant_id' => $this->tenant->id,
    ]);

    Product::factory()->create([
        'name' => 'Banana',
        'code' => 'BNA002',
        'tenant_id' => $this->tenant->id,
    ]);

    $response = $this->getJson('/api/v1/combo-sources/products?search=Apple');

    $response->assertStatus(200)
        ->assertJsonCount(1)
        ->assertJsonFragment(['name' => 'Apple'])
        ->assertJsonMissing(['name' => 'Banana']);

    $response = $this->getJson('/api/v1/combo-sources/products?search=BNA002');

    $response->assertStatus(200)
        ->assertJsonCount(1)
        ->assertJsonFragment(['code' => 'BNA002'])
        ->assertJsonMissing(['code' => 'APL001']);
});
