import * as borrow from '../services/borrowingService.js';

export const getAllBorrows = async (req, res) => {
  try {
    const result = await borrow.getAllBorrows();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBorrow = async (req, res) => {
  try {
    const result = await borrow.createBorrow(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
