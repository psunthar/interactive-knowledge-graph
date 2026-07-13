#!/usr/bin/env bash
set -euo pipefail

# Render every Mermaid source (*.mmd) in a directory to an image using mermaid-cli
# (mmdc). Prefers a local `mmdc`; falls back to the minlag/mermaid-cli container
# image via podman (rootless, preferred) or docker.
#
# Usage:
#   tools/render-mermaid.sh                        # PNG for examples/fcos/diagrams/*.mmd
#   tools/render-mermaid.sh path/to/diagrams       # a different directory
#   tools/render-mermaid.sh path/to/diagrams svg   # SVG instead of PNG
#   BG=transparent SCALE=2 tools/render-mermaid.sh path/to/diagrams
#
# Args: $1 = directory of .mmd (default examples/fcos/diagrams), $2 = format.
# Env: FORMAT (png|svg|pdf, default png), BG (default white), SCALE (default 3).

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMG_DIR="${1:-${ROOT}/examples/fcos/diagrams}"
FORMAT="${2:-${FORMAT:-png}}"
BG="${BG:-white}"
SCALE="${SCALE:-3}"
# Pin a tag that bundles a system Chromium at /usr/lib/chromium/chromium.
# (':latest' has shipped without a browser and fails with "Could not find Chrome".)
CLI_IMAGE="docker.io/minlag/mermaid-cli:11.4.2"
CLI_CHROMIUM="/usr/lib/chromium/chromium"

shopt -s nullglob
sources=("${IMG_DIR}"/*.mmd)
if [[ ${#sources[@]} -eq 0 ]]; then
  echo "No .mmd files in ${IMG_DIR}" >&2
  exit 1
fi

# Pick an engine once. mmdc (native) beats a container; podman (rootless) beats docker.
ENGINE=""
if command -v mmdc >/dev/null 2>&1; then ENGINE="mmdc"
elif command -v podman >/dev/null 2>&1; then ENGINE="podman"
elif command -v docker >/dev/null 2>&1; then ENGINE="docker"
else
  echo "Need 'mmdc' (npm i -g @mermaid-js/mermaid-cli) or podman/docker." >&2
  exit 1
fi
echo "engine: ${ENGINE}"

# Containerized Chromium needs --no-sandbox; write a transient puppeteer config.
PCONF=""
cleanup() { [[ -n "${PCONF}" ]] && rm -f "${PCONF}"; }
trap cleanup EXIT

render() {
  local src="$1" out="$2"
  if [[ "${ENGINE}" == "mmdc" ]]; then
    mmdc -i "$src" -o "$out" -b "$BG" -s "$SCALE"
    return
  fi
  if [[ -z "${PCONF}" ]]; then
    PCONF="${IMG_DIR}/.puppeteer.json"
    printf '{ "args": ["--no-sandbox", "--disable-gpu"] }\n' > "${PCONF}"
  fi
  # --user 0: rootless podman/docker maps container-root to the invoking uid, so
  # generated images are owned by us (not a subuid). Chromium path pinned via env.
  "${ENGINE}" run --rm --security-opt seccomp=unconfined --user 0 \
    -e "PUPPETEER_EXECUTABLE_PATH=${CLI_CHROMIUM}" \
    -v "${IMG_DIR}:/data:Z" -w /data "${CLI_IMAGE}" \
    -p ".puppeteer.json" -i "$(basename "$src")" -o "$(basename "$out")" -b "$BG" -s "$SCALE"
}

for src in "${sources[@]}"; do
  base="$(basename "${src%.mmd}")"
  out="${IMG_DIR}/${base}.${FORMAT}"
  echo "-> ${out}"
  render "$src" "$out"
done

echo "Rendered ${#sources[@]} diagram(s) to ${IMG_DIR}/*.${FORMAT}"
