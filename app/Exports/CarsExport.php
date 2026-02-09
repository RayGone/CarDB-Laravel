<?php

namespace App\Exports;

use App\Models\Cars;

class CarsExport
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Cars::all();
    }

    public function headings(): array
    {
        return [
            "ID", "Name", "Origin", "Model Year", "Acceleration", "Horsepower", "MPG", "Weight", "Cylinders", "Displacement"
        ];
    }

    public function map($cars): array
    {
        return [
            $cars->id,
            strtoupper($cars->name), // Example: Convert name to uppercase
            strtoupper($cars->origin),
            $cars->model_year,
            $cars->acceleration,
            $cars->horsepower,
            $cars->mpg,
            $cars->weight,
            $cars->cylinders,
            $cars->displacement
        ];
    }

    public function toCsv(){
        $cars = $this->collection();

        $csv = join(",", $this->headings());
        foreach($cars as $car){
            $csv .= "\r\n".join(",", $this->map($car));
        }
        return $csv;
    }

    public function toJson(){
        return $this->collection()->toJson();
    }
}
