import * as borrow from '../services/borrowingService.js';

export const getAllBorrows = async (req, res, next) => {
  try {
    const result = await borrow.getAllBorrows();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createBorrow = async (req, res, next) => {
  try {
    const result = await borrow.createBorrow(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateBorrow = async (req, res, next) => {
  try {
    const result = await borrow.updateBorrow(req.params);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
