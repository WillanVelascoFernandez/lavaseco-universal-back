export async function seedBranches(prisma) {
  console.log('  └─ Seeding Branches...');
  
  const mainBranch = await prisma.branch.upsert({
    where: { name: 'Main Branch' },
    update: {},
    create: {
      name: 'Main Branch',
      address: 'Main Street #123',
      phone: '123456789'
    }
  });

  return { mainBranch };
}
