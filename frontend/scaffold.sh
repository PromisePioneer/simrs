#!/bin/bash
# scaffold.sh — buat struktur folder feature-based dari nol
# Jalankan dari root frontend: bash scaffold.sh

set -e

FEATURES=(
  auth
  outpatient
  inpatient
  medicine
  patients
  users-management
  facilities
  emr
  settings
  dashboard
)

SUBDIRS=(components hooks store pages routes constants)

SHARED_SUBDIRS=(
  "components/ui"
  "components/common"
  "hooks"
  "store"
  "utils"
  "services"
  "lib"
  "constants"
  "middleware"
)

echo "📁 Membuat shared/..."
for sub in "${SHARED_SUBDIRS[@]}"; do
  mkdir -p "src/shared/$sub"
done

echo "📁 Membuat features/..."
for feature in "${FEATURES[@]}"; do
  for sub in "${SUBDIRS[@]}"; do
    mkdir -p "src/features/$feature/$sub"
  done
  # Buat index.js kosong sebagai placeholder barrel export
  touch "src/features/$feature/index.js"
done

echo ""
echo "✅ Struktur folder berhasil dibuat:"
find src/shared src/features -type d | sort
