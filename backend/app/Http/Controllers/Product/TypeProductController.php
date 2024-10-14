<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\TypeProduct;
use Illuminate\Http\Request;

class TypeProductController extends Controller
{

    public function index()
    {
        try {
            $result = TypeProduct::whereNotIn('id', [13, 14])->get();

            if ($result->toArray()) {
                return response()->json(['status' => '200', 'message' => 'Success', 'data' => $result], 200);

            } else {
                return response()->json(['status' => '404', 'message' => 'No products found', 404]);
                
            }
        } catch (\Throwable $th) {
            return response()->json(
                ['status' => '500', 'message' => 'Internal error, contact administrator'], 500);

        }
    }
}
