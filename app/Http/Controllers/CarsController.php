<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;

use App\Repositories\CarsRepository;
use Exception;
use RuntimeException;
use Illuminate\Http\Request;
use App\Exports\CarsExport;

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
            $export = new CarsExport();
            if($type == "csv"){
                $content = $export->toCsv();
                $content_type = "text/csv";
                return response()->streamDownload(function () use ($content) {
                    echo $content;
                }, $fname, ['Content-Type'=>$content_type]);
                // return Excel::download(new CarsExport, $fname);
            }else{
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
}
