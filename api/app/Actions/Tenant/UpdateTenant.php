<?php

namespace App\Actions\Tenant;

use App\Http\Requests\TenantRequest;
use App\Models\Tenant;

class UpdateTenant
{
    public function execute(TenantRequest $request, Tenant $tenant): Tenant
    {
        $tenant->update($request->validated());
        return $tenant;
    }
}
