<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $token = "";
        if($user){
            $user = User::find($request->user()['id']);
            $user->tokens()->delete();
            $token = $user->createToken('Access Token')->plainTextToken;
        }
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'apiToken' => $token
            ],
        ];
    }
}
