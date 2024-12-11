import * as member from '../services/memberService.js';

export const getAllMembers = async (req, res) => {
  try {
    const result = await member.getAllMembers();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMember = async (req, res) => {
  try {
    const result = await member.createMember(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
