<?php

namespace App\Traits\Tenant;


use App\Models\Permission;

trait TenantDefaultPermissionAndRole
{

    public function ownerPermissions(string $tenantId): array
    {
        return Permission::where('tenant_id', $tenantId)->get(['uuid', 'name'])->toArray();
    }


    public function dokterPermissions(string $tenantId): array
    {
        return Permission::where('tenant_id', $tenantId)->whereIn('name', [
            "Melihat list appointment satu dokter",
            "Menghandle online referral satu dokter",
            "Melihat overview pasien",
            "Melihat login & Complete profile",
            "Melihat jadwal praktek pribadi",
            "Mencari pasien",
            "Mengarah ke halaman rekam medis",
            "Blok Kalender satu dokter",
            "Set semua status pasien",
            "Melihat emr pasien konsultasi hari itu ke praktek pribadi",
            "Melihat emr semua pasien",
            "Mencari pasien tertentu",
            "Menambahkan emr",
            "Mengedit data pasien",
            "Mengenerate laporan emr",
            "Set status Engage ke Done",
            "Melihat staff",
            "Melihat prosedur dokter",
            "Mengatur prosedur dokter",
            "Melihat print template",
            "Mengatur print template",
            "Mengatur profile dokter",
            "Mencoret EMR",
            "Mengunci harga tindakan",
            "Set status Engage ke Done",
            "Melihat appointment lama",
            "Melihat appointment baru",
            "Melihat general setting",
            "Mengedit General Setting",
            "Menggunakan fitur data entry",
            "Tambah Catatan Organ",
            "Tambah Catatan Dokter",
            "Tambah Catatan Perawat",
            "Tambah Obgyn",
            "Tambah Catatan Obstetri",
            "Tambah Catatan KB",
            "Tambah Rekam Medis Tubuh",
            "Tambah Catatan Awal Kehamilan",
            "Tambah Catatan Kesehatan Ibu Hamil",
            "Tambah Catatan Imunisasi",
            "Tambah Prosedur",
            "Tambah Paket Prosedur",
            "Tambah Resep",
            "Tambah Order",
            "Tambah Berkas",
            "Tambah Vital Sign",
            "Tambah Catatan Bebas",
            "Tambah Odontogram",
            "Tambah Hasil Lab",
            "Tambah Bahan Habis Pakai",
            "Tambah Rujukan",
            "Tambah Kesimpulan",
            "Tambah Rujuk Rawat Inap",
            "Melihat Tab Verifikasi",
            "Melakukan Verifikasi EMR",
            "Menambahkan ttd pada Verifikasi EMR",
            "Tambah Surat Menyurat",
            "Tambah Lembar Edukasi",
            "Tambah Skrinig Pasien Rawat Jalan",
            "Upload tanda tangan medis",
            "Tambah Discharge Patient",
            "Tambah Rekam Medis Bedah",
            "Tambah Psikososial-Spiritual",
            "Tambah Rekam Medis Gizi",
            "Mengatur diskon prosedur",
            "Tambah Rekam Medis OHI-S",
            "Mengakses Menu Pengaduan & Saran",
            "Tambah Hasil Pemeriksaan Tubuh",
        ])->get(['uuid', 'name'])->toArray();
    }


    public function perawatPermissions(string $tenantId): array
    {
        return Permission::where('tenant_id', $tenantId)->whereIn('name', [
            "Melihat list appointment semua dokter",
            "Menghandle online referral semua dokter",
            "Melihat overview pasien",
            "Melihat overview apotek",
            "Melihat login & Complete profile",
            "Melihat jadwal praktek semua dokter",
            "Mencari pasien",
            "Mendaftarkan pasien rawat jalan",
            "Mendaftarkan pasien detail",
            "Mengarah ke halaman rekam medis",
            "Mengenerate laporan rawat jalan",
            "Blok Kalender semua dokter",
            "Reschedulle",
            "Set semua status pasien",
            "Melihat emr pasien konsultasi hari itu ke klinik",
            "Melihat emr semua pasien",
            "Mencari pasien tertentu",
            "Menambahkan emr",
            "Mengedit data pasien",
            "Mengenerate laporan emr",
            "Set status Engage ke Done",
            "Melihat staff",
            "Mencoret EMR",
            "Set status Engage ke Done",
            "Menginput Data Pasien Sebelumnya",
            "Melihat appointment lama",
            "Melihat appointment baru",
            "Menggunakan fitur data entry",
            "Tambah Catatan Organ",
            "Tambah Catatan Dokter",
            "Tambah Catatan Perawat",
            "Tambah Obgyn",
            "Tambah Catatan Obstetri",
            "Tambah Catatan KB",
            "Tambah Rekam Medis Tubuh",
            "Tambah Catatan Awal Kehamilan",
            "Tambah Catatan Kesehatan Ibu Hamil",
            "Tambah Catatan Imunisasi",
            "Tambah Prosedur",
            "Tambah Paket Prosedur",
            "Tambah Resep",
            "Tambah Order",
            "Tambah Berkas",
            "Tambah Vital Sign",
            "Tambah Catatan Bebas",
            "Tambah Odontogram",
            "Tambah Hasil Lab",
            "Tambah Bahan Habis Pakai",
            "Tambah Rujukan",
            "Tambah Kesimpulan",
            "Tambah Lembar Edukasi",
            "Mengakses Menu Pengaduan & Saran",
        ])->get(['uuid', 'name'])->toArray();
    }


    public function adminPermission(string $tenantId): array
    {
        return Permission::where('tenant_id', $tenantId)->whereIn('name', [
            "Melihat list appointment semua dokter",
            "Menghandle online referral semua dokter",
            "Melihat overview pasien",
            "Melihat overview apotek",
            "Melihat login & Complete profile",
            "Melihat jadwal praktek semua dokter",
            "Mendaftarkan pasien rawat jalan",
            "Mendaftarkan pasien detail",
            "Mengenerate laporan rawat jalan",
            "Blok Kalender semua dokter",
            "Reschedulle",
            "Set semua status pasien",
            "Melihat staff",
            "Mengatur staff",
            "Melihat prosedur dokter",
            "Melihat print template",
            "Melihat pajak biaya lain",
            "Melihat konfigurasi bpjs",
            "Mengatur profile rumah sakit",
            "Mengatur profile dokter",
            "Menginput Data Pasien Sebelumnya",
            "Melihat appointment lama",
            "Melihat appointment baru",
            "Melihat general setting",
            "Mengedit General Setting",
            "Menggunakan fitur data entry",
            "Mengakses Menu Pengaduan & Saran",
        ])->get(['uuid', 'name'])
            ->toArray();

    }


    public function kasirPermission(string $tenantId): array
    {
        return Permission::where('tenant_id', $tenantId)->whereIn('name', [
            "Melihat login & Complete profile",
            "Melihat pembayaran pasien",
            "Menghandle pembayaran pasien",
            "Melihat pembayaran hutang & piutang",
            "Menghandle pembayaran hutang & piutang",
            "Melihat staff",
            "Mengubah lokasi stok obat",
            "Menggunakan fitur data entry",
            "Menambah dan mengurangi data obat dan prosedur",
            "Mengatur diskon pembayaran",
        ])->get(['uuid', 'name'])->toArray();

    }
}
