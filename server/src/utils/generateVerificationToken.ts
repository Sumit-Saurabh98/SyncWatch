/**
 * Generates a random 6-digit verification code
 * @returns A string containing a 6-digit code
 */
export const generateVerificationCode = (): string =>{
    const min: number = 100000;
    const max: number = 1000000;
    
    const randomNumber: number = Math.floor(Math.random() * (max - min)) + min;
    
    return randomNumber.toString();
}

