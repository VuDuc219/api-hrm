import { postService } from "../services/index.js";
import fs from 'fs'
const createPost = async (req, res) => {
    try {
        const author = req.userId;
        console.log(author);
        let images = [];
        if (req.files) {
            req.files.forEach((file) => {
                images.push(file.path);
            })
        }
        const content = req.body.content;
        const newPost = await postService.createNewPost({ author, content, images });
        res.status(200).json({
            post: newPost
        })
    } catch (e) {
        res.status(500).json({
            messages: e.toString()
        })
    }
}

const getPosts = async (req, res) => {
    try {
        const limit = req.query.limit || 12;
        const offset = req.query.offset || 0;
        const userId = req.userId;
        const post = await postService.getPost(userId, limit, offset);
        res.status(200).json({
            message: "get posts success",
            data: post
        })
    }
    catch (error) {
        res.status(500).json({
            messages: error.toString()
        })
    }
}

const deletePost = async (req, res) => {
    try {
        const images = await postService.deletePost(req.params.id);
        if (images) {
            images.forEach((image) => {
                fs.unlinkSync(`./${image}`)
            })
        }
        res.status(200).json({
            messages: "Delete post sucessfully!"
        });
    } catch (error) {
        res.status(500).json({
            messages: error.toString()
        })
    }
}

const editPost = async (req, res) => {
    try {
        const post = await postService.editPost(req.params.id, req.body.content);
        res.status(200).json({
            messages: "Edit post sucessfully!",
            post: post
        });
    } catch (error) {
        res.status(500).json({
            messages: error.toString()
        })
    }
}

const handleLike = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;
        const favoritePost = await postService.handleLike(postId, userId);
        res.status(200).json(favoritePost);
    } catch (error) {
        res.status(500).json({
            messages: error.toString()
        })
    }
}

const handleDislike = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;
        const favoritePost = await postService.handleDislike(postId, userId);
        res.status(200).json(favoritePost);
    } catch (error) {
        res.status(500).json({
            messages: error.toString()
        })
    }
}

const getPostsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const isUserLogin = req.params.isUserLogin;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const limit = req.query.limit || 12;
        const offset = req.query.offset || 0;
        const post = await postService.getPostsByUserId(limit, offset, userId, isUserLogin);
        res.status(200).json({
            message: "get posts success",
            data: post
        })
    } catch (error) {
        res.status(500).json({
            messages: error.toString()
        })
    }
}

const getPostById = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await postService.getPostById(postId);
        res.status(200).json({
            message: "get post success",
            data: post
        })
    } catch (error) {
        res.status(500).json({
            messages: error.toString()
        })
    }
}

const changePostMode = async (req, res) => {
    try {
        const postId = req.params.postId;
        const modeB = req.body.mode;
        let mode;
        modeB ? mode = true : mode = false;
        const post = await postService.changePostMode(postId, mode);
        res.status(200).json({
            message: "get post success",
            data: post
        })
    } catch (error) {
        res.status(500).json({
            messages: error.toString()
        })
    }
}

export default {
    createPost,
    getPosts,
    deletePost,
    getPostsByUserId,
    editPost,
    handleLike,
    handleDislike,
    getPostById,
    changePostMode
}
