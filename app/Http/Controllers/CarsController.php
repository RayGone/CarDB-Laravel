<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;

use App\Repositories\CarsRepository;
use Exception;
use RuntimeException;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CarsExport;
use App\Enums\CarsAttributeEnum;
use App\Models\Cars;
use Illuminate\Support\Facades\DB;

class CarsController extends Controller
{
    protected $carsRepository;
    protected $rule = [
        'id' => 'nullable|numeric|min:0',
        'name' => 'required|string|max:255',
        'origin' => 'required|string|max:255',
        'model_year' => 'required|date|before_or_equal:today',
        'acceleration' => 'nullable|numeric|min:0',
        'horsepower' => 'nullable|numeric|min:0',
        'mpg' => 'nullable|numeric|min:0',
        'weight' => 'nullable|numeric|min:0',
        'cylinders' => 'nullable|numeric|min:0',
        'displacement' => 'nullable|numeric|min:0',
    ];

    public function __construct(CarsRepository $carsRepository)
    {
        $this->carsRepository = $carsRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try{
            $query = $request->all();
            $cars = $this->carsRepository->query($query);
            return response()->json([
                "status"=>"success",
                "data"=>$cars
            ], 200);
        } catch(Exception $e){
            return response()->json([
                "status"=>"error",
                "message"=>"Server Error: ".$e->getMessage(),
                "data" => []
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate($this->rule);
        $car = $this->carsRepository->addCar($validated);

        return response()->json([
            "status"=>"success",
            "created"=> $car]);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $car = $this->carsRepository->queryOne($id);
        if($car)
            return response()->json([
                "status" => "success",
                "data" => $car
            ], 200);
        else
            return response()->json([
                "status" => "not-found",
                "data" => $car
            ], 404);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(int $id, Request $request)
    {
        $validated = $request->validate($this->rule);

        if($id != $validated['id']){
            throw new RuntimeException("Car doesn't Exist.");
        }

        $car = $this->carsRepository->editCar($validated, $id);

        return response()->json([
            "status"=>"success",
            "edited"=> $car]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id, Request $request)
    {
        $validated = $request->validate($this->rule);

        $car = $this->carsRepository->deleteCar($validated, $id);

        return response()->json(["deleted"=>$car, "status"=>"success"]);

    }

    /**
     * Download all as file
     */
    public function download(string $type){
        $accept = ['csv', 'json'];
        $fname = "cars.".$type;
        if(in_array($type, $accept)){
            if($type == "csv"){
                return Excel::download(new CarsExport, $fname);
            }else{
                $export = new CarsExport();
                $content = $export->toJson();
                $content_type = "application/json";
                return response()->streamDownload(function () use ($content) {
                    echo $content;
                }, $fname, ['Content-Type'=>$content_type]);
            }

        }else{
            throw new RuntimeException("Unrecognized / Unacceptable File Type!!");
        }
    }


    public function modelPerYear(Request $request){
        // Log::debug("GET/POST Request Data",$request->all());
        $param = $request->all();
        $brand = in_array("brand", array_keys($param)) ? $param["brand"]  : '';

        $query = Cars::select(CarsAttributeEnum::MODEL_YEAR->value, CarsAttributeEnum::ORIGIN->value, DB::raw('count(*) as count'))
            ->groupBy(CarsAttributeEnum::MODEL_YEAR->value, CarsAttributeEnum::ORIGIN->value)->orderBy(CarsAttributeEnum::MODEL_YEAR->value);


        $brand = strtolower($brand);
        if(!(is_null($brand) || $brand==="all")){
            $c = CarsAttributeEnum::NAME->value;
            Log::debug("Where Query Added", [$c, $brand]);
            $query = $query->whereRaw("LOWER($c) ILIKE ?", ["{$brand}%"]);
        }

        $data = $query->get();
        return $data;
    }

    public function countModelCylinderPerYear(Request $request){
        $years = $this->carsRepository->listModelYears();
        return [
            "years" => $years
        ];
    }
}
