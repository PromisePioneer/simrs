<?php

declare(strict_types=1);

namespace Domains\Facility\Application\Services;

use Domains\Facility\Domain\Repository\WardRepositoryInterface;
use Domains\Facility\Infrastructure\Persistence\Models\WardModel;
use Illuminate\Http\Request;

readonly class WardService
{
    public function __construct(
        private WardRepositoryInterface $wardRepository
    )
    {
    }

    public function getWards(Request $request): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->wardRepository->getWards(
            filters: $filters,
            perPage: $perPage ? (int)$perPage : null
        );
    }

    public function store(array $data): object
    {
        return $this->wardRepository->store(data: $data);
    }

    public function update(array $data, WardModel $ward): object
    {
        return $this->wardRepository->update(data: $data, id: $ward->id);
    }

    public function destroy(WardModel $ward): bool
    {
        return $this->wardRepository->destroy(id: $ward->id);
    }
}
