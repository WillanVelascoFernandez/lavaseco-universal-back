import bcrypt from 'bcryptjs';

export async function seedUsers(prisma, roles, branches) {
  console.log('  └─ Seeding Users...');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lavaseco.com' },
    update: {
      roleId: roles.admin.id
    },
    create: {
      email: 'admin@lavaseco.com',
      password: hashedPassword,
      name: 'System Administrator',
      roleId: roles.admin.id,
      branches: {
        create: {
          branchId: branches.mainBranch.id
        }
      }
    }
  });

  return { admin };
}
