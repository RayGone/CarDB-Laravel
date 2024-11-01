<?php

namespace App\Http\Controllers;

use App\Repositories\CarsRepository;
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
    public function index()
    {
        //
        $cars = $this->carsRepository->query();
        return response()->json($cars);
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
