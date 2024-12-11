import * as bookService from '../services/bookService.js';

export const getAllBooks = async (req, res, next) => {
  try {
    const result = await bookService.getAllBooks(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
