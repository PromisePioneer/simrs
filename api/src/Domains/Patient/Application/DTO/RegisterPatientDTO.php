<?php

declare(strict_types=1);

namespace Domains\Patient\Application\DTO;

/**
 * Data Transfer Object untuk registrasi pasien baru.
 *
 * DTO adalah jembatan antara Presentation layer dan Application layer.
 * Tidak ada logic bisnis di sini — hanya membawa data mentah yang sudah divalidasi.
 *
 * Kenapa tidak pakai Request langsung di Handler?
 * → Agar Application layer bebas dari dependency HTTP/Laravel.
 *   Handler bisa dipanggil dari console, queue, atau test tanpa perlu mock Request.
 */
final class RegisterPatientDTO
{
    public function __construct(
        public readonly ?string  $tenantId,
        public readonly string  $fullName,
        public readonly string  $cityOfBirth,
        public readonly string  $dateOfBirth,       // format: Y-m-d
        public readonly string  $idCardNumber,
        public readonly string  $gender,
        public readonly ?string $religion,
        public readonly ?string $bloodType,
        public readonly string  $job,
        public readonly string  $phone,
        public readonly ?string $email,
        public readonly ?string $dateOfConsultation, // format: Y-m-d
        public readonly ?string $kisNumber,
        public readonly ?string $profilePicturePath,  // path sudah diproses FileUploadService
        public readonly array   $addresses,           // array of PatientAddress::fromArray()
        public readonly array   $paymentMethods,      // array of PatientPaymentMethod::fromArray()
    ) {}
}
