<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'basePrice',
        'image',
        'type_sandwiches_id',
        'type_products_id',
        'description'
    ];

    public function typeSandwiche ()
    {
        return $this->belongsTo( TypeSandwiche::class, 'type_sandwiches_id', 'id');
    }

    public function typeProduct ()
    {
        return $this->belongsTo( TypeProduct::class, 'type_products_id', 'id' );
    }

    public function sauces()
    {
        return $this->belongsToMany(Sauce::class, 'product_sauces', 'products_id', 'sauces_id');
    }

    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'sandwiche_ingredients', 'products_id', 'ingredients_id');
    }

}
