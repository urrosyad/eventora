<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title', 200);
            $table->text('message');
            $table->string('type', 50);
            $table->unsignedBigInteger('related_id')->nullable();
            $table->string('related_type', 50)->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('created_at')->nullable();

            $table->index(['user_id', 'is_read'], 'idx_notifications_user_read');
            $table->index('type');
            $table->index(['related_type', 'related_id'], 'idx_notifications_related');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
