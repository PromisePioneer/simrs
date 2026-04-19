<?php

declare(strict_types=1);

namespace Domains\Patient\Infrastructure\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Infrastructure Service: Menangani upload file foto profil pasien.
 *
 * Kenapa di Infrastructure, bukan Application?
 * → Upload file adalah detail teknis (disk, path, storage).
 *   Domain tidak peduli bagaimana file disimpan,
 *   hanya peduli bahwa ada `?string $profilePicturePath`.
 *
 * Controller memanggil service ini sebelum membuat DTO,
 * lalu path hasil upload dimasukkan ke DTO.
 */
final class PatientFileUploadService
{
    private const DISK = 'public';
    private const PATH = 'patients/profile_picture';

    public function upload(UploadedFile $file, ?string $existingPath = null): string
    {
        if ($existingPath && Storage::disk(self::DISK)->exists($existingPath)) {
            Storage::disk(self::DISK)->delete($existingPath);
        }

        return $file->store(self::PATH, self::DISK);
    }

    public function delete(?string $path): void
    {
        if ($path && Storage::disk(self::DISK)->exists($path)) {
            Storage::disk(self::DISK)->delete($path);
        }
    }
}
