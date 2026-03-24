// Dipindahkan dari src/constants/permissions.js
// Dipakai lintas fitur — cocok di shared

export const PERMISSIONS = {
    // Patients
    PATIENT_VIEW: "patient.view",
    PATIENT_CREATE: "patient.create",
    PATIENT_UPDATE: "patient.update",
    PATIENT_DELETE: "patient.delete",

    // Outpatient
    OUTPATIENT_VIEW: "outpatient.view",
    OUTPATIENT_CREATE: "outpatient.create",
    OUTPATIENT_UPDATE: "outpatient.update",

    // Inpatient
    INPATIENT_VIEW: "inpatient.view",
    INPATIENT_CREATE: "inpatient.create",
    INPATIENT_UPDATE: "inpatient.update",

    // Medicine
    MEDICINE_VIEW: "medicine.view",
    MEDICINE_CREATE: "medicine.create",
    MEDICINE_UPDATE: "medicine.update",
    MEDICINE_DELETE: "medicine.delete",

    // Users
    USER_VIEW: "user.view",
    USER_CREATE: "user.create",
    USER_UPDATE: "user.update",
    USER_DELETE: "user.delete",

    // Roles
    ROLE_VIEW: "role.view",
    ROLE_CREATE: "role.create",
    ROLE_UPDATE: "role.update",
    ROLE_DELETE: "role.delete",
};
