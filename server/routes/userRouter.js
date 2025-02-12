import express from 'express'
import {verifyToken} from '../config/passport.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const userRouter = express.Router();

userRouter.get("/", verifyToken, async (req, res)=>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                id: req.user.id
            }, include:{
                followers: true,
                following: true
            }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

