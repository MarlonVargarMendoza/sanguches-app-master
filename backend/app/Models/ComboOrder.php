<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComboOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'quantity',
        'price',
        'orders_id',
        'combos_id'
    ];

    public function order() {
        return $this->belongsTo(Order::class, 'orders_id', 'id');
    }

    public function combo() {
        return $this->belognsTo(Combo::class, 'combos_id', 'id');
    }
}
