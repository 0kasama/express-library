import * as member from '../services/memberService.js';

export const getAllMembers = async (req, res) => {
  try {
    const result = await member.getAllMembers();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMember = async (req, res) => {
  try {
    const result = await member.createMember(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBorrowsHistory = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};
