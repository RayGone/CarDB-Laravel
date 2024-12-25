<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;

use App\Repositories\CarsRepository;
use Exception;
use RuntimeException;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CarsExport;

class CarsController extends Controller
{
    protected $carsRepository;
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Cars $cars)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cars $cars)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cars $cars)
    {
        //
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
}
