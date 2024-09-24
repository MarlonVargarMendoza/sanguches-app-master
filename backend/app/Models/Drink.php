<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Drink extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'basePrice',
        'image',
        'type_drinks_id'
    ];

    public function typeDrink () {
        return $this->belongsTo( TypeDrink::class, 'type_drinks_id', 'id' );
    }

}
