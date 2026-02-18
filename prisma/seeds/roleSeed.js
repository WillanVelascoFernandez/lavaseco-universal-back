export async function seedRoles(prisma) {
  console.log('  └─ Seeding Roles...');
  
  const adminPermissions = {
    // Users & Roles
    users_view: true, users_create: true, users_edit: true, users_delete: true,
    roles_view: true, roles_create: true, roles_edit: true, roles_delete: true,
    // Branches
    branches_view: true, branches_create: true, branches_edit: true, branches_delete: true,
    // Washers
    washers_view: true, washers_create: true, washers_edit: true, washers_delete: true, washers_toggle: true,
    // Dryers
    dryers_view: true, dryers_create: true, dryers_edit: true, dryers_delete: true, dryers_toggle: true,
    // Reports
    reports_view: true
  };

  const admin = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: { 
      permissions: adminPermissions,
      isProtected: true
    },
    create: {
      name: 'ADMIN',
      permissions: adminPermissions,
      isProtected: true
    }
  });

  const operator = await prisma.role.upsert({
    where: { name: 'OPERATOR' },
    update: {
      permissions: {
        users_view: false, users_create: false, users_edit: false, users_delete: false,
        roles_view: false, roles_create: false, roles_edit: false, roles_delete: false,
        branches_view: true, 
        washers_view: true, washers_toggle: true,
        dryers_view: true, dryers_toggle: true,
        reports_view: false
      }
    },
    create: {
      name: 'OPERATOR',
      permissions: {
        users_view: false, users_create: false, users_edit: false, users_delete: false,
        roles_view: false, roles_create: false, roles_edit: false, roles_delete: false,
        branches_view: true, 
        washers_view: true, washers_toggle: true,
        dryers_view: true, dryers_toggle: true,
        reports_view: false
      }
    }
  });

  return { admin, operator };
}
