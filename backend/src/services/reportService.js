import { Op } from 'sequelize';
import { sequelize } from '../models/index.js';
import models from '../models/index.js';

const { Report, Deal, Contact, Task, User } = models;

export const getDashboardStats = async (userId, userRole) => {
  const where = userRole !== 'admin' ? { ownerId: userId } : {};

  // Total contacts
  const totalContacts = await Contact.count({ where });

  // Total deals and value
  const dealStats = await Deal.findAll({
    where,
    attributes: [
      'stage',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('value')), 'totalValue'],
    ],
    group: ['stage'],
    raw: true,
  });

  // Tasks by status
  const taskStats = await Task.findAll({
    where: userRole !== 'admin' ? { assigneeId: userId } : {},
    attributes: [
      'status',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    group: ['status'],
    raw: true,
  });

  // Recent activity counts
  const recentDeals = await Deal.count({
    where: {
      ...where,
      createdAt: {
        [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    },
  });

  return {
    totalContacts,
    dealStats,
    taskStats,
    recentDeals,
  };
};

export const getSalesFunnel = async (userId, userRole) => {
  const where = userRole !== 'admin' ? { ownerId: userId } : {};

  const funnelData = await Deal.findAll({
    where,
    attributes: [
      'stage',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('value')), 'totalValue'],
      [sequelize.fn('AVG', sequelize.col('value')), 'avgValue'],
    ],
    group: ['stage'],
    raw: true,
  });

  return funnelData;
};

export const getPerformanceReport = async (startDate, endDate) => {
  const where = {
    createdAt: {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    },
  };

  const userPerformance = await Deal.findAll({
    where,
    attributes: [
      'ownerId',
      [sequelize.fn('COUNT', sequelize.col('Deal.id')), 'totalDeals'],
      [sequelize.fn('SUM', sequelize.col('value')), 'totalValue'],
      [sequelize.fn('COUNT', sequelize.literal("CASE WHEN stage = 'won' THEN 1 END")), 'wonDeals'],
    ],
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'firstName', 'lastName', 'email'],
      },
    ],
    group: ['Deal.ownerId', 'owner.id', 'owner.firstName', 'owner.lastName', 'owner.email'],
    raw: false,
  });

  return userPerformance;
};

export const getCustomReport = async (reportConfig) => {
  // This is a simplified custom report builder
  // In a real system, this would be more sophisticated
  const { entity, filters, groupBy, aggregations } = reportConfig;

  let model;
  switch (entity) {
    case 'deals':
      model = Deal;
      break;
    case 'contacts':
      model = Contact;
      break;
    case 'tasks':
      model = Task;
      break;
    default:
      throw { statusCode: 400, message: 'Invalid entity' };
  }

  const results = await model.findAll({
    where: filters || {},
    attributes: aggregations || [],
    group: groupBy || [],
  });

  return results;
};

export const saveReport = async (reportData, userId) => {
  const report = await Report.create({
    ...reportData,
    userId,
  });

  return report;
};

export const getUserReports = async (userId) => {
  const reports = await Report.findAll({
    where: {
      [Op.or]: [
        { userId },
        { isPublic: true },
      ],
    },
    order: [['createdAt', 'DESC']],
  });

  return reports;
};

export const deleteReport = async (id, userId) => {
  const report = await Report.findByPk(id);
  
  if (!report) {
    throw { statusCode: 404, message: 'Report not found' };
  }

  if (report.userId !== userId) {
    throw { statusCode: 403, message: 'Not authorized to delete this report' };
  }

  await report.destroy();
  return { message: 'Report deleted successfully' };
};
