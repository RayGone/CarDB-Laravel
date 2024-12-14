<?php

namespace App\Dtos;

use App\Enums\SortOrderEnum;
use App\Enums\CarsAttributeEnum;

class FilterModel{
    public array $filters;
    public int $limit;
    public int $page;
    public SortOrderEnum $order;
    public CarsAttributeEnum $orderBy;
    public string $search;

    public function __construct(
        array $filters =[], int | null $limit=5,
        int | null $page=0,
        string | null $order=SortOrderEnum::ASC,
        string | null $orderBy=CarsAttributeEnum::ID,
        string | null $search="")
    {
        $this->filters = $filters ? $filters : [];
        $this->limit = $limit ? $limit : 5;
        $this->page = $page ? $page : 0;
        $this->order = $order ? SortOrderEnum::from($order) : SortOrderEnum::ASC;
        $this->orderBy = $orderBy ? CarsAttributeEnum::from($orderBy) : CarsAttributeEnum::ID;
        $this->search = $search ? $search : "";
    }

    public static function init(array $model){
        return new self(isset($model['filters']) ? $model['filters'] : [],
                        isset($model['limit']) ? $model['limit'] : null,
                        isset($model['page']) ? $model['page'] : null,
                        isset($model['order']) ? $model['order'] : null,
                        isset($model['orderBy']) ? $model['orderBy'] : null,
                        isset($model['search']) ? $model['search'] : null);
    }
}
?>