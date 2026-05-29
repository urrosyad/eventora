<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sponsorship_applications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_id')
                ->constrained('events')
                ->restrictOnDelete();

            $table->foreignId('company_id')
                ->constrained('companies')
                ->cascadeOnDelete();

            $table->foreignId('organization_id')
                ->constrained('organizations')
                ->cascadeOnDelete();

            $table->string('support_type_requested', 100);
            $table->text('cover_letter');
            $table->text('additional_message')->nullable();
            $table->text('response_message')->nullable();

            $table->enum('status', [
                'pending',
                'reviewed',
                'accepted',
                'rejected',
                'cancelled'
            ])->default('pending');

            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('decided_at')->nullable();
            $table->timestamps();

            $table->unique(['event_id', 'company_id'], 'uq_event_company');

            $table->index(['company_id', 'status'], 'idx_sponsorship_company_status');
            $table->index(['organization_id', 'status'], 'idx_sponsorship_org_status');
            $table->index(['event_id', 'status'], 'idx_sponsorship_event_status');
            $table->index(['status', 'created_at'], 'idx_sponsorship_status_created');
            $table->index('reviewed_at');
            $table->index('decided_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sponsorship_applications');
    }
};
