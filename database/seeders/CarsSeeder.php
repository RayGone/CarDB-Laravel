<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CarsSeeder extends Seeder
{
    public function run()
    {
        // $file = file_get_contents(__DIR__."/../../data.json");
        $file = file_get_contents(base_path(env('DEMO_DATA_JSON_PATH', '/')));
        $json = json_decode($file);

        foreach($json as $car){
            $entry = array_merge((array) $car, [
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            DB::table('cars')->insert($entry);
        }

        // Add more default data as needed
    }
}

?>
