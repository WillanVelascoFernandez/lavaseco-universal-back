export async function seedRoles(prisma) {
  console.log('  └─ Seeding Roles...');
  
  const admin = await prisma.rol.upsert({
    where: { nombre: 'ADMIN' },
    update: {
      permisos: {
        users_view: true, users_create: true, users_edit: true, users_delete: true,
        branches_view: true, branches_create: true, branches_edit: true, branches_delete: true,
        washers_view: true, washers_create: true, washers_edit: true, washers_delete: true, washers_toggle: true,
        dryers_view: true, dryers_create: true, dryers_edit: true, dryers_delete: true, dryers_toggle: true,
        reports_view: true
      }
    },
    create: {
      nombre: 'ADMIN',
      permisos: {
        users_view: true, users_create: true, users_edit: true, users_delete: true,
        branches_view: true, branches_create: true, branches_edit: true, branches_delete: true,
        washers_view: true, washers_create: true, washers_edit: true, washers_delete: true, washers_toggle: true,
        dryers_view: true, dryers_create: true, dryers_edit: true, dryers_delete: true, dryers_toggle: true,
        reports_view: true
      }
    }
  });

  const operator = await prisma.rol.upsert({
    where: { nombre: 'OPERADOR' },
    update: {
      permisos: {
        users_view: false, users_create: false, users_edit: false, users_delete: false,
        branches_view: true, 
        washers_view: true, washers_toggle: true,
        dryers_view: true, dryers_toggle: true,
        reports_view: false
      }
    },
    create: {
      nombre: 'OPERADOR',
      permisos: {
        users_view: false, users_create: false, users_edit: false, users_delete: false,
        branches_view: true, 
        washers_view: true, washers_toggle: true,
        dryers_view: true, dryers_toggle: true,
        reports_view: false
      }
    }
  });

  return { admin, operator };
}
