<?php

namespace App\Http\Controllers;

use App\Enums\CarsAttributeEnum;
use App\Models\Cars;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChartsController extends Controller
{
    // protected $carsRepository;

    // public function __construct(CarsRepository $carsRepository)
    // {
    //     $this->carsRepository = $carsRepository;
    // }

    public function modelPerYear(Request $request)
    {
        // return response()->json([
        //         "status"=>"error",
        //         "message"=>"Server Error: ",
        //         "data" => []
        //     ], 500);
        // Log::debug("GET/POST Request Data",$request->all());
        // $param = $request->all();
        // $brand = in_array("brand", array_keys($param)) ? $param["brand"]  : '';

        try{
            $data = Cache::remember("charts:modelperyear", 86400, fn() => Cars::select(CarsAttributeEnum::MODEL_YEAR->value, CarsAttributeEnum::ORIGIN->value, DB::raw('count(*) as count'))
                ->groupBy(CarsAttributeEnum::MODEL_YEAR->value, CarsAttributeEnum::ORIGIN->value)->orderBy(CarsAttributeEnum::MODEL_YEAR->value)->get());
        }catch(\Exception $e){
            Log::debug($e->getMessage());
            $data =  Cars::select(CarsAttributeEnum::MODEL_YEAR->value, CarsAttributeEnum::ORIGIN->value, DB::raw('count(*) as count'))
                ->groupBy(CarsAttributeEnum::MODEL_YEAR->value, CarsAttributeEnum::ORIGIN->value)->orderBy(CarsAttributeEnum::MODEL_YEAR->value)->get();
        }
        // $brand = strtolower($brand);
        // if(!(is_null($brand) || $brand==="all")){
        //     $c = CarsAttributeEnum::NAME->value;
        //     Log::debug("Where Query Added", [$c, $brand]);
        //     $query = $query->whereRaw("LOWER($c) ILIKE ?", ["{$brand}%"]);
        // }

        return $data;
    }

    public function highLowAttributes(Request $request)
    {
        $param = $request->all();
        $direction = in_array('order', array_keys($param)) ? $param['order'] : 'desc';

        try{
            $data = Cache::remember("charts:attributes:{$direction}", 86400, fn() => [
                'acceleration' => Cars::select(CarsAttributeEnum::NAME->value, CarsAttributeEnum::ACCELERATION->value)
                                        ->orderBy(CarsAttributeEnum::ACCELERATION->value, $direction)->limit(15)
                                        ->whereNotNull(CarsAttributeEnum::ACCELERATION->value)->get(),
                'power' => Cars::select(CarsAttributeEnum::NAME->value, CarsAttributeEnum::HORSEPOWER->value)
                                    ->orderBy(CarsAttributeEnum::HORSEPOWER->value, $direction)->limit(15)
                                    ->whereNotNull(CarsAttributeEnum::HORSEPOWER->value)->get(),
                'mileage' => Cars::select(CarsAttributeEnum::NAME->value, CarsAttributeEnum::MPG->value)
                                    ->orderBy(CarsAttributeEnum::MPG->value, $direction)->limit(15)
                                    ->whereNotNull(CarsAttributeEnum::MPG->value)->get(),
                'engine' => Cars::select(CarsAttributeEnum::CYLINDERS->value, DB::raw('count(*) as count'))
                                    ->groupBy(CarsAttributeEnum::CYLINDERS->value)
                                    ->whereNotNull(CarsAttributeEnum::CYLINDERS->value)->get(),
            ]);
        }catch(\Exception $e){
            Log::debug($e->getMessage());

            $data = [
                'acceleration' => Cars::select(CarsAttributeEnum::NAME->value, CarsAttributeEnum::ACCELERATION->value)
                                        ->orderBy(CarsAttributeEnum::ACCELERATION->value, $direction)->limit(15)
                                        ->whereNotNull(CarsAttributeEnum::ACCELERATION->value)->get(),
                'power' => Cars::select(CarsAttributeEnum::NAME->value, CarsAttributeEnum::HORSEPOWER->value)
                                    ->orderBy(CarsAttributeEnum::HORSEPOWER->value, $direction)->limit(15)
                                    ->whereNotNull(CarsAttributeEnum::HORSEPOWER->value)->get(),
                'mileage' => Cars::select(CarsAttributeEnum::NAME->value, CarsAttributeEnum::MPG->value)
                                    ->orderBy(CarsAttributeEnum::MPG->value, $direction)->limit(15)
                                    ->whereNotNull(CarsAttributeEnum::MPG->value)->get(),
                'engine' => Cars::select(CarsAttributeEnum::CYLINDERS->value, DB::raw('count(*) as count'))
                                    ->groupBy(CarsAttributeEnum::CYLINDERS->value)
                                    ->whereNotNull(CarsAttributeEnum::CYLINDERS->value)->get(),
            ];
        }

        return response()->json($data);
    }

    // public function countModelCylinderPerYear(Request $request){
    //     $years = $this->carsRepository->listModelYears();
    //     return [
    //         "years" => $years
    //     ];
    // }
}
