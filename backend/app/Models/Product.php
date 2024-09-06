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
        'type_sandwiches_id'
    ];

    public function typeSandwiche () {
        return $this->belongsTo( TypeSandwiche::class, 'type_sandwiches_id', 'id');
    }

    public function typeProduct () {
        return $this->belongsTo( TypeProduct::class, 'type_sandwiches_id', 'id' );
    }

}
