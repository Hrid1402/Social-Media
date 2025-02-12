import express from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import {verifyToken} from '../config/passport.js'
export const followerRouter = express.Router();

followerRouter.post("/add", verifyToken, async (req, res)=>{
    const {profileID} = req.body;
    const myID = req.user.id;
    if(profileID == myID){
        console.log("Error, you can't follow yourself");
        return res.status(404).json({ error: "You can't follow yourself" });
    }

    try{
        const followerTable = await prisma.follower.create({
            data:{
                followingUserId: profileID,
                followedUserId: myID
            }
        })
        if(!followerTable){
            return res.status(404).json({ error: "Couldn't follow profile" });
        }
        res.json(followerTable);
    }catch(error){
        console.log("Error trying to follow profile", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
});


followerRouter.post("/delete", verifyToken, async (req, res)=>{
    const {profileID} = req.body;
    const myID = req.user.id;
    console.log(myID, profileID);

    try{
        const followerTable = await prisma.follower.delete({
            where: {
                followingUserId_followedUserId: {
                    followingUserId: profileID,
                    followedUserId: myID
                }
            }
        })
        if(!followerTable){
            return res.status(404).json({ error: "Couldn't unfollow profile" });
        }
        res.json(followerTable);
    }catch(error){
        console.log("Error trying to unfollow profile", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
});

followerRouter.get("/followers", verifyToken, async (req, res)=>{
    const {profileID} = req.query;
    try{
        const profile = await prisma.user.findUnique({
            where:{
                id: profileID
            }, include:{
                followers: {
                    include: {
                        followedUser: true
                    }
                }
            }
        })
        const followers = profile.followers;
        if(!followers){
            return res.status(404).json({ error: "Couldn't get followers" });
        }

        res.json(followers);
    }catch(error){
        console.log("Error getting followers", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
});

followerRouter.get("/followings", verifyToken, async (req, res)=>{
    const {profileID} = req.query;
    try{
        const profile = await prisma.user.findUnique({
            where:{
                id: profileID
            }, include:{
                following: {
                    include: {
                        followingUser: true
                    }
                }
            }
        })
        const following = profile.following;
        if(!following){
            return res.status(404).json({ error: "Couldn't get following" });
        }

        res.json(following);
    }catch(error){
        console.log("Error getting following", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
});

