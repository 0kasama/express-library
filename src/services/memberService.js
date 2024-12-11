import members from '../models/member.js';
import { pagination } from '../libs/pagination.js';

export const createMember = async (params) => {
  function validateMember(email, phone) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{1,15}$/;
    return emailRegex.test(email) && phoneRegex.test(phone);
  }

  if (!params.name || !params.email || !params.phone || !params.address) {
    throw { name: 'ValidationError', message: 'Missing required fields' };
  }

  if (!validateMember(params.email, params.phone)) {
    throw {
      name: 'ValidationError',
      message: 'Invalid email or phone number format',
    };
  }
  const newMember = await members.createMember(
    params.name,
    params.email,
    params.phone,
    params.address
  );
  return newMember;
};

export const getBorrowsHistory = async (params) => {
  const { id, status, page, limit } = params;

  const totalCount = await members.getBorrowsHistory(
    id,
    status,
    page,
    limit,
    true
  );

  if (!totalCount) {
    throw { name: 'NotFound', message: 'Borrow history not found' };
  }

  const borrowHistory = await members.getBorrowsHistory(
    id,
    status,
    page,
    limit
  );

  return pagination({
    result: borrowHistory,
    count: totalCount,
    limit,
    page,
  });
};
