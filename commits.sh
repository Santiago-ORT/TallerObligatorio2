#!/bin/bash

REPO_PATH="/Users/patriciogauna/Documents/GitHub/TallerObligatorio2"
cd "$REPO_PATH" || exit

# Verificar si hay cambios pendientes antes de agregar nada
CHANGES=$(git diff --shortstat)

if [ -z "$CHANGES" ]; then
    echo "No se detectaron cambios para commitear."

    echo "- $(date '+%Y-%m-%d %H:%M:%S') → No se realizaron modificaciones esta semana." >> README.md

    exit 1
fi

echo "Detectando cambios y generando commit automático..."


STATS="$CHANGES"

git checkout Dev


git add .


git commit -m "Commit automático semanal - $(date '+%Y-%m-%d')"


git push

echo "Cambios enviados exitosamente."


echo "- $(date '+%Y-%m-%d %H:%M:%S') → Cambios realizados: $STATS" >> README.md