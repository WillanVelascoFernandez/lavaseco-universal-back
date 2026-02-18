import bcrypt from 'bcryptjs';

export async function seedUsuarios(prisma, roles, sucursales) {
  console.log('  └─ Seeding Usuarios...');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@lavaseco.com' },
    update: {
      rolId: roles.admin.id
    },
    create: {
      email: 'admin@lavaseco.com',
      password: hashedPassword,
      nombre: 'Administrador Sistema',
      rolId: roles.admin.id,
      sucursales: {
        create: {
          sucursalId: sucursales.principal.id
        }
      }
    }
  });

  return { admin };
}
