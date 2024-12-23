<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('combo_orders', function (Blueprint $table) {
            $table->id();
            $table->integer('quantity');
            $table->float('price', 10, 2);
            $table->foreignId('orders_id')->constrained()->onDelete('cascade');
            $table->foreignId('combos_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('combo_orders');
    }
};
