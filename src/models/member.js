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
      throw new Error('Email already exists');
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
}
