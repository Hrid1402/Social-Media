import express from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import {verifyToken} from '../config/passport.js'

export const likeRouter = express.Router();


likeRouter.get("/posts", verifyToken, async(req, res) => {
    try {
        const likes = await prisma.user.findUnique({
            where:{
                id: req.user.id
            },include:{
                likes: {
                    where:{
                        commentId: null
                    }
                }
            }
        })
        if(!likes){
            return res.status(404).json({ error: "Couldn't get likes" });
        }
        res.json(likes.likes);
    } catch (error) {
        console.log("Error trying to get likes", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
})

likeRouter.get("/fullPosts", verifyToken, async(req, res) => {
    try {
        const likes = await prisma.user.findUnique({
            where:{
                id: req.user.id
            },include:{
                likes: {
                    where:{
                        commentId: null
                    },
                    include:{
                        post: true
                    }
                }
            }
        })
        if(!likes){
            return res.status(404).json({ error: "Couldn't get full post likes" });
        }
        res.json(likes.likes);
    } catch (error) {
        console.log("Error trying to get full post likes", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
})

likeRouter.get("/comments", verifyToken, async(req, res) => {
    try {
        const likes = await prisma.user.findUnique({
            where:{
                id: req.user.id
            },include:{
                likes: {
                    where:{
                        postId: null
                    }
                }
            }
        })
        if(!likes){
            return res.status(404).json({ error: "Couldn't get likes" });
        }
        res.json(likes.likes);
    } catch (error) {
        console.log("Error trying to get likes", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
})


likeRouter.post("/addLikePost", verifyToken, async(req, res) => {
    const { postId } = req.body;
    try {
        const like = await prisma.like.create({
            data:{
                post: {
                    connect: {id: postId}
                },
                user:{
                    connect: {id: req.user.id}
                }
                
            }
        })
        if(!like){
            return res.status(404).json({ error: "Couldn't like post" });
        }
        console.log(like);
        res.json(like);
    } catch (error) {
        console.log("Error trying to like post", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
})

likeRouter.post("/removeLikePost", verifyToken, async(req, res) => {
    const { postId } = req.body;
    try {
        const like = await prisma.like.delete({
            where:{
                postId_userId:{
                    postId: postId,
                    userId: req.user.id
                }
            }
        })
        if(!like){
            return res.status(404).json({ error: "Couldn't remove like from post" });
        }
        console.log(like);
        res.json(like);
    } catch (error) {
        console.log("Error trying to remove like from post", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
})

likeRouter.post("/addLikeComment", verifyToken, async(req, res) => {
    const { commentId } = req.body;
    try {
        const like = await prisma.like.create({
            data:{
                comment: {
                    connect: {id: commentId}
                },
                user:{
                    connect: {id: req.user.id}
                }
            }
        })
        if(!like){
            return res.status(404).json({ error: "Couldn't like comment" });
        }
        console.log(like);
        res.json(like);
    } catch (error) {
        console.log("Error trying to like comment", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
})

likeRouter.post("/removeLikeComment", verifyToken, async(req, res) => {
    const { commentId } = req.body;
    try {
        const like = await prisma.like.delete({
            where:{
                commentId_userId:{
                    commentId: commentId,
                    userId: req.user.id
                }
            }
        })
        if(!like){
            return res.status(404).json({ error: "Couldn't remove like from comment" });
        }
        console.log(like);
        res.json(like);
    } catch (error) {
        console.log("Error trying to remove like from comment", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
})