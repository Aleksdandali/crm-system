import * as integrationService from '../services/integrationService.js';

export const getIntegrations = async (req, res, next) => {
  try {
    const integrations = await integrationService.getIntegrations();
    res.json(integrations);
  } catch (error) {
    next(error);
  }
};

export const updateIntegration = async (req, res, next) => {
  try {
    const integration = await integrationService.updateIntegration(req.params.id, req.body);
    res.json(integration);
  } catch (error) {
    next(error);
  }
};

export const sync1C = async (req, res, next) => {
  try {
    const result = await integrationService.sync1CData();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const syncShineShop = async (req, res, next) => {
  try {
    const result = await integrationService.syncShineShopData();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const handle1CWebhook = async (req, res, next) => {
  try {
    const result = await integrationService.handle1CWebhook(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const handleShineShopWebhook = async (req, res, next) => {
  try {
    const result = await integrationService.handleShineShopWebhook(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
