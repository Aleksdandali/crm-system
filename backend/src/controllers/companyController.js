import * as companyService from '../services/companyService.js';

export const getCompanies = async (req, res, next) => {
  try {
    const result = await companyService.getCompanies(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getCompany = async (req, res, next) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    res.json(company);
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req, res, next) => {
  try {
    const company = await companyService.createCompany({
      ...req.body,
      ownerId: req.user.userId,
    });
    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const company = await companyService.updateCompany(req.params.id, req.body);
    res.json(company);
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    const result = await companyService.deleteCompany(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
