# Refactor: Feature-Based Architecture

## Struktur folder target

```
src/
├── shared/                         ← semua yang dipakai lintas fitur
│   ├── components/
│   │   ├── ui/                     ← shadcn/ui (tidak diubah)
│   │   └── common/                 ← DataTable, Modal, Tabs, AsyncSelect, dll
│   ├── hooks/                      ← usePermission, useHelpers, useImagePreview, use-mobile
│   ├── store/                      ← sidebarStore, uiStore, loadingStore, tenantStore
│   ├── services/                   ← apiCall.js
│   ├── utils/                      ← calculateAge, formatDate, permissionCheck, dll
│   ├── lib/                        ← utils.js (shadcn), billingsdk-config.js
│   ├── constants/                  ← permissions.js
│   └── middleware/                 ← permissionMiddleware.js
│
└── features/
    ├── auth/                       ← authStore, login, register pages & routes
    ├── outpatient/                 ← outpatientVisitStore, diagnoseStore, prescriptionStore, patientQueueStore
    ├── inpatient/                  ← inpatientAdmissionStore, pages
    ├── medicine/                   ← medicineStore + semua sub-store pharmacy, useMedicineForm hook
    ├── patients/                   ← patientStore, pages, patient-* components
    ├── users-management/           ← userStore, roleStore, user-* components
    ├── facilities/                 ← wardStore, bedStore, buildingStore, roomStore, roomTypeStore
    ├── emr/                        ← emr pages & components
    ├── settings/                   ← degreeStore, paymentMethodStore, poliStore, dll (references)
    └── dashboard/                  ← outpatientDashboardReportStore
```

---

## Langkah migrasi

### 1. Scaffold folder baru

```bash
bash scaffold.sh
```

### 2. Pindahkan file ke lokasi baru

Ikuti peta di bawah. Salin (jangan langsung hapus dulu) agar bisa rollback.

#### Peta store lama → feature baru

| File lama (`src/store/`) | Feature baru |
|---|---|
| `authStore.js` | `features/auth/store/` |
| `outpatientVisitStore.js` | `features/outpatient/store/` |
| `diagnoseStore.js` | `features/outpatient/store/` |
| `prescriptionStore.js` | `features/outpatient/store/` |
| `patientQueueStore.js` | `features/outpatient/store/` |
| `inpatientAdmissionStore.js` | `features/inpatient/store/` |
| `wardStore.js` | `features/facilities/store/` |
| `bedStore.js` | `features/facilities/store/` |
| `buildingStore.js` | `features/facilities/store/` |
| `roomStore.js` | `features/facilities/store/` |
| `roomTypeStore.js` | `features/facilities/store/` |
| `medicineStore.js` | `features/medicine/store/` |
| `medicineCategoriesStore.js` | `features/medicine/store/` |
| `medicineWarehouseStore.js` | `features/medicine/store/` |
| `medicineBatchesStore.js` | `features/medicine/store/` |
| `medicineRackStore.js` | `features/medicine/store/` |
| `stockMovementStore.js` | `features/medicine/store/` |
| `usePatientStore.js` | `features/patients/store/patientStore.js` |
| `useUserStore.js` | `features/users-management/store/userStore.js` |
| `useRoleStore.js` | `features/users-management/store/roleStore.js` |
| `useDegreeStore.js` | `features/settings/store/degreeStore.js` |
| `usePaymentMethodStore.js` | `features/settings/store/paymentMethodStore.js` |
| `useRegistrationInstitutionStore.js` | `features/settings/store/registrationInstitutionStore.js` |
| `poliStore.js` | `features/settings/store/poliStore.js` |
| `departmentStore.js` | `features/settings/store/departmentStore.js` |
| `usePolyOutPatientStore.js` | `features/settings/store/polyOutpatientStore.js` |
| `outpatientDashboardReportStore.js` | `features/dashboard/store/` |
| `useSidebarStore.js` | `shared/store/sidebarStore.js` |
| `useUIStore.js` | `shared/store/uiStore.js` |
| `loadingStore.js` | `shared/store/uiStore.js` (digabung) |
| `useTenantStore.js` | `shared/store/tenantStore.js` |
| `useModuleStore.js` | `shared/store/moduleStore.js` |
| `usePricing.js` | `shared/store/pricingStore.js` |

#### Peta hooks lama → baru

| File lama | Lokasi baru |
|---|---|
| `src/hooks/usePermission.js` | `shared/hooks/usePermission.js` |
| `src/hooks/use-helpers.js` | `shared/hooks/use-helpers.js` |
| `src/hooks/useImagePreview.js` | `shared/hooks/useImagePreview.js` |
| `src/hooks/use-mobile.js` | `shared/hooks/use-mobile.js` |
| `src/hooks/medicine-form.js` | `features/medicine/hooks/useMedicineForm.js` |
| `src/hooks/user/useUserFormDataSync.js` | `features/users-management/hooks/useUserFormDataSync.js` |

#### Peta components lama → baru

| Folder lama | Lokasi baru |
|---|---|
| `src/components/ui/` | `shared/components/ui/` (tidak diubah) |
| `src/components/common/` | `shared/components/common/` |
| `src/components/sidebar/` | `shared/components/sidebar/` |
| `src/components/loading/` | `shared/components/loading/` |
| `src/components/medicines/` | `features/medicine/components/` |
| `src/components/patient/` | `features/patients/components/` |
| `src/components/user/` | `features/users-management/components/` |
| `src/components/emr/` | `features/emr/components/` |
| `src/components/tenants/` | `shared/components/tenants/` |
| `src/components/settings/` | `features/settings/components/` |

#### Peta pages lama → baru

| Folder lama | Lokasi baru |
|---|---|
| `src/pages/auth/` | `features/auth/pages/` |
| `src/pages/outpatient/` | `features/outpatient/pages/` |
| `src/pages/inpatient/` | `features/inpatient/pages/` |
| `src/pages/emr/` | `features/emr/pages/` |
| `src/pages/facilities/` | `features/facilities/pages/` |
| `src/pages/dashboard/` | `features/dashboard/pages/` |
| `src/pages/settings/medicine-management/` | `features/medicine/pages/` |
| `src/pages/settings/patients/` | `features/patients/pages/` |
| `src/pages/settings/users-management/` | `features/users-management/pages/` |
| `src/pages/settings/references/` | `features/settings/pages/references/` |
| `src/pages/master/` | `features/settings/pages/master/` |

### 3. Buat `index.js` barrel export di setiap feature

Setiap `features/<nama>/index.js` hanya export apa yang boleh dipakai fitur lain. Contoh:

```js
// features/medicine/index.js
export { useMedicineStore } from "./store/medicineStore.js";
export { useMedicineForm } from "./hooks/useMedicineForm.js";
export { MEDICINE_COLUMNS } from "./constants/index.js";
export { default as MedicinePage } from "./pages/MedicinePage.jsx";
```

### 4. Update vite.config.js

Tambahkan alias baru (sudah ada di `vite.config.js` output):

```js
resolve: {
    alias: {
        "@": path.resolve(__dirname, "./src"),
        "@shared": path.resolve(__dirname, "./src/shared"),
        "@features": path.resolve(__dirname, "./src/features"),
    },
},
```

### 5. Jalankan migration script (rewrite imports otomatis)

```bash
# Preview dulu tanpa mengubah file
node migrate-imports.js --dry-run

# Apply perubahan
node migrate-imports.js
```

### 6. Pindahkan constants & utils

| File lama | Lokasi baru |
|---|---|
| `src/constants/permissions.js` | `shared/constants/permissions.js` |
| `src/constants/medicines.js` | `features/medicine/constants/index.js` |
| `src/constants/outpatient-visits.js` | `features/outpatient/constants/index.js` |
| `src/utils/calculateAge.js` | `shared/utils/calculateAge.js` |
| `src/utils/formatDate.js` | `shared/utils/formatDate.js` |
| `src/utils/permissionCheck.js` | `shared/utils/permissionCheck.js` |
| `src/utils/medicines/skuGenerator.js` | `features/medicine/utils/skuGenerator.js` |
| `src/utils/user/formUtils.js` | `features/users-management/utils/formUtils.js` |
| `src/middleware/permissionMiddleware.js` | `shared/middleware/permissionMiddleware.js` |
| `src/lib/utils.js` | `shared/lib/utils.js` |
| `src/lib/billingsdk-config.js` | `shared/lib/billingsdk-config.js` |

---

## Aturan wajib setelah migrasi

### ✅ Boleh
```js
// Import dari feature lain lewat barrel export
import { usePatientStore } from "@features/patients";

// Import dari shared
import { usePermission } from "@shared/hooks";
import apiCall from "@shared/services/apiCall.js";
```

### ❌ Dilarang
```js
// Jangan import langsung masuk ke dalam subfolder feature lain
import { usePatientStore } from "@features/patients/store/patientStore.js";

// Jangan import feature dari feature lain selain lewat index.js
import SomeComponent from "@features/outpatient/components/SomeComponent.jsx";
```

### Mengapa `columns()` dipindah keluar dari store?

Store hanya boleh berisi **state** dan **actions** (business + API logic). `columns()` adalah konfigurasi UI — tempatnya di `constants/index.js` di feature terkait, bukan di store. Ini juga memudahkan testing store secara isolated.

**Sebelum:**
```js
// store punya columns() — ❌
const { columns, fetchMedicines } = useMedicineStore();
```

**Sesudah:**
```js
// columns dari constants — ✅
import { MEDICINE_COLUMNS } from "@features/medicine";
const { fetchMedicines } = useMedicineStore();
```

---

## Checklist migrasi per feature

- [ ] Buat folder `features/<nama>/`
- [ ] Pindahkan store(s) ke `store/`
- [ ] Pindahkan pages ke `pages/`
- [ ] Pindahkan components spesifik ke `components/`
- [ ] Pindahkan hooks ke `hooks/`
- [ ] Ekstrak `columns()` dari store ke `constants/index.js`
- [ ] Buat `index.js` barrel export
- [ ] Update semua import yang mengarah ke feature ini
- [ ] Hapus file lama setelah konfirmasi tidak ada import yang putus
