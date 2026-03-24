#!/usr/bin/env node
/**
 * migrate-imports.js
 *
 * Jalankan dari root frontend:
 *   node migrate-imports.js [--dry-run]
 *
 * Script ini rewrite semua import path lama ke struktur feature-based baru.
 * Gunakan --dry-run dulu untuk preview perubahan tanpa menulis file.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const DRY_RUN = process.argv.includes("--dry-run");
const SRC_DIR = "./src";
const EXT = new Set([".js", ".jsx", ".ts", ".tsx"]);

// ─── Peta import lama → import baru ────────────────────────────────────────
const IMPORT_MAP = [
    // Auth
    ["@/store/authStore",                       "@features/auth"],

    // Outpatient
    ["@/store/outpatientVisitStore",             "@features/outpatient"],
    ["@/store/diagnoseStore",                    "@features/outpatient"],
    ["@/store/prescriptionStore",                "@features/outpatient"],
    ["@/store/patientQueueStore",                "@features/outpatient"],
    ["@/constants/outpatient-visits",            "@features/outpatient"],

    // Inpatient
    ["@/store/inpatientAdmissionStore",          "@features/inpatient"],

    // Facilities
    ["@/store/wardStore",                        "@features/facilities"],
    ["@/store/bedStore",                         "@features/facilities"],
    ["@/store/buildingStore",                    "@features/facilities"],
    ["@/store/roomStore",                        "@features/facilities"],
    ["@/store/roomTypeStore",                    "@features/facilities"],

    // Medicine
    ["@/store/medicineStore",                    "@features/medicine"],
    ["@/store/medicineCategoriesStore",          "@features/medicine"],
    ["@/store/medicineWarehouseStore",           "@features/medicine"],
    ["@/store/medicineBatchesStore",             "@features/medicine"],
    ["@/store/medicineRackStore",                "@features/medicine"],
    ["@/store/stockMovementStore",               "@features/medicine"],
    ["@/hooks/medicine-form",                    "@features/medicine"],
    ["@/constants/medicines",                    "@features/medicine"],

    // Patients
    ["@/store/usePatientStore",                  "@features/patients"],

    // Users management
    ["@/store/useUserStore",                     "@features/users-management"],
    ["@/store/useRoleStore",                     "@features/users-management"],

    // Settings / References
    ["@/store/useDegreeStore",                   "@features/settings"],
    ["@/store/usePaymentMethodStore",            "@features/settings"],
    ["@/store/useRegistrationInstitutionStore",  "@features/settings"],
    ["@/store/poliStore",                        "@features/settings"],
    ["@/store/departmentStore",                  "@features/settings"],
    ["@/store/usePolyOutPatientStore",           "@features/settings"],

    // Dashboard
    ["@/store/outpatientDashboardReportStore",   "@features/dashboard"],

    // EMR
    ["@/store/diagnoseStore",                    "@features/outpatient"],

    // Shared stores (UI global)
    ["@/store/useSidebarStore",                  "@shared/store"],
    ["@/store/useUIStore",                       "@shared/store"],
    ["@/store/loadingStore",                     "@shared/store"],
    ["@/store/useTenantStore",                   "@shared/store"],
    ["@/store/useModuleStore",                   "@shared/store"],
    ["@/store/usePricing",                       "@shared/store"],

    // Shared hooks
    ["@/hooks/usePermission",                    "@shared/hooks"],
    ["@/hooks/use-helpers",                      "@shared/hooks"],
    ["@/hooks/useImagePreview",                  "@shared/hooks"],
    ["@/hooks/use-mobile",                       "@shared/hooks"],
    ["@/hooks/user/useUserFormDataSync",         "@shared/hooks"],

    // Shared services
    ["@/services/apiCall",                       "@shared/services"],

    // Shared utils
    ["@/utils/calculateAge",                     "@shared/utils"],
    ["@/utils/formatDate",                       "@shared/utils"],
    ["@/utils/permissionCheck",                  "@shared/utils"],
    ["@/utils/medicines/skuGenerator",           "@shared/utils"],
    ["@/utils/user/formUtils",                   "@shared/utils"],

    // Shared constants
    ["@/constants/permissions",                  "@shared/constants"],

    // Shared middleware
    ["@/middleware/permissionMiddleware",         "@shared/middleware"],

    // Shared lib
    ["@/lib/utils",                              "@shared/lib"],
    ["@/lib/billingsdk-config",                  "@shared/lib"],
];

// ─── Helpers ───────────────────────────────────────────────────────────────
function getAllFiles(dir, files = []) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
            getAllFiles(full, files);
        } else if (EXT.has(extname(entry))) {
            files.push(full);
        }
    }
    return files;
}

function rewriteFile(filePath) {
    const original = readFileSync(filePath, "utf8");
    let content = original;
    const changes = [];

    for (const [oldPath, newPath] of IMPORT_MAP) {
        // Matches: "oldPath" | 'oldPath' | "oldPath.js" | "oldPath.jsx"
        const pattern = new RegExp(
            `(['"])(${escapeRegex(oldPath)}(?:\\.(?:js|jsx|ts|tsx))?)(['"])`,
            "g"
        );
        content = content.replace(pattern, (match, q1, captured, q3) => {
            const replacement = `${q1}${newPath}${q3}`;
            changes.push(`  ${captured}  →  ${newPath}`);
            return replacement;
        });
    }

    if (changes.length > 0) {
        console.log(`\n📄 ${filePath}`);
        changes.forEach((c) => console.log(c));
        if (!DRY_RUN) {
            writeFileSync(filePath, content, "utf8");
        }
    }
    return changes.length;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── Main ──────────────────────────────────────────────────────────────────
const files = getAllFiles(SRC_DIR);
let totalFiles = 0;
let totalChanges = 0;

for (const file of files) {
    const n = rewriteFile(file);
    if (n > 0) {
        totalFiles++;
        totalChanges += n;
    }
}

console.log(`\n${"─".repeat(60)}`);
console.log(DRY_RUN ? "🔍 DRY RUN — tidak ada file yang ditulis" : "✅ Migrasi selesai");
console.log(`   ${totalFiles} file diubah, ${totalChanges} import di-rewrite`);
if (DRY_RUN) {
    console.log('\n   Jalankan tanpa --dry-run untuk apply perubahan:');
    console.log('   node migrate-imports.js');
}
