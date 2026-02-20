import { subDays, startOfDay, addMinutes, isAfter } from 'date-fns';

export async function seedLogs(prisma) {
  console.log('  └─ Seeding Usage Logs (Simulating 30 days)...');

  const washers = await prisma.washer.findMany();
  const dryers = await prisma.dryer.findMany();

  const washTypes = ['Normal', 'Pesado', 'Delicado', 'Rápido'];
  const dryTypes = ['Calor Alto', 'Calor Medio', 'Calor Bajo', 'Aire Frío'];

  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);

  // Seed logs for each washer
  for (const washer of washers) {
    let currentDate = thirtyDaysAgo;
    
    while (!isAfter(currentDate, now)) {
      // Simulate 3-8 washes per day
      const dailyWashes = Math.floor(Math.random() * 6) + 3;
      
      for (let i = 0; i < dailyWashes; i++) {
        // Random time during the day (8 AM - 8 PM)
        const hour = Math.floor(Math.random() * 12) + 8;
        const minute = Math.floor(Math.random() * 60);
        const logDate = new Date(currentDate);
        logDate.setHours(hour, minute);

        if (isAfter(logDate, now)) continue;

        await prisma.washerLog.create({
          data: {
            washerId: washer.id,
            washType: washTypes[Math.floor(Math.random() * washTypes.length)],
            createdAt: logDate
          }
        });
      }
      
      currentDate = subDays(currentDate, -1); // Move to next day (using subDays with negative value)
      // Actually subDays(currentDate, -1) works, or just add 1 day.
      // Better:
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  // Seed logs for each dryer
  for (const dryer of dryers) {
    let currentDate = thirtyDaysAgo;
    
    while (!isAfter(currentDate, now)) {
      const dailyDries = Math.floor(Math.random() * 6) + 3;
      
      for (let i = 0; i < dailyDries; i++) {
        const hour = Math.floor(Math.random() * 12) + 8;
        const minute = Math.floor(Math.random() * 60);
        const logDate = new Date(currentDate);
        logDate.setHours(hour, minute);

        if (isAfter(logDate, now)) continue;

        await prisma.dryerLog.create({
          data: {
            dryerId: dryer.id,
            dryType: dryTypes[Math.floor(Math.random() * dryTypes.length)],
            createdAt: logDate
          }
        });
      }
      
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }
  }
}
