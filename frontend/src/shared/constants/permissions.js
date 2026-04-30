export const PERMISSIONS = {
    DASHBOARD: {
        VIEW: 'Melihat Dashboard',
    },
    DEGREE: {
        VIEW: 'Melihat Gelar',
        CREATE: 'Menambahkan Gelar',
        EDIT: 'Mengubah Gelar',
        DELETE: 'Menghapus Gelar',
    },
    PAYMENT_METHOD: {
        VIEW: 'Melihat Tipe Pembayaran',
        CREATE: 'Menambahkan Tipe Pembayaran',
        EDIT: 'Mengubah Tipe Metode Pembayaran',
        DELETE: 'Menghapus Tipe Metode Pembayaran',
    },
    INSTITUTION: {
        VIEW: 'Melihat Lembaga Pendaftaran',
        CREATE: 'Menambahkan Lembaga Pendaftaran',
        EDIT: 'Mengubah Lembaga Pendaftaran',
        DELETE: 'Menghapus Lembaga Pendaftaran',
    },
    ROLE: {
        VIEW: 'Melihat Role',
        CREATE: 'Menambahkan Role',
        EDIT: 'Mengubah Role',
        DELETE: 'Menghapus Role',
    },
    APPOINTMENT: {
        VIEW: 'Melihat Janji Temu',
        CREATE: 'Menambahkan Janji Temu',
        EDIT: 'Mengubah Janji Temu',
        DELETE: 'Menghapus Janji Temu',
    },
    USER: {
        VIEW: 'Melihat User Management',
        CREATE: 'Menambahkan User Management',
        EDIT: 'Mengubah User Management',
        DELETE: 'Menghapus User Management',
    },
    PATIENT: {
        VIEW: 'Melihat Pasien',
        CREATE: 'Menambahkan Pasien',
        EDIT: 'Mengubah Pasien',
        DELETE: 'Menghapus Pasien',
    },
    MEDICINE: {
        VIEW: 'Melihat Obat',
        CREATE: 'Membuat Obat',
        EDIT: 'Mengubah Obat',
        DELETE: 'Menghapus Obat',
    },
    MEDICINE_CATEGORY: {
        VIEW: 'Melihat Kategori Obat',
        CREATE: 'Menambah Kategori Obat',
        EDIT: 'Mengubah Kategori Obat',
        DELETE: 'Menghapus Kategori Obat',
    },
    MEDICINE_WAREHOUSE: {
        VIEW: 'Melihat Gudang Obat',
        CREATE: 'Membuat Gudang Obat',
        EDIT: 'Mengubah Gudang Obat',
        DELETE: 'Menghapus Gudang Obat',
    },
    MEDICINE_RACK: {
        VIEW: 'Melihat Rak Obat',
        CREATE: 'Membuat Rak Obat',
        EDIT: 'Mengubah Rak Obat',
        DELETE: 'Menghapus Rak Obat',
    },
    POLI: {
        VIEW: 'Melihat Poli',
        CREATE: 'Membuat Poli',
        EDIT: 'Mengubah Poli',
        DELETE: 'Menghapus Poli',
    },
    OUTPATIENT_VISIT: {
        VIEW: 'Melihat Rawat Jalan',
        CREATE: 'Menambahkan Rawat Jalan',
        EDIT: 'Mengubah Rawat Jalan',
        DELETE: 'Menghapus Rawat Jalan',
    },
    PRESCRIPTION: {
        VIEW: 'Melihat Penebusan Obat',
        CREATE: 'Menambahkan Penebusan Obat',
        EDIT: 'Mengubah Penebusan Obat',
        DELETE: 'Menghapus Penebusan Obat',
    },
    STOCK_MOVEMENT: {
        VIEW: 'Melihat Mutasi Stock',
    },
    BUILDING: {
        VIEW: 'Melihat Gedung',
        CREATE: 'Membuat Gedung',
        EDIT: 'Mengubah Gedung',
        DELETE: 'Menghapus Gedung',
    },
    FACILITY: {
        VIEW: 'Melihat Fasilitas',
    },
    WARD: {
        VIEW: 'Melihat Ruang Rawat',
        CREATE: 'Membuat Ruang Rawat',
        EDIT: 'Mengubah Ruang Rawat',
        DELETE: 'Menghapus Ruang Rawat',
    },
    ROOM: {
        VIEW: 'Melihat Ruangan',
        CREATE: 'Membuat Ruangan',
        EDIT: 'Mengubah Ruangan',
        DELETE: 'Menghapus Ruangan',
    },
    DISEASE: {
        VIEW: 'Melihat Penyakit',
        CREATE: 'Membuat Penyakit',
        EDIT: 'Mengubah Penyakit',
        DELETE: 'Menghapus Penyakit',
    },
    ROOM_TYPE: {
        VIEW: 'Melihat Tipe Ruangan',
        CREATE: 'Membuat Tipe Ruangan',
        EDIT: 'Mengubah Tipe Ruangan',
        DELETE: 'Menghapus Tipe Ruangan',
    },
    INPATIENT: {
        VIEW: 'Melihat Rawat Inap',
        CREATE: 'Membuat Rawat Inap',
        EDIT: 'Mengubah Rawat Inap',
        DELETE: 'Menghapus Rawat Inap',
    },
    DEPARTMENT: {
        VIEW: 'Melihat Master',
        CREATE: 'Melihat Master',
        EDIT: 'Melihat Master',
        DELETE: 'Melihat Master',
    },
    SETTING: {
        VIEW: 'Melihat Setting',
    },
    MODULE: {
        VIEW: 'Melihat Module Management',
        CREATE: 'Menambahkan Module Management',
        EDIT: 'Mengubah Module Management',
        DELETE: 'Menghapus Module Management',
    },
    EMR: {
        VIEW: 'Melihat Electronic Medical Record',
    },

    // ── Accounting ────────────────────────────────────────────────────────────
    ACCOUNTING: {
        VIEW: 'Melihat Akuntansi',
        CREATE: 'Menambahkan Entri Akuntansi',
        EDIT: 'Mengubah Akuntansi',
        DELETE: 'Menghapus Akuntansi',
    },
    ACCOUNT_CATEGORY: {
        VIEW: 'Melihat Kategori Akun',
        CREATE: 'Menambahkan Kategori Akun',
        EDIT: 'Mengubah Kategori Akun',
        DELETE: 'Menghapus Kategori Akun',
    },
    JOURNAL_ENTRY: {
        VIEW: 'Melihat Jurnal Entri',
        CREATE: 'Menambahkan Jurnal Entri',
    },
    FINANCIAL_REPORT: {
        VIEW: 'Melihat Laporan Keuangan',
    },

    // ── Billing ───────────────────────────────────────────────────────────────
    BILLING_OUTPATIENT: {
        VIEW: 'Melihat Tagihan Rawat Jalan',
        CREATE: 'Membuat Tagihan Rawat Jalan',
        EDIT: 'Mengubah Tagihan Rawat Jalan',
        PAY: 'Memproses Pembayaran Rawat Jalan',
    },
    BILLING_INPATIENT: {
        VIEW: 'Melihat Tagihan Rawat Inap',
        CREATE: 'Membuat Tagihan Rawat Inap',
        EDIT: 'Mengubah Tagihan Rawat Inap',
        PAY: 'Memproses Pembayaran Rawat Inap',
    },

};
