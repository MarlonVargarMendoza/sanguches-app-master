<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Combo extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'image',
        'description',
        'status',
        'products_id',
        'drinks_id',
        'companions_id'
    ];

    public function product ()
    {
        return $this->belongsTo( Product::class, 'products_id', 'id');
    }

    public function drink ()
    {
        return $this->belongsTo( Drink::class, 'drinks_id', 'id' );
    }

    public function companion ()
    {
        return $this->belongsTo( Companion::class, 'companions_id', 'id' );
    }

}
