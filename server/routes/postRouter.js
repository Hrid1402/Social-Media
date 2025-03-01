import express from 'express'
import {verifyToken} from '../config/passport.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const postRouter = express.Router()

postRouter.post('/create', verifyToken, async(req, res)=>{
    console.log('Creating post');
    const {content, photos} = req.body;
    console.log(content);
    console.log(photos);
    try {
        const newPost = await prisma.post.create({
            data:{
                content: content,
                photos: photos,
                author:{
                    connect: {id: req.user.id}
                }
            }
        });
        if(!newPost){
            return res.status(404).json({ error: "Couldn't create post" });
        }
        res.json(newPost);
    } catch (error) {
        console.log("Error trying to create post", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
})
postRouter.get('/', async(req, res)=>{
    const {username} = req.query;
    console.log('Get post from', username);
    try {
        const profile = await prisma.user.findFirst({
            where:{
                username: username
            }, select:{
                posts: {
                    orderBy:{
                        createdAt: 'desc'
                    }
                }
            }
        })
        if(!profile){
            return res.status(404).json({ error: "Couldn't get posts from profile" });
        }
        console.log(profile.posts);
        res.json(profile.posts)
    } catch (error) {
        console.log("Error getting posts from profile", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    } 
})
postRouter.get('/:id', async(req, res)=>{
    const {id} = req.params;
    console.log('Get post with id ', id);
    try {
        const post = await prisma.post.findUnique({
            where:{
                id: id
            }, include:{
                author: true,
                likes: true
            }
        })
        if(!post){
            return res.status(404).json({ error: "Couldn't get post from id" });
        }
        console.log(post);
        res.json(post)
    } catch (error) {
        console.log("Error getting post from id", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    } 
})

//feed
postRouter.get('/feed/guest', async(req,res)=>{
    console.log("Getting feed as guest");
    const {cursor} = req.query;
    const PAGE_SIZE = 20;
    try {
        const feed = await prisma.post.findMany({
            take: PAGE_SIZE,
            skip: cursor ? 1 : 0,
            cursor: cursor ? {id:cursor} : undefined,
            include: {
                author: true,
                _count: { 
                    select: { 
                        likes: true,
                        comments: true
                    },
                }
            },
            orderBy: [
                { likes: { _count: 'desc' } },
                { comments: { _count: 'desc' } },
                { createdAt: 'desc' }
              ]
        });
        if(!feed){
            return res.status(404).json({ error: "Couldn't get feed for guest" });
        }
        return res.json(feed);
    } catch (error) {
        console.log("Error getting feed for guest", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
});

postRouter.get('/feed/followers', verifyToken,async(req,res)=>{
    console.log("Getting feed as user");
    const {cursor, followers} = req.query;
    const PAGE_SIZE = 20;
    try {
        const feed = await prisma.post.findMany({
            where:{
                authorId: {in: followers}
            },
            take: PAGE_SIZE,
            skip: cursor ? 1 : 0,
            cursor: cursor ? {id:cursor} : undefined,
            include: {
                author: true,
                _count: { 
                    select: { 
                        likes: true,
                        comments: true
                    },
                }
            },
            orderBy: [
                { createdAt: 'desc' }
              ]
        });
        if(!feed){
            return res.status(404).json({ error: "Couldn't get feed for user" });
        }
        return res.json(feed);
    } catch (error) {
        console.log("Error getting feed for user", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
});

postRouter.delete('/:postId', verifyToken, async(req,res)=>{
    const {postId} = req.params;
    console.log(postId);
    try {
        const deleted = await prisma.post.deleteMany({
            where: {
                id: postId,
                authorId: req.user.id,
            },
        });
        console.log('deleted', deleted);
        if (deleted.count === 0) {
            return res.status(403).json({ error: "Unauthorized or post not found" });
        }
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("Error deleting post", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
});

postRouter.put('/:postId', verifyToken, async(req,res)=>{
    const {postId} = req.params;
    const {content, photos} = req.body;
    console.log(content, photos);
    try {
        const updatedPost = await prisma.post.updateMany({
            where: {
                id: postId,
                authorId: req.user.id,
            },data:{
                content: content,
                photos: photos
            }
        });
        console.log('updated', updatedPost);
        if (updatedPost.count === 0) {
            return res.status(403).json({ error: "Unauthorized or post not found" });
        }
        res.json({ message: "Post updated successfully" });
    } catch (error) {
        console.log("Error update post data", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
});