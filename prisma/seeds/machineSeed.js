export async function seedMachines(prisma, branches) {
  console.log('  └─ Seeding Washers and Dryers...');
  
  for (const branch of branches) {
    // Clear existing machines for this branch to avoid duplicates
    await prisma.washer.deleteMany({ where: { branchId: branch.id } });
    await prisma.dryer.deleteMany({ where: { branchId: branch.id } });

    // Create 4 washers per branch
    for (let i = 1; i <= 4; i++) {
      await prisma.washer.create({
        data: {
          name: `L${i}`,
          branchId: branch.id,
          isEnabled: true
        }
      });
    }

    // Create 4 dryers per branch
    for (let i = 1; i <= 4; i++) {
      await prisma.dryer.create({
        data: {
          name: `S${i}`,
          branchId: branch.id,
          isEnabled: true
        }
      });
    }
  }
}
