<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Companion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompanionController extends Controller
{
    public function index()
    {
        try {
            $companions = Companion::where('status', true)
            ->select
                (
                    'id AS value',
                    DB::raw("CONCAT(name, ' --> $', ROUND(base_price, 0)) AS text"),
                    'base_price AS basePrice'
                )
            ->orderBy('name', 'ASC')
            ->get();
            
            if ($companions->toArray()) {
                return response()->json(['message' => 'Success', 'status' => 200, 'data' => $companions], 200);
    
            } else {
                return response()->json(['message' => 'No products found'], 404);
            }

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Internal error, contact administrator'], 500);

        }
    }

    public function selectCompanionsCombo()
    {
        try {
            $comboCompanions = Companion::where('status', true)
            ->select
                (
                    'id AS value',
                    DB::raw("CONCAT(name, ', cambiar por --> $', ROUND(combo_price, 0)) AS text"),
                    'combo_price'
                )
            ->orderBy('name', 'ASC')
            ->get();
            
            if ($comboCompanions->toArray()) {
                return response()->json(['message' => 'Success', 'status' => 200, 'data' => $comboCompanions], 200);
    
            } else {
                return response()->json(['message' => 'No products found'], 404);
            }

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Internal error, contact administrator'], 500);

        }
    }

}
