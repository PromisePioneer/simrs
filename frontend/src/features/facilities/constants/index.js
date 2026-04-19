export const WARD_COLUMNS = [
    { key: "no", label: "No", width: "5%" },
    { key: "name", label: "Nama", width: "25%" },
    { key: "department", label: "Departemen", width: "25%" },
    { key: "rooms", label: "Ruangan", width: "25%" },
    { key: "actions", label: "Aksi", width: "15%", align: "right" },
];

export const ROOM_COLUMNS = [
    { key: "no", label: "No", width: "5%" },
    { key: "name", label: "Nama", width: "25%" },
    { key: "type", label: "Tipe", width: "20%" },
    { key: "capacity", label: "Kapasitas", width: "15%" },
    { key: "actions", label: "Aksi", width: "15%", align: "right" },
];

export const BED_STATUS = {
    AVAILABLE: "available",
    OCCUPIED: "occupied",
    MAINTENANCE: "maintenance",
};

export const BED_STATUS_LABELS = {
    [BED_STATUS.AVAILABLE]: "Tersedia",
    [BED_STATUS.OCCUPIED]: "Terisi",
    [BED_STATUS.MAINTENANCE]: "Maintenance",
};
