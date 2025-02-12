import express from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const searchRouter = express.Router();

searchRouter.get("/user", async (req, res)=>{
    const {username} = req.query;
    if (!username || username.trim() === '') {
        return res.status(400).json({message: 'Error, cannot search empty username'});
      }
    try {
        const users = await prisma.user.findMany({
            where:{
                username: {
                    startsWith: username,
                    mode: 'insensitive'
                }
            },
            select:{
                id: true,
                username: true,
                picture: true
            }
        });
        res.json(users);
    } catch (error) {
        console.error("Error searching users", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

searchRouter.get("/userByName", async (req, res)=>{
    const {username} = req.query;
    if (!username || username.trim() === '') {
        return res.status(400).json({message: 'Error, cannot search empty username'});
      }
    try {
        const user = await prisma.user.findFirst({
            where:{
                username: username
            },
            select:{
                id: true,
                username: true,
                description: true,
                picture: true,
                followers: true,
                following: true
            }
        });
        if(!user){
            return res.status(404).json({ error: "Profile not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

