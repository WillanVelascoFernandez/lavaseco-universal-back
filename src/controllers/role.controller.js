import prisma from '../lib/prisma.js';

export const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        _count: { select: { users: true } }
      }
    });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving roles' });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const newRole = await prisma.role.create({
      data: {
        name: name.toUpperCase(),
        permissions: permissions || {}
      }
    });
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: 'Error creating role. Name might be duplicated.' });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;

    const role = await prisma.role.findUnique({ where: { id: parseInt(id) } });
    if (role.isProtected) {
      return res.status(400).json({ message: 'Cannot edit a system-protected role.' });
    }

    const updatedRole = await prisma.role.update({
      where: { id: parseInt(id) },
      data: {
        name: name ? name.toUpperCase() : undefined,
        permissions: permissions
      }
    });

    res.json(updatedRole);
  } catch (error) {
    res.status(500).json({ message: 'Error updating role.' });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    const role = await prisma.role.findUnique({ where: { id: parseInt(id) } });
    if (role.isProtected) {
      return res.status(400).json({ message: 'Cannot delete a system-protected role.' });
    }

    await prisma.role.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Role deleted successfully.' });
  } catch (error) {
    res.status(400).json({ message: 'Cannot delete a role that has assigned users.' });
  }
};
