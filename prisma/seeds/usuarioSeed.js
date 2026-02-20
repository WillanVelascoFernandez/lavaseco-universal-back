import bcrypt from 'bcryptjs';

export async function seedUsers(prisma, roles, branches) {
  console.log('  └─ Seeding Users...');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@lavaseco.com' },
    update: {
      roleId: roles.superAdmin.id
    },
    create: {
      email: 'superadmin@lavaseco.com',
      password: hashedPassword,
      name: 'Super Admin',
      roleId: roles.superAdmin.id,
      branches: {
        create: branches.map(b => ({
          branchId: b.id
        }))
      }
    }
  });

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
        create: branches.map(b => ({
          branchId: b.id
        }))
      }
    }
  });

  const operator = await prisma.user.upsert({
    where: { email: 'operator@lavaseco.com' },
    update: {
      roleId: roles.operator.id
    },
    create: {
      email: 'operator@lavaseco.com',
      password: hashedPassword,
      name: 'Branch Operator',
      roleId: roles.operator.id,
      branches: {
        create: {
          branchId: branches[0].id
        }
      }
    }
  });

  return { superAdmin, admin, operator };
}
