import bcrypt from "bcryptjs";

/**
 * Hashes a password using bcrypt with a salt round of 10
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

/**
 * Verifies a password against its hashed version
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Generates a 6-digit verification code
 */
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Creates an expiry date for verification codes
 * @param minutes Number of minutes until expiry
 */
export const generateExpiryTime = (minutes: number): Date => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

/**
 * Checks if a given date has expired
 */
export const isCodeExpired = (expiryDate: Date): boolean => {
  return !expiryDate || expiryDate < new Date();
};

/**
 * Verifies if a provided code matches the stored code
 */
export const checkVerifyCode = (userCode: string, storedCode: string): boolean => {
  return userCode === storedCode;
};
