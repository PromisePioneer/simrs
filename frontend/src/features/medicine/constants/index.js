// Dipisah dari store — UI concerns tidak boleh ada di store

const UNIT_OPTIONS = [
    {value: "tablet", label: "Tablet"},
    {value: "kapsul", label: "Kapsul"},
    {value: "strip", label: "Strip"},
    {value: "box", label: "Box"},
    {value: "botol", label: "Botol"},
    {value: "dus", label: "Dus"},
    {value: "ampul", label: "Ampul"},
    {value: "tube", label: "Tube"},
    {value: "sachet", label: "Sachet"},
    {value: "vial", label: "Vial"},
    {value: "pcs", label: "Pcs"},
];

export const getAvailableUnitsForRow = (units = [], currentIndex) => {
    const usedUnits = units
        .filter((_, i) => i !== currentIndex)
        .map((u) => u.unit_name);
    return UNIT_OPTIONS.filter((opt) => !usedUnits.includes(opt.value));
};


export const MEDICINE_COLUMNS = [
    {key: "no", label: "No", width: "5%"},
    {key: "sku", label: "SKU"},
    {key: "name", label: "Nama"},
    {key: "type", label: "Tipe"},
    {key: "stock_amount", label: "Stok"},
    {key: "actions", label: "Aksi", width: "10%", align: "right"},
];


export const MEDICINE_BATCH_COLUMNS = [
    {key: "no", label: "No", width: "5%"},
    {key: "sku", label: "SKU"},
    {key: "name", label: "Nama"},
    {key: "type", label: "Tipe"},
    {key: "stock_amount", label: "Stok"},
    {key: "actions", label: "Aksi", width: "10%", align: "right"},
];


export const MEDICINE_CATEGORIES_COLUMNS = [
    {key: "no", label: "No", width: "5%"},
    {key: "name", label: "Nama"},
    {key: "actions", label: "Aksi", width: "10%", align: "right"},
];


export const MEDICINE_WAREHOUSE_COLUMNS = [
    {key: "no", label: "No", width: "5%"},
    {key: "code", label: "Kode"},
    {key: "name", label: "Nama"},
    {key: "rack", label: "rak"},
    {key: "actions", label: "Aksi", width: "10%", align: "right"},
];


export const MEDICINE_TYPES = ["tablet", "kapsul", "sirup", "injeksi", "salep", "tetes"];
