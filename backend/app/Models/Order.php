<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'personal_id',
        'total_price'
    ];

    public function product()
    {
        return $this->belongsToMany(Product::class, 'product_orders', 'orders_id', 'products_id');
    }

    public function ingredient()
    {
        return $this->belongsToMany(Ingredient::class, 'ingredient_orders', 'orders_id', 'ingredients_id');
    }

    public function drink()
    {
        return $this->belongsToMany(Drink::class, 'drink_orders', 'orders_id', 'drinks_id');
    }

    public function combo()
    {
        return $this->belongsToMany(Product::class, 'combo_orders', 'orders_id', 'combos_id');
    }
    
    //mutadores
    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->setTimezone('America/Bogota')->toDateTimeString();
    }

    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->setTimezone('America/Bogota')->toDateTimeString();
    }
}
