<?php

namespace App\Services\Master\General\Region\Province\Interface;

interface ProvinceRepositoryInterface
{
    public function getProvinces($filters = [], $perPage = 20): ?object;
}
