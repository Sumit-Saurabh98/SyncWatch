import {Response} from "express"

export const setCookie = (res:Response, token:string) => {
    res.cookie("synclearn_token", token, {
        httpOnly: true, // prevent XSS attacks
        sameSite: "strict", // prevent CSRF attacks
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
}