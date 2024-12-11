import borrows from '../models/borrowing.js';
import books from '../models/book.js';
import members from '../models/member.js';

export const getAllBorrows = async () => {
  try {
    const data = await borrows.getAll();
    return data;
  } catch (error) {
    throw error;
  }
};

export const createBorrow = async (params) => {
  try {
    const { book_id, member_id, status = 'BORROWED', page, limit } = params;

    const checkStock = await books.getBookById(book_id);
    if (checkStock.stock <= 0) {
      throw new Error('Book is out of stock');
    }

    const borrowHistory = await members.getBorrowsHistory(
      member_id,
      status,
      page,
      limit,
      true
    );
    if (borrowHistory.length > 3) {
      throw new Error('Member already has a borrowed more than 3 books');
    }

    const newBorrow = await borrows.createBorrow(
      book_id,
      member_id,
      new Date()
    );

    await books.updateBookStock(book_id, checkStock.stock - 1);
    return newBorrow;
  } catch (error) {
    throw error;
  }
};
