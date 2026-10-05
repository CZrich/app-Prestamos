# Tupper Tracker

## Dependencias

- Node.js
- npm
- Expo Go, emulador o navegador para ejecutar la aplicación

Instala las dependencias:

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` a partir de `.env.example` y configura estas variables:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

## Ejecución

```bash
npm start
```

También puedes iniciar una plataforma específica:

```bash
npm run android
npm run ios
npm run web
```
