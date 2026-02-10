// Available unit options
export const UNIT_OPTIONS = [
    {value: "tablet", label: "Tablet"},
    {value: "vial", label: "Vial"},
    {value: "ampul", label: "Ampul"},
    {value: "botol", label: "Botol"},
    {value: "box", label: "Box"},
    {value: "pcs", label: "Pcs"},
    {value: "strip", label: "Strip"},
    {value: "sachet", label: "Sachet"},
    {value: "tube", label: "Tube"},
    {value: "pot", label: "Pot"}
];

/**
 * Get available units for a specific row, excluding already used units
 */
export function getAvailableUnitsForRow(units, rowIndex) {
    if (!units || units.length === 0) return UNIT_OPTIONS;

    const usedUnits = units
        .map((unit, index) => index !== rowIndex ? unit.unit_name : null)
        .filter(Boolean);

    return UNIT_OPTIONS.filter(option => !usedUnits.includes(option.value));
}

/**
 * Add a new unit to the units array
 */
export function addNewUnit(currentUnits) {
    return [
        ...currentUnits,
        {unit_name: "", multiplier: 2}
    ];
}

/**
 * Remove a unit from the units array
 */
export function removeUnit(currentUnits, index) {
    return currentUnits.filter((_, i) => i !== index);
}

/**
 * Update unit name at specific index
 */
export function updateUnitName(currentUnits, index, value) {
    const updated = [...currentUnits];
    updated[index] = {
        ...updated[index],
        unit_name: value
    };
    return updated;
}

/**
 * Update unit multiplier at specific index
 */
export function updateUnitMultiplier(currentUnits, index, value) {
    const updated = [...currentUnits];
    updated[index] = {
        ...updated[index],
        multiplier: Number(value) || 1
    };
    return updated;
}

/**
 * Reindex errors after removing a unit
 */
export function reindexUnitErrors(errors, removedIndex) {
    const newErrors = {...errors};
    delete newErrors[removedIndex];

    const reindexed = {};
    Object.keys(newErrors).forEach(key => {
        const keyNum = Number(key);
        if (keyNum > removedIndex) {
            reindexed[keyNum - 1] = newErrors[key];
        } else {
            reindexed[key] = newErrors[key];
        }
    });

    return reindexed;
}