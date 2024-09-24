<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductService
{

    public function getSandwichsHome ()
    {
        try {
            $sandwichs = Product::with('sauces')
            ->with('ingredients')
            ->where('type_products_id', 7)
            ->select('id', 'image', 'name', 'description', 'basePrice')
            ->orderBy('name', 'ASC')
            ->get();

            foreach ($sandwichs as $sandwich) {
                $sandwich->sauces->makeHidden(['pivot']);
                $sandwich->sauces->makeHidden(['addition']);
                $sandwich->sauces->makeHidden(['price']);
                $sandwich->ingredients->makeHidden(['price']);
                $sandwich->ingredients->makeHidden(['type_ingredients_id']);
                $sandwich->ingredients->makeHidden(['addition']);
                $sandwich->ingredients->makeHidden(['pivot']);
            }

            if ($sandwichs->toArray()) {
                return ['status' => 200, 'data' => $sandwichs];
            } else {
                return ['status' => 404, 'message' => 'No products found'];
                // Error 401 usuario invalido
            }

        } catch (\Throwable $th) {
            return ['status' => 500, 'message' => 'Internal error, contact administrator'];
        }
    }

    public function getProductType (string $id)
    {
        $products = '';

        try {
            if ($id == 13 || $id == 14) {
                $products = Product::where('type_products_id', $id)
                    ->select
                    (
                        'id AS value',
                        DB::raw("CONCAT(name, ' --> $', ROUND(basePrice, 0)) AS text"),
                        'basePrice'
                    )
                    ->orderBy('name', 'ASC')
                    ->get();

            } elseif ($id == 7 || $id == 8 || $id == 9 || $id == 10 || $id == 11 || $id == 12) {
                $products = Product::with('sauces')
                ->with('ingredients')
                ->where('type_products_id', $id)
                ->select('id', 'image', 'name', 'description', 'basePrice')
                ->orderBy('name', 'ASC')
                ->get();
    
                foreach ($products as $product) {
                    $product->sauces->makeHidden(['pivot']);
                    $product->sauces->makeHidden(['addition']);
                    $product->sauces->makeHidden(['price']);
                    $product->ingredients->makeHidden(['price']);
                    $product->ingredients->makeHidden(['type_ingredients_id']);
                    $product->ingredients->makeHidden(['addition']);
                    $product->ingredients->makeHidden(['pivot']);
                }

            } else {
                return ['status' => 400, 'message' => 'Invalid product type'];
            }

            if ($products->toArray()) {
                return ['status' => 200, 'data' => $products];

            } else {
                return ['status' => 404, 'message' => 'No products found'];
            }

        } catch (\Throwable $th) {
            return ['status' => 500, 'message' => 'Internal error, contact administrator'];
        }
    }
}
