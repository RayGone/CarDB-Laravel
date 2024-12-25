<?php

namespace App\Repositories;

use App\Dtos\CarDto;
use App\Models\Cars;
use App\Dtos\FilterModel;
use App\Enums\CarsAttributeEnum;

class CarsRepository{
    public function __construct(){}

    public function query(array $filterModel){
        $filterModel = FilterModel::init($filterModel);

        $query = Cars::orderBy($filterModel->orderBy->value, $filterModel->order->value);

        if(strlen($filterModel->search > 0)){
            $query = $query->where((CarsAttributeEnum::NAME)->value, 'LIKE',  "%{$filterModel->search}%")
                            ->orWhere((CarsAttributeEnum::ORIGIN)->value, 'LIKE',  "%{$filterModel->search}%");
        }


        if(count($filterModel->filters) > 0){
            $filter = array_shift($filterModel->filters);
            $query = $query->where($filter->getField(), $filter->getOps(), $filter->getValue());

            foreach($filterModel->filters as $filter){
                $query = $query->where($filter->getField(), $filter->getOps(), $filter->getValue());
            }
        }
        $total = $query->count();

        $query = $query->skip(($filterModel->page * $filterModel->limit))->take($filterModel->limit);
        $cars = $query->get();
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

    public function queryOne(int $id){
        return Cars::find($id);
    }

    public function addCar(array $car){
        $dto = (new CarDto($car))->toArray();
        $oldCar = Cars::where("name",$dto['name'])->where("origin",$dto['origin'])->where("model_year",$dto['model_year'])->get();
        if(count($oldCar))
            return $oldCar;

        // var_dump($oldCar);

        unset($dto['id']);
        $newCar = Cars::create($dto);
        return $newCar;
    }
}
?>
