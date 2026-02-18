import prisma from '../lib/prisma.js';
import { startOfDay, endOfDay, subDays } from 'date-fns';

/**
 * Get core statistics for the admin dashboard
 */
export const getDashboardStats = async (req, res) => {
  try {
    const totalWashers = await prisma.washer.count();
    const totalDryers = await prisma.dryer.count();
    const totalBranches = await prisma.branch.count();
    const totalUsers = await prisma.user.count();

    // Stats for the last 24 hours
    const yesterday = subDays(new Date(), 1);
    
    const recentWashes = await prisma.washerLog.count({
      where: { createdAt: { gte: yesterday } }
    });

    const recentDries = await prisma.dryerLog.count({
      where: { createdAt: { gte: yesterday } }
    });

    res.json({
      totals: {
        washers: totalWashers,
        dryers: totalDryers,
        branches: totalBranches,
        users: totalUsers
      },
      last24Hours: {
        washes: recentWashes,
        dries: recentDries
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving dashboard stats' });
  }
};

/**
 * Get usage reports grouped by branch
 */
export const getBranchReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const branches = await prisma.branch.findMany({
      include: {
        _count: {
          select: {
            washers: true,
            dryers: true
          }
        },
        washers: {
          include: {
            _count: {
              select: { logs: { where: { createdAt: dateFilter } } }
            }
          }
        },
        dryers: {
          include: {
            _count: {
              select: { logs: { where: { createdAt: dateFilter } } }
            }
          }
        }
      }
    });

    // Format data for the chart
    const report = branches.map(b => {
      const totalWashes = b.washers.reduce((acc, w) => acc + w._count.logs, 0);
      const totalDries = b.dryers.reduce((acc, d) => acc + d._count.logs, 0);

      return {
        branchId: b.id,
        branchName: b.name,
        machines: b._count,
        usage: {
          washes: totalWashes,
          dries: totalDries,
          total: totalWashes + totalDries
        }
      };
    });

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating branch reports' });
  }
};

/**
 * Get usage breakdown by machine type and wash/dry type
 */
export const getTypeStats = async (req, res) => {
  try {
    // Grouping by washType
    const washTypes = await prisma.washerLog.groupBy({
      by: ['washType'],
      _count: { _all: true }
    });

    const dryTypes = await prisma.dryerLog.groupBy({
      by: ['dryType'],
      _count: { _all: true }
    });

    res.json({
      washing: washTypes.map(t => ({ type: t.washType, count: t._count._all })),
      drying: dryTypes.map(t => ({ type: t.dryType, count: t._count._all }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving type statistics' });
  }
};
