#!/bin/bash

REPO_PATH="/Users/patriciogauna/Documents/GitHub/TallerObligatorio2"
cd "$REPO_PATH" || exit

# Verificar si hay cambios pendientes antes de agregar nada
CHANGES=$(git diff --shortstat)

if [ -z "$CHANGES" ]; then
    echo "⚠ No se detectaron cambios para commitear."

    echo "- $(date '+%Y-%m-%d %H:%M:%S') → No se realizaron modificaciones esta semana." >> README.md

    exit 1
fi

echo "🔧 Detectando cambios y generando commit automático..."

# Guardar estadísticas ANTES del README
STATS="$CHANGES"

git checkout Dev

# Agregar cambios del usuario
git add .

# Commit automático
git commit -m "Commit automático semanal - $(date '+%Y-%m-%d')"

# Push
git push

echo "Cambios enviados exitosamente."

# Registrar en README de forma clara
echo "- $(date '+%Y-%m-%d %H:%M:%S') → Cambios realizados: $STATS" >> README.md