// Dipisah dari store — UI concerns tidak boleh ada di store
export const MEDICINE_COLUMNS = [
    { key: "no", label: "No", width: "5%" },
    { key: "sku", label: "SKU" },
    { key: "name", label: "Nama" },
    { key: "type", label: "Tipe" },
    { key: "stock_amount", label: "Stok" },
    { key: "actions", label: "Aksi", width: "10%", align: "right" },
];

export const MEDICINE_TYPES = ["tablet", "kapsul", "sirup", "injeksi", "salep", "tetes"];
