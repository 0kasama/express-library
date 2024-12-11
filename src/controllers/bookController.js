import * as bookService from '../services/bookService.js';

export const getAllBooks = async (req, res) => {
  try {
    const result = await bookService.getAllBooks(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
