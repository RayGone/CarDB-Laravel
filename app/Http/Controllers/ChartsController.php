<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;

use App\Repositories\CarsRepository;
use Illuminate\Http\Request;
use App\Enums\CarsAttributeEnum;
use App\Models\Cars;
use Illuminate\Support\Facades\DB;

use function Pest\Laravel\json;

class ChartsController extends Controller
{
    // protected $carsRepository;

    // public function __construct(CarsRepository $carsRepository)
    // {
    //     $this->carsRepository = $carsRepository;
    // }


    public function modelPerYear(Request $request){
        // return response()->json([
        //         "status"=>"error",
        //         "message"=>"Server Error: ",
        //         "data" => []
        //     ], 500);
        // Log::debug("GET/POST Request Data",$request->all());
        // $param = $request->all();
        // $brand = in_array("brand", array_keys($param)) ? $param["brand"]  : '';

        $query = Cars::select(CarsAttributeEnum::MODEL_YEAR->value, CarsAttributeEnum::ORIGIN->value, DB::raw('count(*) as count'))
            ->groupBy(CarsAttributeEnum::MODEL_YEAR->value, CarsAttributeEnum::ORIGIN->value)->orderBy(CarsAttributeEnum::MODEL_YEAR->value);


        // $brand = strtolower($brand);
        // if(!(is_null($brand) || $brand==="all")){
        //     $c = CarsAttributeEnum::NAME->value;
        //     Log::debug("Where Query Added", [$c, $brand]);
        //     $query = $query->whereRaw("LOWER($c) ILIKE ?", ["{$brand}%"]);
        // }

        $data = $query->get();
        return $data;
    }

    public function highLowAttributes(Request $request){
        $param = $request->all();
        $direction = in_array("order", array_keys($param)) ? $param["order"]  : "desc";

        $acceleration = Cars::select(CarsAttributeEnum::NAME->value, CarsAttributeEnum::ACCELERATION->value)
                            ->orderBy(CarsAttributeEnum::ACCELERATION->value, $direction)->limit(10)
                            ->whereNotNull(CarsAttributeEnum::ACCELERATION->value)->get();

        $power = Cars::select(CarsAttributeEnum::NAME->value, CarsAttributeEnum::HORSEPOWER->value)
                            ->orderBy(CarsAttributeEnum::HORSEPOWER->value, $direction)->limit(10)
                            ->whereNotNull(CarsAttributeEnum::HORSEPOWER->value)->get();

        $mileage = Cars::select(CarsAttributeEnum::NAME->value, CarsAttributeEnum::MPG->value)
                            ->orderBy(CarsAttributeEnum::MPG->value, $direction)->limit(10)
                            ->whereNotNull(CarsAttributeEnum::MPG->value)->get();

        $engine = Cars::select(CarsAttributeEnum::CYLINDERS->value, DB::raw('count(*) as count'))
                            ->groupBy(CarsAttributeEnum::CYLINDERS->value)
                            ->whereNotNull(CarsAttributeEnum::CYLINDERS->value)->get();

        return response()->json([
            'acceleration'=>$acceleration,
            'power' => $power,
            'mileage' => $mileage,
            'engine' => $engine
        ]);
    }

    // public function countModelCylinderPerYear(Request $request){
    //     $years = $this->carsRepository->listModelYears();
    //     return [
    //         "years" => $years
    //     ];
    // }
}
