<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pitching_sessions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sponsorship_application_id')
                ->unique()
                ->constrained('sponsorship_applications')
                ->cascadeOnDelete();

            $table->enum('type', ['online', 'offline']);
            $table->string('meet_link')->nullable();
            $table->text('location')->nullable();
            $table->dateTime('scheduled_at');
            $table->text('notes')->nullable();

            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->index('type');
            $table->index('scheduled_at');
            $table->index('created_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pitching_sessions');
    }
};
