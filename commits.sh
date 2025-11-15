#!/bin/bash

# Ruta del repositorio (cambia si tu proyecto está en otra carpeta)
REPO_PATH="/Users/patriciogauna/Documents/GitHub/TallerObligatorio2"

cd "$REPO_PATH" || exit

# Verificar si hay cambios pendientes
CHANGES=$(git status --porcelain)

if [ -z "$CHANGES" ]; then
    echo "⚠ No se detectaron cambios para commitear."

    echo "- $(date '+%Y-%m-%d %H:%M:%S') → No hubo cambios esta semana." >> README.md

    exit 1
else
    echo "🔧 Detectando cambios y generando commit automático..."

    # Contar líneas agregadas y removidas
    STATS=$(git diff --shortstat)

    # Agregar todos los cambios
    git add .

    # Commit automático con fecha
    git commit -m "Commit automático semanal - $(date '+%Y-%m-%d')"

    # Push al repositorio remoto
    git push

    echo "Cambios enviados exitosamente."

    # Guardar en README.md
    echo "- $(date '+%Y-%m-%d %H:%M:%S') → $STATS" >> README.md
fi