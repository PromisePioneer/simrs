export const DEGREE_COLUMNS = [
    {key: "name", label: "Nama", width: "180px"},
    {key: "type", label: "Tipe", width: "200px"},
];


export const PAYMENT_METHOD_COLUMNS = [
    {key: "no", label: "No", width: "5%"},
    {key: "name", label: "Nama", width: "25%"},
    {key: "type", label: "Tipe", width: "5%"},
    {key: "actions", label: "Aksi", width: "15%", align: "right"},
];


export const REGISTRATION_INSTITUTION_COLUMNS = [
    {key: "no", label: "No", width: "5%"},
    {key: "name", label: "Nama", width: "25%"},
    {key: "type", label: "Tipe", width: "25%"},
    {key: "actions", label: "Aksi", width: "15%", align: "right"},
];


export const POLI_COLUMNS = [
    {key: "no", label: "No", width: "5%"},
    {key: "name", label: "Nama", width: "25%"},
    {key: "consult_fee", label: "Fee", width: "25%"},
    {key: "actions", label: "Aksi", width: "15%", align: "right"},
];


export const DEPARTMENT_COLUMNS = [
    {key: 'no', label: 'No', width: '5%'},
    {key: 'name', label: 'Nama', width: '25%'},
    {key: 'description', label: 'Deskripsi', width: '25%'},
    {key: 'actions', label: 'Action', width: '15%', align: 'right'},
];


export const ROOM_TYPE_COLUMNS = [
    {key: 'no', label: 'No', width: '5%'},
    {key: 'code', label: 'Kode', width: '10%'},
    {key: 'name', label: 'Nama', width: '15%'},
    {key: 'capacity', label: 'Kapasitas', width: '10%'},
    {key: 'rate_per_night', label: 'Tarif/Malam', width: '15%'},
    {key: 'actions', label: 'Aksi', width: '10%', align: 'right'},
];

export const DISEASE_COLUMNS = [
    {key: 'no', label: 'No', width: '5%'},
    {key: 'code', label: 'Kode', width: '10%'},
    {key: 'name', label: 'Nama', width: '10%'},
    {key: 'symptoms', label: 'Gejala', width: '15%'},
    {key: 'description', label: 'Deskripsi', width: '10%'},
    {key: 'status', label: 'Status', width: '10%'},
    {key: 'valid_code', label: 'Valid', width: '15%'},
    {key: 'actions', label: 'Aksi', width: '10%', align: 'right'},
];


export const DISEASE_STATUS_BADGE = {
    infectious: {label: "Menular", className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"},
    not_contagious: {
        label: "Tidak Menular",
        className: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
    },
};
