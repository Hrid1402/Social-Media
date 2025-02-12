import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()
import 'dotenv/config'

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    passReqToCallback   : true
    },
    async function(req, accessToken, refreshToken, profile, done) {
        const {id, displayName, email, picture} = profile;
        console.log('------------')
        console.log(displayName);
        console.log(email);
        console.log(picture);
        console.log('------------')
        try{
            let user = await prisma.user.findUnique({
                where:{
                    id: id
                }
            });
            if(!user){
                user = await prisma.user.create({
                    data:{
                        id:id,
                        username: displayName,
                        email: email,
                        picture: picture
                    }
                })
            }
            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
            return done(null, {...user, token});
        }catch(error){
            console.error('Auth Error:', error);
            return done(error, null);
        }
    }
));

export async function verifyToken(req, res, next){
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where:{
                id: decodedToken.id
            }
        });
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}