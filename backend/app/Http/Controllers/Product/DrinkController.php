<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Drink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DrinkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $result = Drink::leftJoin('type_drinks AS type', 'type.id', '=', 'drinks.type_drinks_id')
                ->select('drinks.id', 'drinks.name', 'drinks.basePrice', 'drinks.image', 'type.name AS type_drink')
                ->orderBy('type.name', 'DESC')->get();

            if ($result->toArray()) {
                return response()->json(['message' => 'Success', 'status' => 200, 'data' => $result], 200);
    
            } elseif ($result['status'] == 404) {
                return response()->json(['message' => 'No products found'], 404);
            }

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Internal error, contact administrator'], 500);
        }
    }

    public function selectDrinks()
    {
        try {
            $result = Drink::leftJoin('type_drinks AS type', 'type.id', '=', 'drinks.type_drinks_id')
                ->select
                (
                    'drinks.id',
                    DB::raw("CONCAT(drinks.name, ' --> $', ROUND(drinks.basePrice, 0)) AS text"),
                    'basePrice',
                    'type.name'
                    
                )
                //->whereNot('type_drinks_id', 4)
                ->orderBy('type.name', 'ASC')->get();

            if ($result->toArray()) {
                return response()->json(['message' => 'Success', 'status' => 200, 'data' => $result], 200);
    
            } elseif ($result['status'] == 404) {
                return response()->json(['message' => 'No products found'], 404);
            }

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Internal error, contact administrator'], 500);
        }
    }
}
