export const DEGREE_COLUMNS = [
    {key: "name", label: "Nama", width: "180px"},
    {key: "type", label: "Tipe", width: "200px"},
];


export const PAYMENT_METHOD_COLUMNS = [
    {key: "name", label: "Nama", width: "300px"},
    {key: "type", label: "Tipe", width: "200px"},
];


export const REGISTRATION_INSTITUTION_COLUMNS = [
    {key: "name", label: "Nama", width: "300px"},
    {key: "type", label: "Tipe", width: "200px"},
];


export const POLI_COLUMNS = [
    {key: "name", label: "Nama", width: "300px"},
    {key: "consult_fee", label: "Fee", width: "200px"},
];


export const DEPARTMENT_COLUMNS = [
    {key: 'name', label: 'Nama', width: '300px'},
    {key: 'description', label: 'Deskripsi', width: '200px'}
];


export const ROOM_TYPE_COLUMNS = [
    {key: 'code', label: 'Kode', width: '300px'},
    {key: 'name', label: 'Nama', width: '200px'},
    {key: 'capacity', label: 'Kapasitas', width: '200px'},
    {key: 'rate_per_night', label: 'Tarif/Malam', width: '200px'},
];

export const DISEASE_COLUMNS = [
    {key: 'code', label: 'Kode', width: '300px'},
    {key: 'name', label: 'Nama', width: '200px'},
    {key: 'symptoms', label: 'Gejala', width: '200px'},
    {key: 'description', label: 'Deskripsi', width: '200px'},
    {key: 'status', label: 'Status', width: '200px'},
    {key: 'valid_code', label: 'Valid', width: '15%'},
];


export const DISEASE_STATUS_BADGE = {
    infectious: {label: "Menular", className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"},
    not_contagious: {
        label: "Tidak Menular",
        className: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
    },
};

