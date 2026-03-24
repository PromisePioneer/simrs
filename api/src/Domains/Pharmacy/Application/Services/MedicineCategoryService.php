<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use App\Services\Tenant\TenantContext;
use Domains\Pharmacy\Domain\Repository\MedicineCategoryRepositoryInterface;
use Illuminate\Http\Request;

readonly class MedicineCategoryService
{
    public function __construct(private readonly MedicineCategoryRepositoryInterface $categoryRepository)
    {
    }

    public function getCategories(Request $request): object
    {
        return $this->categoryRepository->getCategories(
            filters: $request->only(['search']),
            perPage: (int)$request->input('per_page'),
        );
    }

    public function store(array $data): ?object
    {
        $data['tenant_id'] = TenantContext::getId();
        return $this->categoryRepository->store($data);
    }

    public function update(array $data, string $id): ?object
    {
        return $this->categoryRepository->update($id, $data);
    }

    public function destroy(string $id): ?object
    {
        return $this->categoryRepository->destroy($id);
    }
}
