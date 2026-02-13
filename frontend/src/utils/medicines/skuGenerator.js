/**
 * Generate unique SKU for medicine
 * Format: MED-YYYYMMDD-XXXXX
 * Example: MED-20250212-00001
 */
export function generateMedicineSKU() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Generate random 5-digit number
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');

    return `MED-${year}${month}${day}-${random}`;
}

/**
 * Generate SKU with custom prefix
 * @param {string} prefix - Custom prefix (default: "MED")
 * @param {number} existingCount - Number of existing medicines (for sequential ID)
 */
export function generateSKUWithPrefix(prefix = "MED", existingCount = 0) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Use sequential number based on existing count
    const sequential = String(existingCount + 1).padStart(5, '0');

    return `${prefix}-${year}${month}${day}-${sequential}`;
}

/**
 * Generate simple sequential SKU
 * Format: MED-00001, MED-00002, etc.
 */
export function generateSequentialSKU(lastSKU) {
    if (!lastSKU) {
        return "MED-00001";
    }

    // Extract number from last SKU (e.g., "MED-00001" -> 1)
    const match = lastSKU.match(/MED-(\d+)/);
    if (!match) {
        return "MED-00001";
    }

    const lastNumber = parseInt(match[1], 10);
    const nextNumber = lastNumber + 1;

    return `MED-${String(nextNumber).padStart(5, '0')}`;
}

/**
 * Validate SKU format
 * @param {string} sku - SKU to validate
 * @returns {boolean} - True if valid
 */
export function isValidSKU(sku) {
    if (!sku || typeof sku !== 'string') return false;

    // Check format: MED-YYYYMMDD-XXXXX or MED-XXXXX
    const pattern1 = /^MED-\d{8}-\d{5}$/; // MED-20250212-00001
    const pattern2 = /^MED-\d{5}$/; // MED-00001

    return pattern1.test(sku) || pattern2.test(sku);
}