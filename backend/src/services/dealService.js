import { Op } from 'sequelize';
import models from '../models/index.js';

const { Deal, Contact, Company, User } = models;

export const getDeals = async (query) => {
  const {
    page = 1,
    limit = 20,
    stage,
    ownerId,
  } = query;

  const offset = (page - 1) * limit;
  const where = {};

  if (stage) {
    where.stage = stage;
  }

  if (ownerId) {
    where.ownerId = ownerId;
  }

  const { rows, count } = await Deal.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    include: [
      { model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName'] },
      { model: Company, as: 'company', attributes: ['id', 'name'] },
      { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return {
    deals: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
    },
  };
};

export const getDealById = async (id) => {
  const deal = await Deal.findByPk(id, {
    include: [
      { model: Contact, as: 'contact' },
      { model: Company, as: 'company' },
      { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email'] },
    ],
  });

  if (!deal) {
    throw { statusCode: 404, message: 'Deal not found' };
  }

  return deal;
};

export const createDeal = async (dealData) => {
  const deal = await Deal.create(dealData);
  
  return await Deal.findByPk(deal.id, {
    include: [
      { model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName'] },
      { model: Company, as: 'company', attributes: ['id', 'name'] },
      { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName'] },
    ],
  });
};

export const updateDeal = async (id, updateData) => {
  const deal = await Deal.findByPk(id);
  
  if (!deal) {
    throw { statusCode: 404, message: 'Deal not found' };
  }

  await deal.update(updateData);
  
  return await Deal.findByPk(id, {
    include: [
      { model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName'] },
      { model: Company, as: 'company', attributes: ['id', 'name'] },
      { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName'] },
    ],
  });
};

export const updateDealStage = async (id, stage) => {
  const deal = await Deal.findByPk(id);
  
  if (!deal) {
    throw { statusCode: 404, message: 'Deal not found' };
  }

  await deal.update({ stage });
  
  // If deal is won or lost, set actualCloseDate
  if (stage === 'won' || stage === 'lost') {
    await deal.update({ actualCloseDate: new Date() });
  }
  
  return deal;
};

export const deleteDeal = async (id) => {
  const deal = await Deal.findByPk(id);
  
  if (!deal) {
    throw { statusCode: 404, message: 'Deal not found' };
  }

  await deal.destroy();
  return { message: 'Deal deleted successfully' };
};
