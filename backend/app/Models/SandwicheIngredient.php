<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SandwicheIngredient extends Model
{
    use HasFactory;

    protected $fillable = [
        'products_id',
        'ingredients_id'
    ];

    protected function product () {
        return $this->belongsTo( Product::class, 'products_id', 'id' );
    }

    protected function ingredient () {
        return $this->belongsTo( Ingredient::class, 'ingredients_id', 'id' );
    }

}
