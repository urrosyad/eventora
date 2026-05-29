<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookmarks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->timestamp('created_at')->nullable();

            $table->unique(['organization_id', 'company_id'], 'uq_org_company');
            $table->index('organization_id');
            $table->index('company_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookmarks');
    }
};
