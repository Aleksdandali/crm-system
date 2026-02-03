import * as contactService from '../services/contactService.js';

export const getContacts = async (req, res, next) => {
  try {
    const result = await contactService.getContacts(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const contact = await contactService.getContactById(req.params.id);
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = await contactService.createContact({
      ...req.body,
      ownerId: req.user.userId,
    });
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const contact = await contactService.updateContact(req.params.id, req.body);
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const result = await contactService.deleteContact(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
