export const APPOINTMENT_COLUMNS = [
    {label: "No. Kunjungan", width: "180px"},
    {label: "Pasien", width: "200px"},
    {label: "Tanggal & Jam"},
    {label: "Penjamin"},
    {label: "Jenis"},
    {label: "Status Daftar"},
    {label: "Status"},
];


export const APPOINTMENT_STATUS_CONFIG = {
    not_yet: {label: "Belum", variant: "secondary"},
    already: {label: "Sudah", variant: "default"},
    canceled: {label: "Batal", variant: "destructive"},
    files_received: {label: "Berkas Diterima", variant: "outline"},
    refered: {label: "Dirujuk", variant: "outline"},
    died: {label: "Meninggal", variant: "destructive"},
    in_treatment: {label: "Dirawat", variant: "default"},
    forced_return: {label: "Pulang Paksa", variant: "secondary"},
};


export const APPOINTMENT_ADVANCED_STATUS = {
    outpatient: {label: "Ralan", variant: "outline"},
    inpatient: {label: "Ranap", variant: "default"},
};


export const APPOINTMENT_REGISTRATION_STATUS_LABEL = {
    "-": "—",
    old: "Lama",
    new: "Baru",
};
