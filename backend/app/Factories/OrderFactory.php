<?php

namespace App\Factories;

use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class OrderFactory {

    public function createOrder(array $allData, array $order)
    {
        try {
            DB::beginTransaction();

            $createdOrder = Order::create($order);

            DB::commit();
            return $createdOrder;

        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Error "createOrder": ' . $th->getMessage());
            return false;
        }
    }

}
