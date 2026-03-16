<?php

namespace Domains\IAM\Infrastructure\Persistence\Repositories;

use Domains\IAM\Domain\Repository\RoomTypeRepositoryInterface;
use Domains\IAM\Infrastructure\Persistence\Models\RoomTypeModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentRoomTypeRepository extends BaseEloquentRepository implements RoomTypeRepositoryInterface
{


    public function __construct()
    {
        parent::__construct(new RoomTypeModel());
    }


    public function extractFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                ->orWhere('description', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }

}
