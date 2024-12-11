import pool from '../config/database.js';

export default class books {
  static async getAllBooks(title, author, page, limit, count) {
    const offset = (page - 1) * limit;
    const queryParams = [];

    if (count) {
      let countBooks = `
        SELECT COUNT(*) AS total
        FROM books
        WHERE 1=1
      `;

      if (title) {
        countBooks += ` AND title ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${title}%`);
      }

      if (author) {
        countBooks += ` AND author ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${author}%`);
      }

      const result = await pool.query(countBooks, queryParams);
      return result.rows[0].total;
    }

    let query = `
        SELECT *
        FROM books
        WHERE 1=1
    `;

    if (title) {
      query += ` AND title ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${title}%`);
    }

    if (author) {
      query += ` AND author ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${author}%`);
    }

    query += ` LIMIT $${queryParams.length + 1} OFFSET $${
      queryParams.length + 2
    }`;

    queryParams.push(limit, offset);
    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      throw {
        name: 'NotFound',
        message: 'No books found',
      };
    }

    return result.rows;
  }

  static async getBookById(id) {
    const getBookById = `
      SELECT *
      FROM books
      WHERE id = $1
    `;
    const result = await pool.query(getBookById, [id]);
    return result.rows[0];
  }

  static async updateBookStock(id, stock) {
    const updateBookStock = `UPDATE books SET stock = $2 WHERE id = $1`;
    const result = await pool.query(updateBookStock, [id, stock]);
    return result.rows[0];
  }
}
