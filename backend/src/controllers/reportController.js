import * as reportService from '../services/reportService.js';

export const getDashboard = async (req, res, next) => {
  try {
    const stats = await reportService.getDashboardStats(req.user.userId, req.user.role);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const getSalesFunnel = async (req, res, next) => {
  try {
    const funnel = await reportService.getSalesFunnel(req.user.userId, req.user.role);
    res.json(funnel);
  } catch (error) {
    next(error);
  }
};

export const getPerformanceReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await reportService.getPerformanceReport(startDate, endDate);
    res.json(report);
  } catch (error) {
    next(error);
  }
};

export const getCustomReport = async (req, res, next) => {
  try {
    const results = await reportService.getCustomReport(req.body);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const saveReport = async (req, res, next) => {
  try {
    const report = await reportService.saveReport(req.body, req.user.userId);
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

export const getUserReports = async (req, res, next) => {
  try {
    const reports = await reportService.getUserReports(req.user.userId);
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (req, res, next) => {
  try {
    const result = await reportService.deleteReport(req.params.id, req.user.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
