<?php

use App\Models\User;
use App\Providers\RouteServiceProvider;
use App\Repositories\CarsRepository;
use App\Dtos\FilterModel;

// test("Test Add Cars", function(){
//     $user = User::factory()->create();
//     $token = $user->createToken("test token")->plainTextToken;

//     $response = $this
//         ->withHeaders([
//             "Authorization" => "Bearer $token",
//             "Accept" => "application/json"
//         ])
//         ->postJson('/api/cars',[
//             "name"=>"Test Car 101",
//             "origin"=>"NPL",
//             "model_year"=>"25"
//         ]);

//     dump($response);

//     $response->assertOk()
//                 ->assertJson(["status"=>"success"])
//                 ->assertJsonStructure(["status", "data"]);
// });

test("Test Fetch Cars with GET", function(){
    $user = User::factory()->create();
    $token = $user->createToken("test token")->plainTextToken;

    $response = $this
        ->withHeaders([
            "Authorization" => "Bearer $token",
            "Accept" => "application/json"
        ])
        ->getJson('/api/cars');

    $response->assertOk()
                ->assertJson(["status"=>"success"])
                ->assertJsonStructure(["status", "data"]);
});

test("Test Fetch Cars With POST", function(){
    $user = User::factory()->create();
    $token = $user->createToken("test token")->plainTextToken;

    $post = [
        "limit"=>50
    ];

    $response = $this
        ->withHeaders([
            "Authorization" => "Bearer $token",
            'Content-Type' => 'application/json',
        ])
        ->postJson('/api/cars/filterSearch',$post);

    $response->assertOk()
        ->assertJson(["status"=>"success"])
        ->assertJsonStructure(["status", "data"]);
});
