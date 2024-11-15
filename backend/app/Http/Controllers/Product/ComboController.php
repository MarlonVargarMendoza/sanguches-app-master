<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Combo;
use Illuminate\Http\Request;

class ComboController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $combo = Combo::with(['product' => function ($query) {
            $query->where('status', true)
            ->select('id', 'name')

                ->with(['ingredients' => function ($query) {
                    $query->where('status', true)
                        ->select('ingredients.id', 'ingredients.name');
                }]);
        }])
        ->with(['drink' => function ($query) {
            $query->where('status', true)
            ->select('id', 'name');
        }])
        ->with(['companion' => function ($query) {
            $query->where('status', true)
            ->select('id', 'name');
        }])
        ->select('id', 'name', 'price', 'image', 'drinks_id', 'companions_id', 'products_id')
        ->where('status', true)
        ->get();

        foreach ($combo as $product) {
            $ingredientsGrouped = $product->product->ingredients->groupBy('name')->map(function ($group) {
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
            $product->makeHidden(['product', 'products_id', 'companions_id', 'drinks_id']);
        }
        return $combo;

    }
}

