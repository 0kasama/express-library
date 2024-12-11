import pool from '../config/database.js';

export default class books {
  static async getAll(
    filterOption = '',
    values = [],
    limit = null,
    offset = null,
    count = false
  ) {
    if (count) {
      const totalBooks = `
        SELECT COUNT(*) AS total
        FROM books
        ${filterOption}
      `;
      const result = await pool.query(totalBooks, values);
      return result.rows[0].total;
    }

    const getAllBooks = `
      SELECT *
      FROM books
      ${filterOption}
      LIMIT $${values.length + 1} OFFSET $${values.length + 2};
    `;

    const result = await pool.query(getAllBooks, [...values, limit, offset]);
    return result.rows;
  }
}
