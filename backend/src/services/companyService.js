import { Op } from 'sequelize';
import models from '../models/index.js';

const { Company, User } = models;

export const getCompanies = async (query) => {
  const {
    page = 1,
    limit = 20,
    search = '',
  } = query;

  const offset = (page - 1) * limit;
  const where = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { industry: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows, count } = await Company.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    include: [
      { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return {
    companies: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
    },
  };
};

export const getCompanyById = async (id) => {
  const company = await Company.findByPk(id, {
    include: [
      { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email'] },
    ],
  });

  if (!company) {
    throw { statusCode: 404, message: 'Company not found' };
  }

  return company;
};

export const createCompany = async (companyData) => {
  return await Company.create(companyData);
};

export const updateCompany = async (id, updateData) => {
  const company = await Company.findByPk(id);
  
  if (!company) {
    throw { statusCode: 404, message: 'Company not found' };
  }

  await company.update(updateData);
  return company;
};

export const deleteCompany = async (id) => {
  const company = await Company.findByPk(id);
  
  if (!company) {
    throw { statusCode: 404, message: 'Company not found' };
  }

  await company.destroy();
  return { message: 'Company deleted successfully' };
};
