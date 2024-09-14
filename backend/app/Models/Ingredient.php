<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'type_ingredients_id'
    ];

    public function typeIngredient () {
        return $this->belongsTo(TypeIngredient::class, 'type_ingredients_id', 'id');
    }

}
