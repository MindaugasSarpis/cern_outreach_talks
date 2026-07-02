#!/usr/bin/env bash
# Build all tikz-feynman diagrams: .tex -> PDF (lualatex) -> SVG + 600 DPI PNG (pdftocairo).
# Usage:
#   ./build.sh                # build everything (diagrams/*.tex + full.tex)
#   ./build.sh dirac          # build a single diagram by stem
#   ./build.sh full           # build only the composite figure

set -euo pipefail

cd "$(dirname "$0")"

OUT_PDF=out/pdf
OUT_SVG=out/svg
OUT_PNG=out/png
mkdir -p "$OUT_PDF" "$OUT_SVG" "$OUT_PNG"

build_one() {
    local tex="$1"
    local stem
    stem=$(basename "$tex" .tex)
    local dir
    dir=$(dirname "$tex")

    echo "==> $stem"
    local abs_out
    abs_out="$(pwd)/$OUT_PDF"
    # lualatex needs to run in the source dir so relative \input{../common.tex} resolves
    (cd "$dir" && lualatex -interaction=nonstopmode -halt-on-error \
        -output-directory="$abs_out" \
        "$(basename "$tex")" >/dev/null) || {
            echo "  ! lualatex failed for $stem"
            return 1
        }

    # Clean up aux files in OUT_PDF
    rm -f "$OUT_PDF/$stem.aux" "$OUT_PDF/$stem.log"

    # PDF -> SVG (vector)
    pdftocairo -svg "$OUT_PDF/$stem.pdf" "$OUT_SVG/$stem.svg"

    # PDF -> PNG (600 DPI raster)
    pdftocairo -png -r 600 -singlefile "$OUT_PDF/$stem.pdf" "$OUT_PNG/$stem"
}

if [ $# -eq 0 ]; then
    targets=()
    for f in diagrams/*.tex; do
        [ -e "$f" ] || continue
        targets+=("$f")
    done
    [ -f full.tex ] && targets+=("full.tex")
    for t in "${targets[@]}"; do
        build_one "$t"
    done
else
    for stem in "$@"; do
        if [ -f "diagrams/${stem}.tex" ]; then
            build_one "diagrams/${stem}.tex"
        elif [ -f "${stem}.tex" ]; then
            build_one "${stem}.tex"
        else
            echo "  ! no source for '$stem'"
            exit 1
        fi
    done
fi

echo "Done. Outputs in $OUT_PDF, $OUT_SVG, $OUT_PNG."
