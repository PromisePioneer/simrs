<?php

declare(strict_types=1);

namespace Domains\IAM\Infrastructure\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

final class UserFileUploadService
{
    private const DISK             = 'public';
    private const PROFILE_PATH     = 'images/users/profile_picture';
    private const SIGNATURE_PATH   = 'images/users/signature';

    public function uploadProfilePicture(UploadedFile $file, ?string $existing = null): string
    {
        return $this->upload($file, self::PROFILE_PATH, $existing);
    }

    public function uploadSignature(UploadedFile $file, ?string $existing = null): string
    {
        return $this->upload($file, self::SIGNATURE_PATH, $existing);
    }

    public function delete(?string $path): void
    {
        if ($path && Storage::disk(self::DISK)->exists($path)) {
            Storage::disk(self::DISK)->delete($path);
        }
    }

    private function upload(UploadedFile $file, string $path, ?string $existing): string
    {
        if ($existing && Storage::disk(self::DISK)->exists($existing)) {
            Storage::disk(self::DISK)->delete($existing);
        }
        return $file->store($path, self::DISK);
    }
}
