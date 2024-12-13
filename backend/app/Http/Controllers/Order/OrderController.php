<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderStoreRequest;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(OrderStoreRequest $request)
    {
        $validateData = $request->validated();

        try {
            dd('Data Request', $request->toArray());

        } catch (\Throwable $th) {
            return response()->json(['status' => 500, 'message' => 'Internal error, contact administrator'], 500);
        }
    }
}
