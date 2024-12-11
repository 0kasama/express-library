import * as bookService from '../services/bookService.js';

export const getAllBooks = async (req, res) => {
  try {
    const params = req.query;
    const result = await bookService.getAllBooks(params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
