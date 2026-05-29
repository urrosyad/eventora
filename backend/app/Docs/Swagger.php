<?php

namespace App\Docs;

use OpenApi\Attributes as OA;

class Swagger
{
    #[OA\Post(
        path: "/v1/auth/register",
        summary: "Daftar akun baru",
        tags: ["Authentication"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["email", "password", "role"],
                properties: [
                    new OA\Property(property: "email", type: "string", example: "user@example.com"),
                    new OA\Property(property: "password", type: "string", example: "password123"),
                    new OA\Property(property: "role", type: "string", example: "organisasi")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Registrasi berhasil"),
            new OA\Response(response: 422, description: "Validasi gagal")
        ]
    )]
    public function register() {}

    #[OA\Post(
        path: "/v1/auth/login",
        summary: "Login pengguna",
        tags: ["Authentication"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["email", "password"],
                properties: [
                    new OA\Property(property: "email", type: "string", example: "organisasi@eventora.com"),
                    new OA\Property(property: "password", type: "string", example: "password123")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Login berhasil"),
            new OA\Response(response: 401, description: "Kredensial salah")
        ]
    )]
    public function login() {}

    #[OA\Post(
        path: "/v1/auth/logout",
        summary: "Logout pengguna",
        tags: ["Authentication"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Logout berhasil")
        ]
    )]
    public function logout() {}

    #[OA\Get(
        path: "/v1/auth/me",
        summary: "Detail profil saya",
        tags: ["Authentication"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function me() {}

    #[OA\Get(
        path: "/v1/organizations",
        summary: "List semua organisasi (Admin Only)",
        tags: ["Organizations"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function orgIndex() {}

    #[OA\Get(
        path: "/v1/organizations/{id}",
        summary: "Detail organisasi",
        tags: ["Organizations"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function orgShow() {}

    #[OA\Put(
        path: "/v1/organizations/{id}",
        summary: "Update profil organisasi (Own Only)",
        tags: ["Organizations"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "application/x-www-form-urlencoded",
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(property: "name", type: "string"),
                        new OA\Property(property: "description", type: "string"),
                        new OA\Property(property: "category", type: "string"),
                        new OA\Property(property: "province", type: "string"),
                        new OA\Property(property: "city", type: "string"),
                        new OA\Property(property: "address", type: "string"),
                        new OA\Property(property: "email", type: "string"),
                        new OA\Property(property: "phone", type: "string"),
                        new OA\Property(property: "logo", type: "string", format: "binary")
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Profil diperbarui")
        ]
    )]
    public function orgUpdate() {}

    #[OA\Get(
        path: "/v1/organizations/{id}/stats",
        summary: "Statistik sponsorship organisasi",
        tags: ["Organizations"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function orgStats() {}

    #[OA\Get(
        path: "/v1/companies",
        summary: "List perusahaan (Org/Admin)",
        tags: ["Companies"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "province", in: "query", required: false, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "city", in: "query", required: false, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "industry", in: "query", required: false, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "support_type", in: "query", required: false, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "search", in: "query", required: false, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "limit", in: "query", required: false, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function compIndex() {}

    #[OA\Get(
        path: "/v1/companies/{id}",
        summary: "Detail perusahaan",
        tags: ["Companies"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function compShow() {}

    #[OA\Put(
        path: "/v1/companies/{id}",
        summary: "Update profil perusahaan (Own Only)",
        tags: ["Companies"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "application/x-www-form-urlencoded",
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(property: "name", type: "string"),
                        new OA\Property(property: "industry", type: "string"),
                        new OA\Property(property: "description", type: "string"),
                        new OA\Property(property: "province", type: "string"),
                        new OA\Property(property: "city", type: "string"),
                        new OA\Property(property: "address", type: "string"),
                        new OA\Property(property: "email", type: "string"),
                        new OA\Property(property: "phone", type: "string"),
                        new OA\Property(property: "logo", type: "string", format: "binary")
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Profil diperbarui")
        ]
    )]
    public function compUpdate() {}

    #[OA\Get(
        path: "/v1/companies/{id}/stats",
        summary: "Statistik sponsorship perusahaan",
        tags: ["Companies"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function compStats() {}

    #[OA\Get(
        path: "/v1/events",
        summary: "List event milik organisasi / semua event (Admin)",
        tags: ["Events"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function eventIndex() {}

    #[OA\Post(
        path: "/v1/events",
        summary: "Buat event baru",
        tags: ["Events"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name","description","target_audience","participant_count","province","city","event_date","category","support_types_needed","budget_range"],
                properties: [
                    new OA\Property(property: "name", type: "string"),
                    new OA\Property(property: "description", type: "string"),
                    new OA\Property(property: "target_audience", type: "string"),
                    new OA\Property(property: "participant_count", type: "integer"),
                    new OA\Property(property: "province", type: "string"),
                    new OA\Property(property: "city", type: "string"),
                    new OA\Property(property: "event_date", type: "string", format: "date"),
                    new OA\Property(property: "category", type: "string"),
                    new OA\Property(property: "support_types_needed", type: "array", items: new OA\Items(type: "string")),
                    new OA\Property(property: "budget_range", type: "string")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Event dibuat")
        ]
    )]
    public function eventStore() {}

    #[OA\Get(
        path: "/v1/events/{id}",
        summary: "Detail event",
        tags: ["Events"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function eventShow() {}

    #[OA\Put(
        path: "/v1/events/{id}",
        summary: "Update event (Own Only)",
        tags: ["Events"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "name", type: "string")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Event diperbarui")
        ]
    )]
    public function eventUpdate() {}

    #[OA\Delete(
        path: "/v1/events/{id}",
        summary: "Hapus event (Own Only)",
        tags: ["Events"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "Event dihapus")
        ]
    )]
    public function eventDestroy() {}

    #[OA\Put(
        path: "/v1/events/{id}/status",
        summary: "Ubah status event (Publish/Archive)",
        tags: ["Events"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["status"],
                properties: [
                    new OA\Property(property: "status", type: "string", enum: ["active", "archived"])
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Status diperbarui")
        ]
    )]
    public function eventStatus() {}

    #[OA\Post(
        path: "/v1/events/{id}/proposal",
        summary: "Upload / update proposal PDF",
        tags: ["Events"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    required: ["proposal"],
                    properties: [
                        new OA\Property(property: "proposal", type: "string", format: "binary")
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Proposal diunggah")
        ]
    )]
    public function eventProposal() {}

    #[OA\Post(
        path: "/v1/sponsorships",
        summary: "Kirim pengajuan sponsorship baru",
        tags: ["Sponsorships"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["event_id", "company_id", "support_type_requested", "cover_letter"],
                properties: [
                    new OA\Property(property: "event_id", type: "integer"),
                    new OA\Property(property: "company_id", type: "integer"),
                    new OA\Property(property: "support_type_requested", type: "string"),
                    new OA\Property(property: "cover_letter", type: "string"),
                    new OA\Property(property: "additional_message", type: "string")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Berhasil diajukan")
        ]
    )]
    public function sponsorApply() {}

    #[OA\Get(
        path: "/v1/sponsorships",
        summary: "List aplikasi sponsorship",
        tags: ["Sponsorships"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function sponsorIndex() {}

    #[OA\Get(
        path: "/v1/sponsorships/{id}",
        summary: "Detail aplikasi sponsorship (Auto trigger reviewed untuk Perusahaan)",
        tags: ["Sponsorships"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function sponsorShow() {}

    #[OA\Put(
        path: "/v1/sponsorships/{id}/decide",
        summary: "Terima atau Tolak pengajuan sponsorship (Perusahaan Only)",
        tags: ["Sponsorships"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["status"],
                properties: [
                    new OA\Property(property: "status", type: "string", enum: ["accepted", "rejected"]),
                    new OA\Property(property: "response_message", type: "string")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Keputusan disimpan")
        ]
    )]
    public function sponsorDecide() {}

    #[OA\Put(
        path: "/v1/sponsorships/{id}/cancel",
        summary: "Batalkan pengajuan sponsorship (Organisasi Only)",
        tags: ["Sponsorships"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "Dibatalkan")
        ]
    )]
    public function sponsorCancel() {}

    #[OA\Get(
        path: "/v1/bookmarks",
        summary: "Daftar perusahaan di-bookmark",
        tags: ["Bookmarks"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function bookmarkIndex() {}

    #[OA\Post(
        path: "/v1/bookmarks",
        summary: "Bookmark perusahaan",
        tags: ["Bookmarks"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["company_id"],
                properties: [
                    new OA\Property(property: "company_id", type: "integer")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Bookmarked")
        ]
    )]
    public function bookmarkStore() {}

    #[OA\Delete(
        path: "/v1/bookmarks/{id}",
        summary: "Hapus bookmark",
        tags: ["Bookmarks"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "Dihapus")
        ]
    )]
    public function bookmarkDestroy() {}

    #[OA\Get(
        path: "/v1/notifications",
        summary: "Daftar notifikasi in-app",
        tags: ["Notifications"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function notifIndex() {}

    #[OA\Put(
        path: "/v1/notifications/{id}/read",
        summary: "Tandai 1 notifikasi dibaca",
        tags: ["Notifications"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function notifRead() {}

    #[OA\Put(
        path: "/v1/notifications/read-all",
        summary: "Tandai semua notifikasi dibaca",
        tags: ["Notifications"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function notifReadAll() {}

    #[OA\Post(
        path: "/v1/pitching",
        summary: "Jadwalkan pitching",
        tags: ["Pitching Sessions"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["sponsorship_application_id", "type", "scheduled_at"],
                properties: [
                    new OA\Property(property: "sponsorship_application_id", type: "integer"),
                    new OA\Property(property: "type", type: "string"),
                    new OA\Property(property: "meet_link", type: "string"),
                    new OA\Property(property: "location", type: "string"),
                    new OA\Property(property: "scheduled_at", type: "string"),
                    new OA\Property(property: "notes", type: "string")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Dijadwalkan")
        ]
    )]
    public function pitchingStore() {}

    #[OA\Get(
        path: "/v1/pitching/{id}",
        summary: "Detail pitching session",
        tags: ["Pitching Sessions"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function pitchingShow() {}

    #[OA\Put(
        path: "/v1/pitching/{id}",
        summary: "Update detail pitching session (Creator Only)",
        tags: ["Pitching Sessions"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "type", type: "string"),
                    new OA\Property(property: "meet_link", type: "string"),
                    new OA\Property(property: "location", type: "string"),
                    new OA\Property(property: "scheduled_at", type: "string"),
                    new OA\Property(property: "notes", type: "string")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Diperbarui")
        ]
    )]
    public function pitchingUpdate() {}

    #[OA\Get(
        path: "/v1/location/provinces",
        summary: "Daftar provinsi Indonesia",
        tags: ["Locations"],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function provinces() {}

    #[OA\Get(
        path: "/v1/location/cities/{province_id}",
        summary: "Daftar kota berdasarkan provinsi",
        tags: ["Locations"],
        parameters: [new OA\Parameter(name: "province_id", in: "path", required: true, schema: new OA\Schema(type: "string"))],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function cities() {}

    #[OA\Get(
        path: "/v1/admin/dashboard",
        summary: "Statistik dashboard (Admin Only)",
        tags: ["Admin Panel"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "filter", in: "query", required: false, schema: new OA\Schema(type: "string"))],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function adminDashboard() {}

    #[OA\Get(
        path: "/v1/admin/users",
        summary: "List semua user dengan filter (Admin Only)",
        tags: ["Admin Panel"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "role", in: "query", required: false, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "is_active", in: "query", required: false, schema: new OA\Schema(type: "boolean")),
            new OA\Parameter(name: "is_verified", in: "query", required: false, schema: new OA\Schema(type: "boolean")),
            new OA\Parameter(name: "search", in: "query", required: false, schema: new OA\Schema(type: "string"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function adminUsers() {}

    #[OA\Put(
        path: "/v1/admin/users/{id}/ban",
        summary: "Ban / Unban user (Admin Only)",
        tags: ["Admin Panel"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function adminBan() {}

    #[OA\Delete(
        path: "/v1/admin/users/{id}",
        summary: "Hapus user permanen (Admin Only)",
        tags: ["Admin Panel"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function adminDestroyUser() {}

    #[OA\Put(
        path: "/v1/admin/events/{id}/moderate",
        summary: "Moderate event status (Admin Only)",
        tags: ["Admin Panel"],
        security: [["bearerAuth" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["action"],
                properties: [
                    new OA\Property(property: "action", type: "string", enum: ["approve", "hide", "remove"])
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function adminModerateEvent() {}

    #[OA\Get(
        path: "/v1/admin/sponsorships",
        summary: "Monitoring semua sponsorship (Admin Only)",
        tags: ["Admin Panel"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Berhasil")
        ]
    )]
    public function adminSponsorships() {}

    #[OA\Get(
        path: "/v1/admin/reports/export",
        summary: "Export laporan CSV (Admin Only)",
        tags: ["Admin Panel"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "type", in: "query", required: true, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "format", in: "query", required: true, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "range", in: "query", required: false, schema: new OA\Schema(type: "string"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Download File CSV")
        ]
    )]
    public function adminExportReport() {}
}
