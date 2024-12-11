import borrows from '../models/borrowing.js';
import books from '../models/book.js';
import members from '../models/member.js';

export const createBorrow = async (params) => {
  const { book_id, member_id, status = 'BORROWED', page, limit } = params;

  const checkStock = await books.getBookById(book_id);
  if (checkStock.stock <= 0) {
    throw { name: 'InsufficientStock', message: 'Book is out of stock' };
  }

  const borrowHistory = await members.getBorrowsHistory(
    member_id,
    status,
    page,
    limit,
    true
  );

  if (borrowHistory > 3) {
    throw {
      name: 'MaxBorrows',
      message: 'Member has borrowed 3 books',
    };
  }

  const newBorrow = await borrows.createBorrow(book_id, member_id, new Date());
  await books.updateBookStock(book_id, checkStock.stock - 1);
  return newBorrow;
};

export const updateBorrow = async (params) => {
  const { id } = params;
  const updatedBorrow = await borrows.updateBorrow(id);
  const updateStock = await books.getBookById(updatedBorrow.book_id);
  await books.updateBookStock(updateStock.id, updateStock.stock + 1);
  return updatedBorrow;
};
