import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Empezando seed...');

  // 1. Crear Roles
  const adminRole = await prisma.rol.upsert({
    where: { nombre: 'ADMIN' },
    update: {},
    create: {
      nombre: 'ADMIN',
      permisos: {
        view_reports: true,
        manage_users: true,
        manage_branches: true,
        operate_machines: true
      }
    }
  });

  const operatorRole = await prisma.rol.upsert({
    where: { nombre: 'OPERADOR' },
    update: {},
    create: {
      nombre: 'OPERADOR',
      permisos: {
        view_reports: false,
        manage_users: false,
        manage_branches: false,
        operate_machines: true
      }
    }
  });

  // 2. Crear Sucursal Inicial
  const sucursalPrincipal = await prisma.sucursal.upsert({
    where: { nombre: 'Sucursal Central' },
    update: {},
    create: {
      nombre: 'Sucursal Central',
      direccion: 'Calle Principal #123',
      telefono: '123456789'
    }
  });

  // 3. Crear Usuario Administrador
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.usuario.upsert({
    where: { email: 'admin@lavaseco.com' },
    update: {},
    create: {
      email: 'admin@lavaseco.com',
      password: hashedPassword,
      nombre: 'Administrador Sistema',
      rolId: adminRole.id,
      sucursales: {
        create: {
          sucursalId: sucursalPrincipal.id
        }
      }
    }
  });

  console.log('✅ Seed completado con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
