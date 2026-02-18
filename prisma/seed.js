import { PrismaClient } from '@prisma/client';
import { seedRoles } from './seeds/roleSeed.js';
import { seedSucursales } from './seeds/sucursalSeed.js';
import { seedUsuarios } from './seeds/usuarioSeed.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando Master Seed...');

  try {
    // 1. Ejecutar cada módulo en orden (algunos dependen de otros)
    const roles = await seedRoles(prisma);
    const sucursales = await seedSucursales(prisma);
    
    // El seed de usuarios necesita los roles y sucursales creados arriba
    await seedUsuarios(prisma, roles, sucursales);

    console.log('✅ Master Seed finalizado con éxito.');
  } catch (error) {
    console.error('❌ Error durante el Master Seed:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
