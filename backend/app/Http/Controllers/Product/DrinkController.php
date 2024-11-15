<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Drink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Stmt\TryCatch;

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
                    'type.name AS typeDrink'
                    
                )
                ->where('status', true)
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

    public function selectDrinksCombo()
    {
        try {
            $comboDrinks = Drink::leftJoin('type_drinks AS type', 'type.id', '=', 'drinks.type_drinks_id')
                ->where('type_drinks_id', 1)
                ->select(
                    'drinks.id',
                    "drinks.name AS text",
                    "combo_price AS basePrice",
                    'type.name AS typeDrink'
                )
                ->where('status', true)
                ->get();
    
            if ($comboDrinks->toArray()) {
                return response()->json(['message' => 'Success', 'status' => 200, 'data' => $comboDrinks], 200);
    
            } else {
                return response()->json(['message' => 'No products found'], 404);
            }

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Internal error, contact administrator'], 500);

        }
    }
}
