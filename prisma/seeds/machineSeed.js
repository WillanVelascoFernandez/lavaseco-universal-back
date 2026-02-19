export async function seedMachines(prisma, branches) {
  console.log('  └─ Seeding Washers and Dryers...');
  
  for (const branch of branches) {
    // Create 4 washers per branch
    for (let i = 1; i <= 4; i++) {
      await prisma.washer.create({
        data: {
          branchId: branch.id,
          isEnabled: true
        }
      });
    }

    // Create 4 dryers per branch
    for (let i = 1; i <= 4; i++) {
      await prisma.dryer.create({
        data: {
          branchId: branch.id,
          isEnabled: true
        }
      });
    }
  }
}
