<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductService
{

    public function getSandwichsHome ()
    {
        try {
            $sandwichs = Product::with(['ingredients' => function ($query) {
                $query->where('status', true)
                ->select('ingredients.id', 'name');
            }])
            ->whereIn('type_products_id', [7, 8])
            ->where('status', true)
            ->select('id', 'image', 'name', 'description', 'basePrice')
            ->orderBy('name', 'ASC')
            ->get();

            foreach ($sandwichs as $product) {
                $ingredientsGrouped = $product->ingredients->groupBy('name')->map(function ($group) {
                    $ingredient = $group->first();
                    $ingredient->amount = $group->count();

                    if ($ingredient->amount > 1) {
                        $ingredient->name = "{$ingredient->name} x{$ingredient->amount}";
                    }

                    $ingredient->makeHidden(['pivot', 'amount']);
                    return $ingredient;
                })->values();

                $product->ingredients = $ingredientsGrouped;
                $product->setRelation('ingredients', $ingredientsGrouped);
            }

            if ($sandwichs->toArray()) {
                return ['status' => 200, 'data' => $sandwichs];
            } else {
                return ['status' => 404, 'message' => 'No products found'];
                // Error 401 usuario invalido
            }

        } catch (\Throwable $th) {
            return ['status' => 500, 'message' => $th];
        }
    }

    public function getProductType (string $id)
    {
        $products = '';

        try {
            if ($id == 13 || $id == 14) {
                $products = Product::where('type_products_id', $id)->where('status', true)
                    ->select
                    (
                        'id AS value',
                        DB::raw("CONCAT(name, ' --> $', ROUND(basePrice, 0)) AS text"),
                        'basePrice'
                    )
                    ->orderBy('name', 'ASC')
                    ->get();

            } elseif ($id == 7 || $id == 8 || $id == 9 || $id == 10 || $id == 11 || $id == 12) {
                $products = Product::with(['ingredients' => function ($query) {
                    $query->where('status', true)
                    ->select('ingredients.id', 'name');
                }])
                ->where('type_products_id', $id)
                ->where('status', true)
                ->select('id', 'image', 'name', 'description', 'basePrice')
                ->orderBy('name', 'ASC')
                ->get();
            
            foreach ($products as $product) {
                $ingredientsGrouped = $product->ingredients->groupBy('name')->map(function ($group) {
                    $ingredient = $group->first();
                    $ingredient->count = $group->count();

                    if ($ingredient->count > 1) {
                        $ingredient->name = "{$ingredient->name} x{$ingredient->count}";
                    }

                    $ingredient->makeHidden(['pivot', 'count']);
                    return $ingredient;
                })->values();

                $product->ingredients = $ingredientsGrouped;
                $product->setRelation('ingredients', $ingredientsGrouped);
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
