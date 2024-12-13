<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanionOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'quantity',
        'price',
        'orders_id',
        'companions_id',
        'products_id'
    ];

    public function order() {
        return $this->belongsTo(Order::class, 'orders_id', 'id');
    }

    public function companion() {
        return $this->belognsTo(Companion::class, 'companions_id', 'id');
    }

    public function product() {
        return $this->belongsTo(Product::class, 'products_id', 'id');
    }
}
