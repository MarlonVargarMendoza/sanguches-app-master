<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Sauce;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;

class SauceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $sauces = Sauce::select('id', 'name AS text')->get();

            if ($sauces->toArray()) {
                return response([ 'message' => 'Success', 'status' => 200, 'data' => $sauces ], 200);
            } else {
                return response([ 'message' => 'No products found', 'status' => 404], 404);
            }

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Internal error, contact administrator'], 500);
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
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
