<?php

namespace App\Actions\Tenant;

use App\Http\Requests\TenantRequest;
use App\Models\Tenant;

class CreateTenant
{
    public function execute(TenantRequest $request): Tenant
    {
        $data = $request->validated();
        $data['code'] = now()->format('YmdHis');
        return Tenant::create($data);
    }
}
