import { Op } from 'sequelize';
import models from '../models/index.js';

const { Task, User, Contact, Deal } = models;

export const getTasks = async (query) => {
  const {
    page = 1,
    limit = 20,
    status,
    priority,
    assigneeId,
    creatorId,
  } = query;

  const offset = (page - 1) * limit;
  const where = {};

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  if (assigneeId) {
    where.assigneeId = assigneeId;
  }

  if (creatorId) {
    where.creatorId = creatorId;
  }

  const { rows, count } = await Task.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    include: [
      { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName'] },
      { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
      { model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName'] },
      { model: Deal, as: 'deal', attributes: ['id', 'title'] },
    ],
    order: [['dueDate', 'ASC']],
  });

  return {
    tasks: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
    },
  };
};

export const getTaskById = async (id) => {
  const task = await Task.findByPk(id, {
    include: [
      { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'email'] },
      { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'email'] },
      { model: Contact, as: 'contact' },
      { model: Deal, as: 'deal' },
    ],
  });

  if (!task) {
    throw { statusCode: 404, message: 'Task not found' };
  }

  return task;
};

export const createTask = async (taskData) => {
  const task = await Task.create(taskData);
  
  return await Task.findByPk(task.id, {
    include: [
      { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName'] },
      { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
    ],
  });
};

export const updateTask = async (id, updateData) => {
  const task = await Task.findByPk(id);
  
  if (!task) {
    throw { statusCode: 404, message: 'Task not found' };
  }

  await task.update(updateData);
  
  return await Task.findByPk(id, {
    include: [
      { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName'] },
      { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
    ],
  });
};

export const completeTask = async (id) => {
  const task = await Task.findByPk(id);
  
  if (!task) {
    throw { statusCode: 404, message: 'Task not found' };
  }

  await task.update({
    status: 'completed',
    completedAt: new Date(),
  });
  
  return task;
};

export const deleteTask = async (id) => {
  const task = await Task.findByPk(id);
  
  if (!task) {
    throw { statusCode: 404, message: 'Task not found' };
  }

  await task.destroy();
  return { message: 'Task deleted successfully' };
};
