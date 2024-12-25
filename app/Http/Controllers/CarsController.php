<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;

use App\Repositories\CarsRepository;
use Exception;
use Illuminate\Http\Request;

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
}
