#!/bin/bash
# =============================================================================
# Winote — Build iOS Local (macOS + Xcode)
# =============================================================================
# Este script compila o app diretamente no macOS sem EAS Build.
# Requer: macOS, Xcode 15+, Apple ID gratuita
#
# Como usar:
#   1. ./scripts/build-local-macos.sh
#   2. O .app sera gerado em ios/build/ ou via Xcode
#
# Nota: Com Apple ID gratuita, o app expira em 7 dias.
#       Para remover o limite, e necessaria conta Apple Developer ($99/ano).
# =============================================================================

set -euo pipefail

echo "=== Winote: iOS Build Local ==="

# 1. Instalar dependencias
echo "==> Instalando dependencias..."
npm install

# 2. Gerar projeto nativo iOS
echo "==> Gerando projeto nativo iOS..."
npx expo prebuild -p ios --clean

# 3. Build com Xcode
echo "==> Compilando com Xcode..."
cd ios
xcodebuild \
  -workspace winote.xcworkspace \
  -scheme winote \
  -configuration Debug \
  -destination 'generic/platform=iOS' \
  -archivePath build/winote.xcarchive \
  archive

# 4. Exportar .ipa
echo "==> Exportando .ipa..."
xcodebuild \
  -exportArchive \
  -archivePath build/winote.xcarchive \
  -exportPath build/ \
  -exportOptionsPlist ExportOptions.plist

echo "=== Build concluido! .ipa em: ios/build/winote.ipa ==="
