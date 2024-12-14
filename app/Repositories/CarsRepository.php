<?php

namespace App\Repositories;

use App\Models\Cars;
use App\Dtos\FilterModel;
use App\Enums\CarsAttributeEnum;

class CarsRepository{
    public function __construct(){}

    public function query(array $filterModel){
        $filterModel = FilterModel::init($filterModel);

        $query = Cars::orderBy($filterModel->orderBy->value, $filterModel->order->value);
        if(strlen($filterModel->search > 0)){
            $query = $query->whereRaw('? ILIKE ?',[CarsAttributeEnum::NAME, "%{$filterModel->search}%"]);
        }

        $query = Cars::skip(($filterModel->page * $filterModel->limit))->take($filterModel->limit);
        $cars = $query->get();
        $total = Cars::count();
        return [
            "cars" => $cars,
            "total" => $total
        ];
        // $paginate = Cars::paginate($this->def_pageSize);
        // return [
        //     "cars" => $paginate->items(),
        //     "total" => $paginate->total()
        // ];
    }
}
?>
