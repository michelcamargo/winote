# Scripts - CI/CD e Build

## Requisitos para build iOS

Para compilar o app iOS e instalar no iPhone, você precisa de:

| Recurso | Custo | Necessário para |
|---------|-------|----------------|
| Expo account | Gratuito | EAS Build, GitHub Actions |
| Apple ID (gratuita) | Gratuito | Build local via Xcode (expira em 7 dias) |
| Apple Developer ($99/ano) | Pago | EAS Build, distribuição sem expiração |

---

## Opcao A: EAS Build (GitHub Actions)

### Setup inicial

1. **Criar conta Expo:** https://expo.dev/signup
2. **Criar token de acesso:** https://expo.dev/settings/access-tokens
3. **Adicionar ao GitHub Secrets:**
   - Repositorio no GitHub > Settings > Secrets and variables > Actions
   - Add `EXPO_TOKEN` com o token gerado

### Executar o workflow

1. Faca push do codigo para o GitHub
2. Va em Actions > iOS Build > Run workflow
3. Selecione o profile (development, simulator, production)
4. Apos a build, baixe o .ipa nos artifacts

### Instalar o .ipa no iPhone

Apos baixar o .ipa:

- **Sem Mac:** Use **AltStore** (https://altstore.io) no Windows para sideload
- **Com Mac:** Abra o Xcode > Devices > arraste o .ipa

---

## Opcao B: Build Local (macOS + Xcode, Apple ID gratuita)

Se voce tiver acesso a um Mac:

```bash
chmod +x scripts/build-local-macos.sh
./scripts/build-local-macos.sh
```

Depois:
1. Abra `ios/winote.xcworkspace` no Xcode
2. Selecione seu iPhone como destino
3. Clique em Play (build)

> Com Apple ID gratuita, o app expira em 7 dias.
> Para remover o limite, precise da Apple Developer ($99/ano).

---

## Opcao C: Expo Go (teste rapido, sem build)

```bash
npx expo start
```

Escaneie o QR code com o iPhone (mesma rede WiFi).
