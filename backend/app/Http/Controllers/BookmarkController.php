<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookmarkResource;
use App\Services\BookmarkService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    use ApiResponse;

    protected BookmarkService $bookmarkService;

    public function __construct(BookmarkService $bookmarkService)
    {
        $this->bookmarkService = $bookmarkService;
    }

    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        $limit = $request->input('limit', 6);
        $paginated = $this->bookmarkService->listBookmarks($user->id, $limit);

        return $this->success(
            BookmarkResource::collection($paginated->items()),
            'Daftar bookmark berhasil dimuat',
            200,
            [
                'current_page' => $paginated->cursor()?->encode(),
                'per_page' => $paginated->perPage(),
                'has_more' => $paginated->hasMorePages(),
            ]
        );
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'company_id' => 'required|integer',
        ]);

        $user = auth()->user();
        $bookmark = $this->bookmarkService->addBookmark($user->id, $request->input('company_id'));

        return $this->success(new BookmarkResource($bookmark), 'Sponsor berhasil ditambahkan ke bookmark', 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = auth()->user();
        $success = $this->bookmarkService->removeBookmark($user->id, $id);

        if (!$success) {
            return $this->error('Bookmark tidak ditemukan atau gagal dihapus', 404);
        }

        return $this->success(null, 'Sponsor dihapus dari bookmark');
    }
}
