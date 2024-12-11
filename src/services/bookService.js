import books from '../models/book.js';
import { pagination } from '../libs/pagination.js';

export const getAllBooks = async (params) => {
  try {
    const { title, author, page = 1, limit = 10 } = params;

    const totalCount = await books.getAllBooks(
      title,
      author,
      page,
      limit,
      true
    );

    const bookResults = await books.getAllBooks(title, author, page, limit);

    return pagination({
      result: bookResults.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        published_year: book.published_year,
        stock: book.stock,
        isbn: book.isbn,
        available: book.stock > 0,
      })),
      count: totalCount,
      limit,
      page,
    });
  } catch (error) {
    throw error;
  }
};
