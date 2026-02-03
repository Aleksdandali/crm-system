import * as emailService from '../services/emailService.js';

export const getEmails = async (req, res, next) => {
  try {
    const result = await emailService.getEmails(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getEmail = async (req, res, next) => {
  try {
    const email = await emailService.getEmailById(req.params.id);
    res.json(email);
  } catch (error) {
    next(error);
  }
};

export const sendEmail = async (req, res, next) => {
  try {
    const email = await emailService.sendEmail(req.body, req.user.userId);
    res.status(201).json(email);
  } catch (error) {
    next(error);
  }
};

export const deleteEmail = async (req, res, next) => {
  try {
    const result = await emailService.deleteEmail(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
