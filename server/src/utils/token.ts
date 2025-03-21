import jwt, { SignOptions } from "jsonwebtoken";

export const signToken = (_id: string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ||
      "24h") as jwt.SignOptions["expiresIn"],
  };
  return jwt.sign({ _id }, process.env.JWT_SECRET!, options);
};
