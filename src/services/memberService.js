import members from '../models/member.js';

export const getAllMembers = async () => {
  try {
    const result = await members.getAllMembers();
    return result;
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
