export async function seedBranches(prisma) {
  console.log('  └─ Seeding Branches...');
  
  const branchesData = [
    { name: 'Sucursal Central', address: 'Calle Principal #123', phone: '222111333', washerPrice: 15, dryerPrice: 15, washerTime: 45, dryerTime: 45 },
    { name: 'Sucursal Norte', address: 'Avenida Libertad #456', phone: '222444555', washerPrice: 15, dryerPrice: 15, washerTime: 45, dryerTime: 45 },
    { name: 'Sucursal Sur', address: 'Calle 10 #789', phone: '222666777', washerPrice: 15, dryerPrice: 15, washerTime: 45, dryerTime: 45 }
  ];

  const branches = [];
  for (const data of branchesData) {
    const branch = await prisma.branch.upsert({
      where: { name: data.name },
      update: {},
      create: data
    });
    branches.push(branch);
  }

  return branches;
}
