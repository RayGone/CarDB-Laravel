<?php

namespace App\Repositories;

use App\Models\Cars;

class CarsRepository{
    public function __construct(){}

    public function query(){
        return Cars::all();
    }
}
?>
