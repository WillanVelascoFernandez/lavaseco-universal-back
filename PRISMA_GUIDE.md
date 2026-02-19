# Guía de Manejo de Base de Datos con Prisma 🚀

Esta guía explica cómo gestionar la base de datos de **Lavaseco Universal** utilizando Prisma ORM.

## 1. Comandos Principales de Prisma

Aquí tienes los comandos que usarás en el día a día dentro de la carpeta `lavaseco-universal-back`:

### 🔄 Sincronización y Migraciones

- **`npx prisma migrate dev --name nombre_descriptivo`**:
  - Se usa en **desarrollo**.
  - Compara tu archivo `schema.prisma` con la DB actual.
  - Crea un archivo SQL en `prisma/migrations`.
  - Aplica los cambios y genera el cliente (`PrismaClient`).
- **`npx prisma migrate reset`**:
  - Borra toda la base de datos y la vuelve a crear desde cero.
  - **¡Cuidado!** Se pierden todos los datos (útil si la DB se corrompe en desarrollo). Ejecuta automáticamente el `seed` al terminar.
- **`npx prisma migrate deploy`**:
  - Se usa en **producción**. Aplica las migraciones pendientes sin resetear la DB.

### 🛠 Generación y Utilidades

- **`npx prisma generate`**:
  - Lee el `schema.prisma` y actualiza el "IntelliSense" (autocompletado) en VS Code.
  - Se ejecuta automáticamente tras una migración.
- **`npx prisma studio`**:
  - Abre una interfaz web en `http://localhost:5555` para ver y editar los datos de tus tablas de forma visual.

### 🌱 Datos Iniciales (Seeding)

- **`npx prisma db seed`**:
  - Ejecuta el archivo `prisma/seed.js`.
  - Llena la base de datos con los roles, sucursales y usuarios administradores iniciales.

---

## 2. Flujo de Trabajo: ¿Cómo hacer un cambio?

Si necesitas agregar un nuevo campo (ej. `phone` en `User`), sigue estos pasos:

1.  **Modifica el esquema**: Abre `prisma/schema.prisma` y añade el campo.
2.  **Crea la migración**:
    ```bash
    npx prisma migrate dev --name add_phone_to_user
    ```
3.  **Verifica**: Prisma te avisará si los cambios se aplicaron correctamente. El cliente de base de datos se actualizará automáticamente.

---

## 3. Resumen Rápido (Cheat Sheet)

| Acción                               | Comando                    |
| :----------------------------------- | :------------------------- |
| **Cambiar la estructura de la DB**   | `npx prisma migrate dev`   |
| **Ver los datos visualmente**        | `npx prisma studio`        |
| **Poblar la DB con datos iniciales** | `npx prisma db seed`       |
| **Limpiar y reiniciar todo**         | `npx prisma migrate reset` |
| **Actualizar el autocompletado**     | `npx prisma generate`      |

---

> **Nota:** Recuerda siempre tener tu archivo `.env` configurado con la URL correcta de tu base de datos antes de ejecutar estos comandos.
