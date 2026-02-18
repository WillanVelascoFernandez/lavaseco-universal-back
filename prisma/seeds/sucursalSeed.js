export async function seedSucursales(prisma) {
  console.log('  └─ Seeding Sucursales...');
  
  const principal = await prisma.sucursal.upsert({
    where: { nombre: 'Sucursal Central' },
    update: {},
    create: {
      nombre: 'Sucursal Central',
      direccion: 'Calle Principal #123',
      telefono: '123456789'
    }
  });

  return { principal };
}
