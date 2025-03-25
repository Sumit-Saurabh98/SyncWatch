import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

passport.serializeUser((user: any, done) =>{
    done(null, user._id);
})

passport.deserializeUser(async (_id:string, done) =>{
    try {
        const user = await User.findById(_id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
})

// Google Strategy

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile.emails?.[0].value });

                if (user) {
                    return done(null, user);
                }

                // Create new user if does not exist
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails?.[0].value,
                    googleId: profile.id,
                    profilePicture: profile.photos?.[0].value,
                    emailVerified:true
                });

                return done(null, user);
            } catch (error) {
                return done(error as Error, undefined);
            }
        }
    )
);


export default passport;