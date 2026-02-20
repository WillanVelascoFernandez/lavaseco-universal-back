import { PrismaClient } from '@prisma/client';
import { seedRoles } from './seeds/roleSeed.js';
import { seedBranches } from './seeds/sucursalSeed.js';
import { seedUsers } from './seeds/usuarioSeed.js';
import { seedMachines } from './seeds/machineSeed.js';
import { seedLogs } from './seeds/logSeed.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Master Seed...');

  try {
    // 1. Run each module in order
    const roles = await seedRoles(prisma);
    const branches = await seedBranches(prisma);
    
    // User seed needs the roles and branches created above
    await seedUsers(prisma, roles, branches);

    // Seed machines (washers and dryers)
    await seedMachines(prisma, branches);

    // Seed usage logs
    await seedLogs(prisma);

    console.log('✅ Master Seed completed successfully.');
  } catch (error) {
    console.error('❌ Error during Master Seed:', error);
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
