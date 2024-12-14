<?php
namespace App\Enums;

use UnexpectedValueException;

enum SortOrderEnum: string{
    case ASC = "asc";
    case DESC = "desc";

    // public static function mapFrom($order){
    //     switch($order){
    //         case 'asc':
    //             return SortOrderEnum::ASC;
    //         case 'desc':
    //             return SortOrderEnum::DESC;
    //         default:
    //             throw new UnexpectedValueException($order);
    //     }
    // }
}
?>
