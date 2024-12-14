<?php
namespace App\Enums;

use UnexpectedValueException;

enum CarsAttributeEnum: string{
    case ID = "id";
    case NAME = "name";
    case ORIGIN = "origin";
    case MODEL_YEAR = "model_year";
    case ACCELERATION = "acceleration";
    case HORSEPOWER = "horsepower";
    case MPG = "mpg";
    case WEIGHT = "weight";
    case CYLINDERS = "cylinders";
    case DISPLACEMENT = "displacement";



    // public static function mapFrom($attr){
    //     switch($attr){
    //         case 'id':
    //             return CarsAttributeEnum::ID;
    //         case 'name':
    //             return CarsAttributeEnum::NAME;
    //         case 'origin':
    //             return CarsAttributeEnum::ORIGIN;
    //         case 'model_year':
    //             return CarsAttributeEnum::MODEL_YEAR;
    //         case 'acceleration':
    //             return CarsAttributeEnum::ACCELERATION;
    //         case 'horsepower':
    //             return CarsAttributeEnum::HORSEPOWER;
    //         case 'mpg':
    //             return CarsAttributeEnum::MPG;
    //         case 'weight':
    //             return CarsAttributeEnum::WEIGHT;
    //         case 'cylinders':
    //             return CarsAttributeEnum::CYLINDERS;
    //         case 'displacement':
    //             return CarsAttributeEnum::DISPLACEMENT;
    //         default:
    //             throw new UnexpectedValueException($attr);
    //     }
    // }
}

?>
