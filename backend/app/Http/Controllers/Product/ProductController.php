<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Services\ProductService;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Stmt\TryCatch;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService) {
        $this->productService = $productService;
    }

    public function index()
    {
        $result = $this->productService->getSandwichsHome();

        if ($result['status'] == 200) {
            return response()->json(['message' => 'Success', 'data' => $result['data']], 200);

        } elseif ($result['status'] == 404) {
            return response()->json(['message' => $result['message']], 404);

         } else {
            return response()->json(['message' => $result['message']], 500);
        }
    }

    public function show(string $id)
    {
        $result = $this->productService->getProductType($id);

        if ($result['status'] == 200) {
            return response()->json(['message' => 'Success', 'data' => $result['data']], 200);

        } elseif ($result['status'] == 400) {
            return response()->json(['message' => $result['message']], 400);

        } elseif ($result['status'] == 404) {
            return response()->json(['message' => $result['message']], 404);

         } else {
            return response()->json(['message' => $result['message']], 500);
        }
    }

    public function addition()
    {
        try {
            $result = Ingredient::select(
                'id',
                DB::raw("CONCAT(name, ' --> $', ROUND(price, 0)) AS text"),
                'price'
            )->whereNot('addition', 0)->orderBy('name')->get();

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
