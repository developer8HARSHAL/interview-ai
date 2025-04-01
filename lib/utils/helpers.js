import { User } from '@/lib/db/schema';
import { connectDB } from '@/lib/db';

/**
 * Get a user by email
 * @param {string} email - User's email
 * @returns {Promise<Object|null>} - User object or null
 */
export async function getUserByEmail(email) {
  try {
    await connectDB();
    return await User.findOne({ email });
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

/**
 * Create a new user
 * @param {Object} userData - User data object
 * @returns {Promise<Object>} - New user object
 */
export async function createUser(userData) {
  try {
    await connectDB();
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}