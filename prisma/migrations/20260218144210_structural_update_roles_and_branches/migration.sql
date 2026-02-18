/*
  Warnings:

  - You are about to drop the column `sucursal` on the `lavadoras` table. All the data in the column will be lost.
  - You are about to drop the column `rol` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `sucursal_id` to the `lavadoras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rol_id` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lavadoras" DROP COLUMN "sucursal",
ADD COLUMN     "sucursal_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "rol",
ADD COLUMN     "rol_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "permisos" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sucursales" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sucursales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios_sucursales" (
    "usuario_id" INTEGER NOT NULL,
    "sucursal_id" INTEGER NOT NULL,

    CONSTRAINT "usuarios_sucursales_pkey" PRIMARY KEY ("usuario_id","sucursal_id")
);

-- CreateTable
CREATE TABLE "secadoras" (
    "id" SERIAL NOT NULL,
    "is_enable" BOOLEAN NOT NULL DEFAULT true,
    "sucursal_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "secadoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_secadoras" (
    "id" SERIAL NOT NULL,
    "id_secadora" INTEGER NOT NULL,
    "tipo_secado" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registro_secadoras_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "sucursales_nombre_key" ON "sucursales"("nombre");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_sucursales" ADD CONSTRAINT "usuarios_sucursales_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_sucursales" ADD CONSTRAINT "usuarios_sucursales_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lavadoras" ADD CONSTRAINT "lavadoras_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secadoras" ADD CONSTRAINT "secadoras_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_secadoras" ADD CONSTRAINT "registro_secadoras_id_secadora_fkey" FOREIGN KEY ("id_secadora") REFERENCES "secadoras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
