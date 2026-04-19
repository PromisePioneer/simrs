<?php

namespace Domains\MasterData\Infrastructure\Persistent\Repositories;

use Domains\MasterData\Domain\Repository\RoomTypeRepositoryInterface;
use Domains\MasterData\Infrastructure\Persistent\Models\RoomTypeModel;
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
