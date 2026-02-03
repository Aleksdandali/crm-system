import * as dealService from '../services/dealService.js';

export const getDeals = async (req, res, next) => {
  try {
    const result = await dealService.getDeals(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getDeal = async (req, res, next) => {
  try {
    const deal = await dealService.getDealById(req.params.id);
    res.json(deal);
  } catch (error) {
    next(error);
  }
};

export const createDeal = async (req, res, next) => {
  try {
    const deal = await dealService.createDeal({
      ...req.body,
      ownerId: req.user.userId,
    });
    res.status(201).json(deal);
  } catch (error) {
    next(error);
  }
};

export const updateDeal = async (req, res, next) => {
  try {
    const deal = await dealService.updateDeal(req.params.id, req.body);
    res.json(deal);
  } catch (error) {
    next(error);
  }
};

export const updateDealStage = async (req, res, next) => {
  try {
    const { stage } = req.body;
    const deal = await dealService.updateDealStage(req.params.id, stage);
    res.json(deal);
  } catch (error) {
    next(error);
  }
};

export const deleteDeal = async (req, res, next) => {
  try {
    const result = await dealService.deleteDeal(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
