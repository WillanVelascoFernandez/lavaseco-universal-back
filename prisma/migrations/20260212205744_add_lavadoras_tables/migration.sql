-- CreateTable
CREATE TABLE "lavadoras" (
    "id" SERIAL NOT NULL,
    "sucursal" TEXT NOT NULL,
    "is_enable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lavadoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_lavadoras" (
    "id" SERIAL NOT NULL,
    "id_lavadora" INTEGER NOT NULL,
    "tipo_lavado" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registro_lavadoras_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "registro_lavadoras" ADD CONSTRAINT "registro_lavadoras_id_lavadora_fkey" FOREIGN KEY ("id_lavadora") REFERENCES "lavadoras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
