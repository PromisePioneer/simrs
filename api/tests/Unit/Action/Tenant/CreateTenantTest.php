<?php

use App\Actions\Tenant\CreateTenant;
use App\Http\Requests\TenantRequest;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(Tests\TestCase::class, RefreshDatabase::class);


it('creates a tenant with generated code', function () {
    $request = Mockery::mock(TenantRequest::class);
    $request->shouldReceive('validated')->andReturn([
        'name' => 'RS Sehat Selalu',
        'code' => '003',
        'type' => 'rs',
    ]);

    $tenant = (new CreateTenant())->execute($request);

    expect($tenant)->toBeInstanceOf(Tenant::class)
        ->and($tenant->name)->toBe('RS Sehat Selalu')
        ->and($tenant->code)->not->toBeNull();
});
