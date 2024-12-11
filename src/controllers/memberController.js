import * as member from '../services/memberService.js';

export const createMember = async (req, res, next) => {
  try {
    const result = await member.createMember(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getBorrowsHistory = async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
      status: req.query.status,
      page: +req.query.page || 1,
      limit: +req.query.limit || 10,
    };
    const result = await member.getBorrowsHistory(params);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
