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
        Schema::create('combos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->float('price', 10, 2);
            $table->string('description')->nullable();
            $table->boolean('status')->default(true);
            $table->foreignId('products_id')->constrained()->onDelete('cascade');
            $table->foreignId('drinks_id')->constrained()->onDelete('cascade');
            $table->foreignId('companions_id')->constrained()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('combos');
    }
};
