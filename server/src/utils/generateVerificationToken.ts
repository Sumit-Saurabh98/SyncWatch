/**
 * Generates a random 6-digit verification code
 * @returns A string containing a 6-digit code
 */
import crypto from 'crypto';

export const generateVerificationCode = (email: string): string => {
    const timestamp = Date.now().toString(); // Ensure uniqueness using current time
    const randomString = crypto.randomBytes(8).toString('hex'); // Add randomness

    return crypto.createHash('sha256')
        .update(email + timestamp + randomString)
        .digest('hex');
};

