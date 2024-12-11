import members from '../models/member.js';
import { pagination } from '../libs/pagination.js';

export const getAllMembers = async () => {
  try {
    const data = await members.getAllMembers();
    return data;
  } catch (error) {
    throw error;
  }
};

export const createMember = async (params) => {
  function validateMember(email, phone) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{1,15}$/;
    return emailRegex.test(email) && phoneRegex.test(phone);
  }

  if (!params.name || !params.email || !params.phone || !params.address) {
    throw new Error('Member data is required');
  }

  if (!validateMember(params.email, params.phone)) {
    throw new Error('Invalid email or phone number');
  }

  try {
    const newMember = await members.createMember(
      params.name,
      params.email,
      params.phone,
      params.address
    );
    return newMember;
  } catch (error) {
    throw error;
  }
};

export const getBorrowsHistory = async (params) => {
  try {
    const { id, status, page, limit } = params;

    const totalCount = await members.getBorrowsHistory(
      id,
      status,
      page,
      limit,
      true
    );

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
  } catch (error) {
    throw error;
  }
};
