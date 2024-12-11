import pool from '../config/database.js';

export default class members {
  static async getAllMembers() {
    const getAllMembers = `
      SELECT *
      FROM members
    `;
    const result = await pool.query(getAllMembers);
    return result.rows;
  }

  static async createMember(name, email, phone, address) {
    const checkEmail = `
    SELECT EXISTS (
      SELECT 1
      FROM members
      WHERE email = $1
      ) AS email_exists
      `;

    const existingEmail = await pool.query(checkEmail, [email]);
    if (existingEmail.rows[0].email_exists) {
      throw { name: 'Conflict', message: 'Email already exists' };
    }

    const createMember = `
      INSERT INTO members (name, email, phone, address)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `;

    const result = await pool.query(createMember, [
      name,
      email,
      phone,
      address,
    ]);
    return result.rows[0];
  }

  static async getBorrowsHistory(member_id, status, page, limit, count) {
    const offset = (page - 1) * limit;
    const queryParams = [member_id];

    if (status && status !== 'BORROWED' && status !== 'RETURNED') {
      throw { name: 'ValidationError', message: 'Invalid status' };
    }
    if (count) {
      let countBorrows = `
        SELECT COUNT(*) AS total
        FROM borrowings
        JOIN books ON borrowings.book_id = books.id
        WHERE member_id = $1
      `;

      if (status) {
        countBorrows += ` AND status = $2`;
        queryParams.push(status);
      }

      const result = await pool.query(countBorrows, queryParams);
      return result.rows[0].total;
    } else if (count === false) {
      throw { name: 'NotFound', message: 'Borrow history not found' };
    }

    let query = `
        SELECT borrowings.*, books.title, books.author, books.published_year, books.isbn
        FROM borrowings
        JOIN books ON borrowings.book_id = books.id
        WHERE borrowings.member_id = $1
    `;

    if (status) {
      query += ` AND borrowings.status = $2`;
      queryParams.push(status);
    }

    query += ` LIMIT $${queryParams.length + 1} OFFSET $${
      queryParams.length + 2
    }`;

    queryParams.push(limit, offset);
    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      throw { name: 'NotFound', message: 'Borrow history not found' };
    }

    return result.rows;
  }
}
