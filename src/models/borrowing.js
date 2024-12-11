import pool from '../config/database.js';

export default class borrows {
  static async createBorrow(book_id, member_id, borrow_date) {
    const checkBorrow = `
    SELECT EXISTS (
      SELECT 1
      FROM borrowings
      WHERE book_id = $1 AND member_id = $2
      ) AS borrowed_exists
      `;

    const existingBorrow = await pool.query(checkBorrow, [book_id, member_id]);
    if (existingBorrow.rows[0].borrowed_exists) {
      throw {
        name: 'NotFound',
        message: 'Book is already borrowed by this member',
      };
    }

    const createBorrowing = `
      INSERT INTO borrowings (book_id, member_id, borrow_date)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(createBorrowing, [
      book_id,
      member_id,
      borrow_date,
    ]);
    return result.rows[0];
  }

  static async updateBorrow(id) {
    const checkBorrow = `
    SELECT EXISTS (
      SELECT 1
      FROM borrowings
      WHERE id = $1 AND status = 'BORROWED'
    ) AS borrowed_exists
    `;

    const existingBorrow = await pool.query(checkBorrow, [id]);
    const { borrowed_exists } = existingBorrow.rows[0];

    if (!borrowed_exists) {
      throw { name: 'NotFound', message: 'Book is not borrowed' };
    }

    const updateBorrow = `
      UPDATE borrowings
      SET status = 'RETURNED', return_date = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(updateBorrow, [id]);
    return result.rows[0];
  }
}
