<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSauce extends Model
{
    use HasFactory;

    protected $fillable = [
        'products_id',
        'sauces_id'
    ];

    protected function product () {
        return $this->belongsTo( Product::class,  'products_id', 'id' );
    }

    protected function sauce () {
        return $this->belongsTo( Sauce::class, 'sauces_id', 'id' );
    }
}
