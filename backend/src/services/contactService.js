import { Op } from 'sequelize';
import models from '../models/index.js';

const { Contact, Company, User } = models;

export const getContacts = async (query) => {
  const {
    page = 1,
    limit = 20,
    search = '',
    status,
    ownerId,
    tags,
  } = query;

  const offset = (page - 1) * limit;
  const where = {};

  // Search filter
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { phone: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Status filter
  if (status) {
    where.status = status;
  }

  // Owner filter
  if (ownerId) {
    where.ownerId = ownerId;
  }

  // Tags filter
  if (tags) {
    where.tags = { [Op.contains]: Array.isArray(tags) ? tags : [tags] };
  }

  const { rows, count } = await Contact.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    include: [
      { model: Company, as: 'company', attributes: ['id', 'name'] },
      { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return {
    contacts: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
    },
  };
};

export const getContactById = async (id) => {
  const contact = await Contact.findByPk(id, {
    include: [
      { model: Company, as: 'company' },
      { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email'] },
    ],
  });

  if (!contact) {
    throw { statusCode: 404, message: 'Contact not found' };
  }

  return contact;
};

export const createContact = async (contactData) => {
  const contact = await Contact.create(contactData);
  
  return await Contact.findByPk(contact.id, {
    include: [
      { model: Company, as: 'company', attributes: ['id', 'name'] },
      { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName'] },
    ],
  });
};

export const updateContact = async (id, updateData) => {
  const contact = await Contact.findByPk(id);
  
  if (!contact) {
    throw { statusCode: 404, message: 'Contact not found' };
  }

  await contact.update(updateData);
  
  return await Contact.findByPk(id, {
    include: [
      { model: Company, as: 'company', attributes: ['id', 'name'] },
      { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName'] },
    ],
  });
};

export const deleteContact = async (id) => {
  const contact = await Contact.findByPk(id);
  
  if (!contact) {
    throw { statusCode: 404, message: 'Contact not found' };
  }

  await contact.destroy();
  return { message: 'Contact deleted successfully' };
};
