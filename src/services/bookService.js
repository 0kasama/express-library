import book from '../models/book.js';
import { pagination } from '../libs/pagination.js';

export const getAllBooks = async (params) => {
  const { title, author, page = 1, limit = 10 } = params;
  const offset = (page - 1) * limit;
  const filters = [];
  const values = [];

  if (title) {
    filters.push(`title ILIKE $${values.length + 1}`);
    values.push(`%${title}%`);
  }

  if (author) {
    filters.push(`author ILIKE $${values.length + 1}`);
    values.push(`%${author}%`);
  }

  const filterOption =
    filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  try {
    const books = await book.getAll(filterOption, values, limit, offset);
    const count = await book.getAll(filterOption, values, null, null, true);

    return pagination({
      result: books.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        published_year: book.published_year,
        stock: book.stock,
        isbn: book.isbn,
        available: book.stock > 0,
      })),
      count,
      limit,
      page,
    });
  } catch (error) {
    throw error;
  }
};
