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
        return $combo = Combo::select('id', 'name', 'price', 'image', 'drinks_id', 'companions_id')
            ->where('status', true)
            ->get();
    }
}
