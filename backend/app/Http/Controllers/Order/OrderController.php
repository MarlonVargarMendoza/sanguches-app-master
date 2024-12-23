<?php

namespace App\Http\Controllers\Order;

use App\Factories\OrderFactory;
use App\Http\Controllers\Controller;
use App\Http\Requests\OrderStoreRequest;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    private $orderFactory;

    public function __construct(OrderFactory $orderFactory)
    {
        $this->orderFactory = $orderFactory;
    }

    public function index()
    {
        return Order::get();
    }

    public function store(OrderStoreRequest $request)
    {
        $validateData = $request->validated();
        $allData = $request->toArray();
        
        $result = $this->orderFactory->createOrder($allData, $validateData);
        
        if ($result) {
            return response()->json(['status' => 200, 'message' => 'Success', 'data' => $result], 200);

        } else {
            return response()->json(['status' => 500, 'message' => 'Internal error, contact administrator'], 500);
        }
    }
}
