<?php

declare(strict_types=1);

namespace Domains\Patient\Domain\Repository;

use Domains\Patient\Domain\Entities\Patient;

/**
 * Repository Interface (Port).
 *
 * Didefinisikan di Domain layer — BEBAS dari Eloquent/DB.
 * Implementasinya ada di Infrastructure layer.
 *
 * Prinsip: Domain tidak tahu BAGAIMANA data disimpan,
 * hanya tahu APA yang bisa dilakukan.
 */
interface PatientRepositoryInterface
{
    /**
     * Simpan pasien baru ke persistence.
     */
    public function save(Patient $patient): void;

    /**
     * Update pasien yang sudah ada.
     */
    public function update(Patient $patient): void;

    /**
     * Hapus pasien.
     */
    public function delete(Patient $patient): void;

    /**
     * Cari pasien berdasarkan ID.
     *
     * @throws \Domains\Patient\Domain\Exceptions\PatientNotFoundException
     */
    public function findById(string $id): Patient;

    /**
     * Cari pasien berdasarkan ID card (NIK).
     */
    public function findByIdCardNumber(string $idCardNumber, string $tenantId): ?Patient;

    /**
     * Cari pasien berdasarkan email dalam satu tenant.
     */
    public function findByEmail(string $email, string $tenantId): ?Patient;

    /**
     * Ambil sequence terakhir MRN dalam satu tenant untuk generate nomor baru.
     */
    public function getLastMedicalRecordSequence(?string $tenantId): int;

    /**
     * Ambil semua pasien dengan filter dan paginasi.
     *
     * @return array{data: Patient[], total: int, per_page: int, current_page: int}
     */
    public function findAll(?string $tenantId, array $filters = [], int $perPage = 15, int $page = 1): object;

    /**
     * Ambil pasien beserta rekam medis (EMR) lengkap.
     */
    public function findAllWithEMR(string $tenantId, array $filters = [], int $perPage = 15): object;

    /**
     * Hitung total pasien dalam satu tenant.
     */
    public function countByTenant(string $tenantId): int;
}
