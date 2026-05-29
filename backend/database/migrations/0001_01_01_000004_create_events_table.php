<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->string('name', 200);
            $table->text('description');
            $table->string('target_audience', 200);
            $table->unsignedInteger('participant_count');
            $table->string('province', 100);
            $table->string('city', 100);
            $table->date('event_date');
            $table->string('category', 100);
            $table->json('support_types_needed');
            $table->string('budget_range', 50);
            $table->string('proposal_path')->nullable();
            $table->enum('status', ['draft', 'active', 'archived', 'hidden', 'removed'])->default('draft');
            $table->timestamps();

            $table->index(['organization_id', 'status']);
            $table->index('category');
            $table->index(['province', 'city']);
            $table->index('event_date');
            $table->index('budget_range');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
