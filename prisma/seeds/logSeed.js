import { subDays, isAfter } from 'date-fns';

export async function seedLogs(prisma) {
  console.log('  └─ Seeding Usage Logs (Simulating 30 days with Operators and Prices)...');

  // Clear existing logs
  await prisma.washerLog.deleteMany();
  await prisma.dryerLog.deleteMany();

  const washers = await prisma.washer.findMany({ include: { branch: true } });
  const dryers = await prisma.dryer.findMany({ include: { branch: true } });
  const users = await prisma.user.findMany();
  
  if (users.length === 0) {
    console.log('⚠️ No users found to assign as operators. Skipping logs seeder.');
    return;
  }

  const washTypes = [
    { name: 'Normal', duration: 45 },
    { name: 'Pesado', duration: 60 },
    { name: 'Delicado', duration: 40 },
    { name: 'Rápido', duration: 30 }
  ];
  
  const dryTypes = [
    { name: 'Calor Alto', duration: 45 },
    { name: 'Calor Medio', duration: 50 },
    { name: 'Calor Bajo', duration: 60 },
    { name: 'Aire Frío', duration: 30 }
  ];

  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);

  // Seed logs for each washer
  for (const washer of washers) {
    let currentDate = thirtyDaysAgo;
    const price = washer.branch?.washerPrice || 15;
    
    while (!isAfter(currentDate, now)) {
      const dailyWashes = Math.floor(Math.random() * 6) + 3;
      
      for (let i = 0; i < dailyWashes; i++) {
        const hour = Math.floor(Math.random() * 12) + 8;
        const minute = Math.floor(Math.random() * 60);
        const logDate = new Date(currentDate);
        logDate.setHours(hour, minute);

        if (isAfter(logDate, now)) continue;

        const type = washTypes[Math.floor(Math.random() * washTypes.length)];
        const operator = users[Math.floor(Math.random() * users.length)];

        await prisma.washerLog.create({
          data: {
            washerId: washer.id,
            washType: type.name,
            duration: type.duration,
            revenue: price,
            userId: operator.id,
            createdAt: logDate
          }
        });
      }
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  // Seed logs for each dryer
  for (const dryer of dryers) {
    let currentDate = thirtyDaysAgo;
    const price = dryer.branch?.dryerPrice || 15;
    
    while (!isAfter(currentDate, now)) {
      const dailyDries = Math.floor(Math.random() * 6) + 3;
      
      for (let i = 0; i < dailyDries; i++) {
        const hour = Math.floor(Math.random() * 12) + 8;
        const minute = Math.floor(Math.random() * 60);
        const logDate = new Date(currentDate);
        logDate.setHours(hour, minute);

        if (isAfter(logDate, now)) continue;

        const type = dryTypes[Math.floor(Math.random() * dryTypes.length)];
        const operator = users[Math.floor(Math.random() * users.length)];

        await prisma.dryerLog.create({
          data: {
            dryerId: dryer.id,
            dryType: type.name,
            duration: type.duration,
            revenue: price,
            userId: operator.id,
            createdAt: logDate
          }
        });
      }
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }
  }
}
