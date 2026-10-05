# UNIVERSIDAD NACIONAL DE SAN AGUSTÍN

## FACULTAD DE INGENIERÍA DE PRODUCCIÓN Y SERVICIOS

## ESCUELA PROFESIONAL DE INGENIERÍA DE SISTEMAS

<br>

### PLATAFORMAS EMERGENTES (E)

### LABORATORIO 3: DESARROLLO DE APLICACIONES MÓVILES WEB

<br>

# PRESTACOSAS

## Aplicación web móvil para la gestión de préstamos personales

<br>

| Dato | Información |
|---|---|
| Docente | M. Sc. Ing. R. Fabrizio Calienes Rodríguez |
| Integrantes | [AGREGAR NOMBRES Y CÓDIGOS] |
| Curso | Plataformas Emergentes (E) |
| Grupo | [AGREGAR GRUPO] |
| Fecha | [AGREGAR FECHA DE ENTREGA] |
| Ciudad | Arequipa, Perú |

> **Espacio para el logotipo de la universidad**

---

# Resumen

PrestaCosas es una aplicación web móvil orientada a la administración de objetos prestados. Su propósito es resolver un problema cotidiano: olvidar qué objeto se entregó, quién lo recibió, cuándo se realizó el préstamo y si ya fue devuelto. La aplicación permite registrar esta información junto con el número de contacto y una fotografía del objeto, consultar los préstamos pendientes, marcarlos como devueltos, eliminarlos y enviar un recordatorio mediante WhatsApp.

La solución fue desarrollada con React Native y Expo, tecnologías que permiten compartir una misma base de código entre aplicaciones web y móviles. Supabase se utiliza para la autenticación de usuarios y la persistencia de datos en PostgreSQL. Cada préstamo se relaciona con el usuario que lo creó y las políticas Row Level Security garantizan que una persona solamente pueda consultar o modificar sus propios registros. Cloudinary se utiliza para almacenar las imágenes seleccionadas desde el dispositivo.

El resultado es una aplicación responsive, minimalista y de aprendizaje rápido que integra autenticación, autorización mediante JWT, persistencia remota, carga de archivos y comunicación con una aplicación externa.

**Palabras clave:** aplicación web móvil, React Native, Expo, Supabase, Cloudinary, autenticación, JWT, préstamos.

---

# Índices

## Índice de contenido

1. [Descripción general del proyecto](#1-descripción-general-del-proyecto)
2. [Problema identificado](#2-problema-identificado)
3. [Objetivos](#3-objetivos)
4. [Alcance](#4-alcance)
5. [Tecnologías utilizadas](#5-tecnologías-utilizadas)
6. [Arquitectura de la solución](#6-arquitectura-de-la-solución)
7. [Modelo de datos](#7-modelo-de-datos)
8. [Funcionalidades](#8-funcionalidades)
9. [Proceso de desarrollo](#9-proceso-de-desarrollo)
10. [Interfaces de la aplicación](#10-interfaces-de-la-aplicación)
11. [Seguridad](#11-seguridad)
12. [Pruebas y validación](#12-pruebas-y-validación)
13. [Dificultades y soluciones](#13-dificultades-y-soluciones)
14. [Lecciones aprendidas](#14-lecciones-aprendidas)
15. [Conclusiones](#15-conclusiones)
16. [Recomendaciones y trabajo futuro](#16-recomendaciones-y-trabajo-futuro)
17. [Anexos](#17-anexos)
18. [Referencias](#18-referencias)
19. [Registro de cambios](#19-registro-de-cambios)

## Índice de imágenes

| N.° | Imagen | Sección |
|---:|---|---|
| 1 | Pantalla de bienvenida | 10.1 |
| 2 | Pantalla de inicio de sesión | 10.2 |
| 3 | Pantalla de creación de cuenta | 10.3 |
| 4 | Confirmación de correo electrónico | 10.4 |
| 5 | Pantalla principal de préstamos | 10.5 |
| 6 | Selección y vista previa de imagen | 10.6 |
| 7 | Préstamo registrado | 10.7 |
| 8 | Préstamo marcado como devuelto | 10.8 |
| 9 | Recordatorio mediante WhatsApp | 10.9 |
| 10 | Datos almacenados en Supabase | 10.10 |
| 11 | Imágenes almacenadas en Cloudinary | 10.11 |

## Índice de tablas

| N.° | Tabla | Sección |
|---:|---|---|
| 1 | Datos de presentación | Carátula |
| 2 | Tecnologías utilizadas | 5 |
| 3 | Componentes de la arquitectura | 6 |
| 4 | Entidad `profiles` | 7.1 |
| 5 | Entidad `prestamos` | 7.2 |
| 6 | Funcionalidades implementadas | 8 |
| 7 | Pruebas realizadas | 12 |
| 8 | Dificultades y soluciones | 13 |
| 9 | Enlaces del proyecto | 17.1 |
| 10 | Registro de cambios | 19 |

---

# 1. Descripción general del proyecto

PrestaCosas es una aplicación web móvil que permite registrar y controlar préstamos personales de objetos. Está dirigida a usuarios que prestan herramientas, recipientes, libros, dispositivos u otros artículos y necesitan conservar un registro accesible desde el navegador o un dispositivo móvil.

Cada usuario dispone de una cuenta privada. Después de iniciar sesión puede registrar un préstamo indicando la persona receptora, su contacto, el objeto prestado y una fotografía opcional. Posteriormente puede consultar el registro, enviar un recordatorio por WhatsApp, marcar el objeto como devuelto o eliminar el préstamo.

La interfaz se diseñó siguiendo un enfoque mobile first. Los formularios y controles se presentan en una sola columna, con botones visibles, textos breves y una jerarquía visual clara. La aplicación también puede ejecutarse en navegadores de escritorio conservando una presentación similar a la de un dispositivo móvil.

# 2. Problema identificado

Los préstamos informales suelen registrarse de memoria o mediante mensajes dispersos. Esto ocasiona dificultades como:

- Olvidar qué objeto fue prestado.
- No recordar la fecha del préstamo.
- Perder el número de contacto de la persona receptora.
- No distinguir entre objetos pendientes y devueltos.
- No disponer de evidencia visual del objeto.
- Mantener información desorganizada en diferentes aplicaciones.

PrestaCosas centraliza estos datos y reduce la dependencia de la memoria. La aplicación convierte una actividad informal en un proceso sencillo y trazable.

# 3. Objetivos

## 3.1 Objetivo general

Desarrollar una aplicación web móvil que permita gestionar préstamos personales mediante una interfaz simple, persistencia remota, autenticación de usuarios y almacenamiento de imágenes.

## 3.2 Objetivos específicos

- Implementar el registro y el inicio de sesión mediante Supabase Auth.
- Relacionar cada préstamo con el usuario autenticado.
- Permitir la creación, consulta, actualización y eliminación de préstamos.
- Registrar datos de la persona receptora, contacto, objeto, fecha, estado e imagen.
- Almacenar los datos en PostgreSQL mediante Supabase.
- Almacenar las imágenes en Cloudinary.
- Restringir el acceso mediante JWT y políticas Row Level Security.
- Facilitar el envío de recordatorios mediante WhatsApp.
- Proporcionar una interfaz responsive y de fácil aprendizaje.

# 4. Alcance

La versión desarrollada contempla:

- Aplicación web responsive ejecutada con Expo Web.
- Compatibilidad del código con Android e iOS mediante React Native y Expo.
- Autenticación por correo electrónico y contraseña.
- Confirmación de cuenta mediante correo electrónico, según la configuración de Supabase.
- Persistencia de sesiones en el dispositivo.
- Gestión privada de préstamos por usuario.
- Carga de una fotografía por préstamo.
- Integración con WhatsApp mediante enlaces externos.

No se incluyeron en esta versión notificaciones automáticas, recuperación de contraseña desde la interfaz, edición completa del préstamo, eliminación automática de imágenes en Cloudinary ni publicación en tiendas móviles.

# 5. Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
|---|---|
| React 19 | Construcción declarativa de las interfaces. |
| React Native 0.86 | Componentes compatibles con web y plataformas móviles. |
| Expo SDK 57 | Entorno de desarrollo, compilación y ejecución multiplataforma. |
| TypeScript | Tipado estático de entidades, propiedades y funciones. |
| Expo Image Picker | Selección de imágenes desde el dispositivo. |
| Expo SQLite | Persistencia local de la sesión de autenticación. |
| Supabase Auth | Registro, inicio de sesión, cierre de sesión y emisión de JWT. |
| Supabase PostgreSQL | Persistencia remota de perfiles y préstamos. |
| Supabase Row Level Security | Autorización y aislamiento de datos por usuario. |
| Cloudinary | Almacenamiento y entrega de imágenes. |
| WhatsApp URL Scheme | Apertura de mensajes de recordatorio. |
| Git | Control de versiones del código fuente. |

# 6. Arquitectura de la solución

La aplicación sigue una arquitectura cliente-servidor basada en servicios administrados. El cliente contiene las pantallas y la lógica de interacción, mientras que Supabase y Cloudinary administran los datos remotos.

| Componente | Responsabilidad |
|---|---|
| `App.tsx` | Recupera la sesión y decide si muestra autenticación o préstamos. |
| `AuthScreen` | Presenta la bienvenida y permite seleccionar registro o login. |
| `LoginScreen` | Autentica una cuenta existente. |
| `SignUpScreen` | Registra una cuenta y valida la confirmación de contraseña. |
| `LoansScreen` | Gestiona préstamos, imágenes, estados y recordatorios. |
| Cliente Supabase | Conserva la sesión y adjunta el JWT a las solicitudes. |
| PostgreSQL + RLS | Almacena datos y aplica autorización en el servidor. |
| Cloudinary Upload API | Recibe y almacena las imágenes. |

## 6.1 Flujo de autenticación

1. El usuario introduce su correo y contraseña.
2. Supabase valida las credenciales.
3. Supabase entrega una sesión que contiene un JWT.
4. La sesión se conserva localmente mediante Expo SQLite.
5. El cliente adjunta automáticamente el JWT a las consultas.
6. PostgreSQL utiliza `auth.uid()` para identificar al usuario.
7. Las políticas RLS permiten operar únicamente sobre sus registros.

## 6.2 Flujo de registro de un préstamo

1. El usuario completa persona, contacto y objeto.
2. Opcionalmente selecciona una fotografía.
3. La imagen se convierte a `Blob` en web o a un descriptor de archivo en móvil.
4. Cloudinary almacena la imagen y devuelve una URL segura.
5. La aplicación inserta el préstamo en Supabase con el `owner_id` del usuario.
6. La política RLS verifica que `owner_id` coincida con `auth.uid()`.
7. El préstamo se incorpora a la lista visible.

# 7. Modelo de datos

Supabase administra internamente la tabla `auth.users`. El proyecto añade las entidades públicas `profiles` y `prestamos`.

## 7.1 Entidad `profiles`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Clave primaria y referencia a `auth.users.id`. |
| `email` | Texto | Correo de la cuenta. |
| `display_name` | Texto nullable | Nombre visible opcional. |
| `created_at` | Timestamp | Fecha de creación del perfil. |

El perfil se crea automáticamente mediante un trigger cuando Supabase registra un usuario.

## 7.2 Entidad `prestamos`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único del préstamo. |
| `owner_id` | UUID | Usuario propietario del registro. |
| `persona` | Texto | Persona que recibió el objeto. |
| `contacto` | Texto | Número utilizado para el recordatorio. |
| `objeto` | Texto | Descripción del objeto prestado. |
| `fecha` | Timestamp | Fecha y hora del préstamo. |
| `imagen_url` | Texto nullable | URL segura de Cloudinary. |
| `estado` | Texto | Estado `activo` o `devuelto`. |
| `created_at` | Timestamp | Fecha de creación del registro. |

## 7.3 Relaciones

- `auth.users` mantiene una relación uno a uno con `profiles`.
- `auth.users` mantiene una relación uno a muchos con `prestamos`.
- La eliminación de un usuario elimina en cascada su perfil y sus préstamos.

# 8. Funcionalidades

| Funcionalidad | Descripción | Estado |
|---|---|---|
| Crear cuenta | Registra al usuario con email y contraseña. | Implementada |
| Iniciar sesión | Valida credenciales mediante Supabase Auth. | Implementada |
| Persistir sesión | Conserva la sesión al recargar la aplicación. | Implementada |
| Cerrar sesión | Elimina la sesión local activa. | Implementada |
| Listar préstamos | Recupera únicamente los registros del usuario. | Implementada |
| Registrar préstamo | Almacena persona, contacto, objeto, fecha y estado. | Implementada |
| Adjuntar imagen | Selecciona y sube una fotografía a Cloudinary. | Implementada |
| Marcar como devuelto | Cambia el estado de `activo` a `devuelto`. | Implementada |
| Eliminar préstamo | Borra permanentemente un registro confirmado. | Implementada |
| Recordatorio por WhatsApp | Abre un mensaje con los datos del préstamo. | Implementada |
| Aislamiento de usuarios | Protege los datos mediante JWT y RLS. | Implementada |
| Diseño responsive | Adapta la interfaz a móvil y navegador web. | Implementada |

# 9. Proceso de desarrollo

## 9.1 Análisis del problema

Se identificaron los datos mínimos necesarios para representar un préstamo: persona, contacto, objeto, fecha, fotografía y estado. Luego se determinó que cada préstamo debía pertenecer a una cuenta para evitar que distintos usuarios compartieran información.

## 9.2 Prototipo inicial

La primera versión concentraba la interfaz y las operaciones CRUD en un solo componente. Permitió validar el registro, la visualización y la modificación de préstamos, además de comprobar la integración inicial con Supabase y Cloudinary.

## 9.3 Incorporación de autenticación

Se implementó Supabase Auth con correo y contraseña. La aplicación recupera la sesión al iniciar y escucha los cambios de autenticación. La pantalla principal solamente se muestra cuando existe una sesión válida.

## 9.4 Separación de interfaces

Para reducir la confusión del usuario se dividió la autenticación en tres vistas:

- Pantalla de bienvenida.
- Pantalla de inicio de sesión.
- Pantalla de creación de cuenta.

La creación de cuenta incluye validación de campos, longitud mínima y confirmación de contraseña.

## 9.5 Autorización y persistencia

Se creó una migración SQL con las tablas, relaciones, índices, trigger y políticas RLS. Aunque el cliente filtra por `owner_id`, la autorización se ejecuta en PostgreSQL para impedir accesos manipulados desde herramientas externas.

## 9.6 Integración con Cloudinary

Se configuró un upload preset unsigned restringido. En web, la imagen seleccionada se convierte en un `Blob` antes de enviarse mediante `FormData`. En plataformas nativas se utiliza el descriptor compatible con React Native.

## 9.7 Validación técnica

Durante el desarrollo se utilizaron las siguientes verificaciones:

```bash
npx tsc --noEmit
npx expo-doctor
npx expo export --platform web
```

Estas verificaciones permitieron corregir incompatibilidades de dependencias, problemas de tipado y errores de generación de la versión web.

# 10. Interfaces de la aplicación

> Reemplazar cada marcador con una captura propia. Mantener el título y el pie de figura para construir el índice de imágenes en el documento DOCX.

## 10.1 Pantalla de bienvenida

Presenta el propósito de la aplicación y separa claramente las acciones de iniciar sesión y crear una cuenta.

**[INSERTAR CAPTURA 1: PANTALLA DE BIENVENIDA]**

*Figura 1. Pantalla inicial de PrestaCosas.*

## 10.2 Pantalla de inicio de sesión

Solicita correo y contraseña. Los errores de credenciales o conexión se muestran dentro de la interfaz.

**[INSERTAR CAPTURA 2: INICIO DE SESIÓN]**

*Figura 2. Formulario de inicio de sesión.*

## 10.3 Pantalla de creación de cuenta

Solicita correo, contraseña y confirmación. La aplicación valida que ambas contraseñas coincidan.

**[INSERTAR CAPTURA 3: CREACIÓN DE CUENTA]**

*Figura 3. Formulario de registro de usuario.*

## 10.4 Confirmación de correo electrónico

Cuando la confirmación está activada en Supabase, el usuario recibe un mensaje para validar su dirección antes de ingresar.

**[INSERTAR CAPTURA 4: CORREO DE CONFIRMACIÓN]**

*Figura 4. Confirmación de la cuenta mediante correo electrónico.*

## 10.5 Pantalla principal de préstamos

Muestra la cuenta activa, el formulario de registro, la lista privada y la acción para cerrar sesión.

**[INSERTAR CAPTURA 5: PANTALLA PRINCIPAL]**

*Figura 5. Formulario y listado de préstamos.*

## 10.6 Selección de imagen

El usuario puede elegir una imagen y revisar su vista previa antes de registrar el préstamo.

**[INSERTAR CAPTURA 6: SELECCIÓN Y VISTA PREVIA]**

*Figura 6. Fotografía seleccionada para un préstamo.*

## 10.7 Préstamo registrado

El registro muestra el objeto, la persona, la fecha, el estado y la fotografía.

**[INSERTAR CAPTURA 7: PRÉSTAMO REGISTRADO]**

*Figura 7. Préstamo activo almacenado correctamente.*

## 10.8 Préstamo devuelto

Al confirmar la devolución, la tarjeta cambia de apariencia y deja de mostrar las acciones correspondientes a un préstamo pendiente.

**[INSERTAR CAPTURA 8: PRÉSTAMO DEVUELTO]**

*Figura 8. Cambio de estado del préstamo.*

## 10.9 Recordatorio mediante WhatsApp

La aplicación construye un mensaje con la persona, el objeto y la fecha, y abre WhatsApp para que el usuario decida enviarlo.

**[INSERTAR CAPTURA 9: MENSAJE DE WHATSAPP]**

*Figura 9. Recordatorio generado desde la aplicación.*

## 10.10 Persistencia en Supabase

**[INSERTAR CAPTURA 10: TABLAS PROFILES Y PRESTAMOS EN SUPABASE]**

*Figura 10. Registros persistidos en PostgreSQL mediante Supabase.*

## 10.11 Almacenamiento en Cloudinary

**[INSERTAR CAPTURA 11: IMAGEN EN CLOUDINARY]**

*Figura 11. Recurso almacenado en Cloudinary.*

# 11. Seguridad

## 11.1 Autenticación

Las contraseñas no se almacenan en tablas creadas por la aplicación. Supabase Auth administra las credenciales y entrega tokens de sesión. La aplicación utiliza una clave pública, nunca la clave `service_role`.

## 11.2 Autorización mediante JWT y RLS

El JWT identifica al usuario que realiza cada operación. Las políticas RLS comparan `auth.uid()` con `owner_id`. Se definieron políticas independientes para lectura, inserción, actualización y eliminación.

## 11.3 Variables de entorno

Las URLs y claves públicas se almacenan en variables `EXPO_PUBLIC_*`. Estas variables son visibles en el cliente y, por ello, solamente deben contener identificadores públicos. Los secretos administrativos de Supabase y Cloudinary no deben incluirse en el frontend.

## 11.4 Carga de imágenes

La carga directa utiliza un preset unsigned porque el navegador no puede generar una firma sin exponer el secreto de Cloudinary. Para reducir riesgos, el preset debe restringir formatos, tamaño máximo, carpeta y parámetros permitidos. Una evolución futura puede generar firmas en una Supabase Edge Function.

# 12. Pruebas y validación

| Prueba | Resultado esperado | Resultado obtenido |
|---|---|---|
| Registro de usuario | Crear una cuenta o solicitar confirmación de correo. | Correcto |
| Inicio de sesión válido | Mostrar la pantalla de préstamos. | Correcto |
| Inicio de sesión inválido | Mostrar un error sin bloquear la interfaz. | Correcto |
| Persistencia de sesión | Mantener la sesión después de recargar. | Correcto |
| Registro sin campos | Impedir la operación y mostrar validación. | Correcto |
| Registro con imagen | Subir la imagen y guardar su URL. | Correcto |
| Marcar devolución | Actualizar el estado en interfaz y base de datos. | Correcto |
| Eliminar préstamo | Solicitar confirmación y eliminar el registro. | Correcto |
| Aislamiento entre usuarios | Impedir ver o modificar préstamos ajenos. | Correcto |
| TypeScript | Compilar sin errores mediante `tsc --noEmit`. | Correcto |
| Expo Doctor | Superar las 21 verificaciones del proyecto. | Correcto |
| Exportación web | Generar el bundle web sin errores. | Correcto |

# 13. Dificultades y soluciones

| Dificultad | Causa | Solución |
|---|---|---|
| Los botones de autenticación parecían no responder | Las excepciones de red no restablecían el estado de carga. | Se incorporó `try/catch/finally` y retroalimentación visible. |
| `Failed to fetch` al registrarse | Expo utilizaba la URL de ejemplo `tu_proyecto.supabase.co`. | Se configuró la URL real y se reinició Expo para regenerar el bundle. |
| Sospecha de error CORS | El navegador no podía resolver el dominio de ejemplo. | Se verificó el preflight y se descartó CORS. |
| Rechazo de imágenes en Cloudinary | El preset unsigned no estaba autorizado o no coincidía con `.env`. | Se configuró y restringió el preset `sinfirma`. |
| Imagen inválida desde web | Se enviaba un descriptor nativo en lugar del archivo real. | Se convirtió la URL local a `Blob` antes de crear `FormData`. |
| Préstamos visibles sin separación inicial | No existía relación con el usuario autenticado. | Se añadió `owner_id` y autorización RLS. |
| Versiones incompatibles con Expo | TypeScript y tipos de React no coincidían con SDK 57. | Se instalaron las versiones recomendadas por Expo Doctor. |

# 14. Lecciones aprendidas

- La autenticación identifica al usuario, pero la autorización determina qué recursos puede utilizar.
- Una clave pública de Supabase puede estar en el cliente si la seguridad se aplica mediante RLS.
- Los controles visuales no reemplazan las reglas del servidor.
- Las variables `EXPO_PUBLIC_*` se integran en el bundle y requieren reiniciar Expo después de modificarlas.
- Un error `ERR_NAME_NOT_RESOLVED` ocurre antes de CORS y suele indicar un dominio incorrecto.
- Las aplicaciones web y nativas manejan archivos de manera diferente: web utiliza `Blob` y React Native utiliza URI.
- Las cargas firmadas de Cloudinary requieren un backend; el secreto no debe exponerse en el navegador.
- Separar registro e inicio de sesión mejora la comprensión de la interfaz.
- Las herramientas de diagnóstico del navegador permiten identificar URL, método, estado y respuesta de cada petición.
- El tipado y las verificaciones automáticas reducen errores antes de publicar la aplicación.

# 15. Conclusiones

PrestaCosas cumple el objetivo de implementar una aplicación web móvil enfocada en un problema cotidiano. La solución permite registrar y controlar préstamos, almacenar fotografías, identificar devoluciones y facilitar la comunicación con la persona receptora.

La integración de Expo, Supabase y Cloudinary demuestra el uso coordinado de plataformas emergentes. Supabase proporciona identidad, base de datos y autorización; Cloudinary resuelve el almacenamiento de archivos; Expo y React Native permiten construir una experiencia común para web y dispositivos móviles.

El uso de JWT y Row Level Security aporta una separación efectiva entre usuarios. Esto evita depender únicamente de filtros en la interfaz y establece una base adecuada para ampliar el proyecto.

# 16. Recomendaciones y trabajo futuro

- Implementar recuperación y cambio de contraseña.
- Incorporar autenticación social con Google.
- Permitir editar todos los datos de un préstamo.
- Añadir fechas esperadas de devolución y notificaciones.
- Implementar búsqueda y filtros por estado, persona o fecha.
- Eliminar de Cloudinary las imágenes asociadas a préstamos borrados.
- Generar cargas firmadas mediante una Supabase Edge Function.
- Agregar pruebas automatizadas de componentes y flujos completos.
- Publicar una versión web y generar ejecutables para Android.
- Mejorar la accesibilidad con etiquetas, foco de teclado y contraste validado.

# 17. Anexos

## 17.1 Enlaces del proyecto

| Recurso | Enlace |
|---|---|
| Repositorio GitHub | [AGREGAR URL DEL REPOSITORIO] |
| Aplicación web publicada | [AGREGAR URL DE LA APLICACIÓN] |
| Video demostrativo | [AGREGAR URL DEL VIDEO] |
| Ejecutable Android | [AGREGAR URL DEL APK O BUILD] |

## 17.2 Estructura principal del código

```text
tupper-tracker/
├── App.tsx
├── src/
│   ├── screens/
│   │   ├── AuthScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   └── LoansScreen.tsx
│   ├── services/
│   │   └── supabase.ts
│   └── types/
│       └── entities.ts
├── supabase/
│   └── migrations/
│       └── 202610050001_auth_and_loans.sql
├── SUPABASE_SETUP.md
└── package.json
```

## 17.3 Ejecución local

```bash
npm install
npx expo start --clear
```

Luego se puede seleccionar la ejecución web o abrir la aplicación mediante Expo Go.

## 17.4 Variables requeridas

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://PROYECTO.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=CLAVE_PUBLICA
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=NOMBRE_CLOUD
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=PRESET_UNSIGNED
```

Las claves privadas no deben agregarse al repositorio ni al bundle de la aplicación.

# 18. Referencias

- Cloudinary. (2026). *Client-side uploading*. https://cloudinary.com/documentation/client_side_uploading
- Cloudinary. (2026). *Upload presets*. https://cloudinary.com/documentation/upload_presets
- Expo. (2026). *Expo documentation*. https://docs.expo.dev/
- Expo. (2026). *ImagePicker*. https://docs.expo.dev/versions/latest/sdk/imagepicker/
- Expo. (2026). *SQLite*. https://docs.expo.dev/versions/latest/sdk/sqlite/
- Meta Platforms. (2026). *React Native documentation*. https://reactnative.dev/docs/getting-started
- Supabase. (2026). *Auth*. https://supabase.com/docs/guides/auth
- Supabase. (2026). *Row Level Security*. https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase. (2026). *Use Supabase with Expo React Native*. https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native

# 19. Registro de cambios

> La guía solicita documentar las modificaciones posteriores a la entrega. Agregar una fila por cada cambio realizado.

| Fecha | Versión | Responsable | Cambio realizado |
|---|---|---|---|
| [FECHA] | 1.0.0 | [NOMBRE] | Implementación inicial de autenticación, préstamos e imágenes. |
| [FECHA] | [VERSIÓN] | [NOMBRE] | [DESCRIBIR MODIFICACIÓN] |

---

## Lista de verificación para la entrega

- [ ] Completar nombres, códigos, grupo y fecha.
- [ ] Agregar el logotipo de la universidad.
- [ ] Insertar las capturas indicadas y conservar sus pies de figura.
- [ ] Agregar enlaces de GitHub, aplicación, video y ejecutable.
- [ ] Actualizar los índices de contenido, imágenes y tablas en Word.
- [ ] Revisar ortografía y numeración final.
- [ ] Convertir el documento a DOCX.
- [ ] Verificar que un solo integrante realice la entrega.
