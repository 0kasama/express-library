import pool from '../config/database.js';

export default class borrows {
  static async getAll() {
    const getAllBorrows = `SELECT * FROM borrowings`;
    const result = await pool.query(getAllBorrows);
    return result.rows;
  }

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
      throw new Error('Book already borrowed');
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
}
