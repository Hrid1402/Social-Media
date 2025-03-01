import express from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import {verifyToken} from '../config/passport.js'

export const commentRouter = express.Router();


commentRouter.get('/', async(req, res)=>{
    const {postId} = req.query;
    console.log('id to search:', postId)
    try {
        const comments = await prisma.comment.findMany({
            where:{
                postId: postId
            }, include:{
                author: true,
                likes: true,
                parent: {
                    include:{
                        author: true
                    }
                }
            },
            orderBy: [
                { likes: { _count: 'desc' } },
                { createdAt: 'asc' }
              ]
        });
        if(!comments){
            return res.status(401).json({message: 'Error, trying to get comments'});
        }
        return res.json(comments);
    } catch (error) {
        return res.status(500).json({message: 'Server error'});
    }
});
commentRouter.get('/user', verifyToken, async(req, res)=>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                id: req.user.id
            }, include:{
                comments: {
                    include: {
                        parent: {
                            include:{
                                author:true
                            }
                        }
                    }
                }
            }
        });
        if(!user){
            return res.status(401).json({message: 'Error, trying to get comments from user'});
        }
        return res.json(user.comments);
    } catch (error) {
        return res.status(500).json({message: 'Server error'});
    }
});

commentRouter.delete('/:id', verifyToken, async(req, res)=>{
    const {id} = req.params;
    try {
        const result = await prisma.comment.deleteMany({
            where:{
                id: id,
                authorId: req.user.id
            }
        });
        if (result.count === 0) {
            return res.status(404).json({ message: 'Comment not found or not authorized' });
        }
        return res.json({ message: 'Comment deleted' });
    } catch (error) {
        return res.status(500).json({message: 'Server error'});
    }
});

commentRouter.post('/addComment', verifyToken, async(req, res)=>{
    const {postId, commentId, content} = req.body;
    if(postId && !commentId){
        console.log('Post id', postId);
        try {
            const comment = await prisma.comment.create({
                data:{
                    content: content,
                    post: {
                        connect: {id: postId}
                    },
                    author:{
                        connect: {id: req.user.id}
                    }
                }
            });
            if(!comment){
                return res.status(401).json({message: 'Error, no id provided'});
            }
            console.log(comment);
            return res.json(comment);
        } catch (error) {
            return res.status(500).json({message: 'Server error'});
        } 
    }else if(commentId && postId){
        console.log('Comment id', commentId);
        try {
            const comment = await prisma.comment.create({
                data:{
                    content: content,
                    parent: {
                        connect: {id: commentId}
                    },
                    post: {
                        connect: {id: postId}
                    },
                    author:{
                        connect: {id: req.user.id}
                    }
                },include:{
                    author: true,
                    parent: {
                        include: {
                            author: true
                        }
                    },
                    likes: true
                }
            });
            if(!comment){
                return res.status(401).json({message: 'Error, no id provided'});
            }
            console.log(comment);
            return res.json(comment);
        } catch (error) {
            return res.status(500).json({message: 'Server error'});
        } 
    }else{
        return res.status(400).json({message: 'Error, no id provided'});
    }
});

commentRouter.put('/:commentId', verifyToken, async(req, res)=>{
    const {commentId} = req.params;
    const {content} = req.body;
    console.log('update comment data:',commentId, content);
    try {
        const comment = await prisma.comment.update({
            where:{
                id: commentId,
                authorId: req.user.id
            }, data:{
                content: content
            }
        });
        console.log(comment);
        return res.json(comment);
    } catch (error) {
        return res.status(500).json({message: 'Server error'});
        } 

});