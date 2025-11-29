<?php

namespace App\Services\Global;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    public function handle(
        string  $propertyName,
        string  $path,
        Request $request,
        ?string $oldFile = null
    ): ?string
    {
        if (!$request->hasFile($propertyName)) {
            return $oldFile;
        }

        if ($oldFile && Storage::disk('public')->exists($oldFile)) {
            Storage::disk('public')->delete($oldFile);
        }

        $file = $request->file($propertyName);
        return $file->store($path, 'public');
    }
}
