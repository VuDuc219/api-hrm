
import { getVideoDurationInSeconds } from 'get-video-duration';
import fs from 'fs'
import { videoService } from '../services/index.js';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import VideoSerivce from '../services/VideoSerivce.js';

ffmpeg.setFfmpegPath(ffmpegPath.path);
const uploadStory = async (req, res) => {
    try {
        const userId = req.userId;
        let video;
        await getVideoDurationInSeconds(req.file.path).then((duration) => {
            console.log(duration);
            video = duration;
        })
        if (video > 60) {
            fs.unlinkSync(req.file.path);
            throw new Error('The video is longer than the allowed length!');
        }
        const thumbnailName = "public\\videos\\thumbnail\\" + req.userId + Date.now() + ".png";
        generateThumbnail(req.file.path, 'public/videos/thumbnail', req.userId + Date.now() + ".png");
        const story = await videoService.uploadVideo(userId, req.file.path, thumbnailName);
        res.status(200).json({
            message: 'successfully',
            data: {
                userId: story.userId,
                path: story.path
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.toString()
        })
    }
}

function generateThumbnail(videoPath, thumbnailPath, thumbnailName) {
    ffmpeg(videoPath)
        .takeScreenshots({
            timemarks: ["5"],
            filename: thumbnailName,
            folder: thumbnailPath,
            count: 1,
            size: '280x500'
        })
        .on('end', function () {
            console.log('Thumbnail generated successfully');
        })
        .on('error', function (err) {
            console.error('Error generating thumbnail: ' + err.message);
        });
}
const deleteStory = async (req, res) => {
    try {
        await videoService.deleteVideo(req.params.storyId);
        res.status(200).json({
            message: 'Delete successfully!'
        })
    } catch (error) {
        res.status(500).json({
            message: error.toString()
        })
    }
}

const getStory = async (req, res) => {
    try {
        const stories = await videoService.getStories(req.userId);
        const authorArr = [];
        var userIdMap = {};
        stories.forEach((story) => {
            if (story.userId._id.toString() !== req.userId && !userIdMap[story.userId._id.toString()]) {
                userIdMap[story.userId._id.toString()] = true;
                authorArr.push({
                    userId: story.userId._id.toString(),
                    username: story.userId.username,
                    avatar: story.userId.avatar,
                    stories: []
                })
            } else if (story.userId._id.toString() === req.userId && !userIdMap[story.userId._id.toString()]) {
                userIdMap[story.userId._id.toString()] = true;
                authorArr.unshift({
                    userId: story.userId._id.toString(),
                    username: story.userId.username,
                    avatar: story.userId.avatar,
                    stories: []
                });
            }
        })
        const arr = authorArr.map((author) => {
            stories.forEach((story) => {
                if (author.userId === story.userId._id.toString()) {
                    author.stories.push({
                        _id: story._id,
                        path: story.path,
                        thumbnail: story.thumbnail,
                        liked: story.liked || [],
                        viewed: story.viewed || []
                    })
                }
            })
            return author
        })
        res.status(200).json({
            message: 'Get stories successfully!',
            data: arr
        })
    } catch (error) {
        res.status(500).json({
            message: error.toString()
        })
    }
}

const likeVideo = async (req, res) => {
    try {
        const userId = req.userId;
        const storyId = req.body.storyId;
        const liked = await VideoSerivce.likeStory(userId, storyId);
        res.status(200).json({
            message: 'Like story successfully!',
            data: liked
        })
    } catch (error) {
        res.status(500).json({
            message: error.toString()
        })
    }
}

const viewVideo = async (req, res) => {
    try {
        const userId = req.userId;
        const storyId = req.body.storyId;
        const liked = await VideoSerivce.viewStory(userId, storyId);
        res.status(200).json({
            message: 'Like story successfully!',
            data: liked
        })
    } catch (error) {
        res.status(500).json({
            message: error.toString()
        })
    }
}

const getViewer = async (req, res) => {
    try {
        const story = await VideoSerivce.getViewer(req.params.id);
        res.status(200).json({
            message: 'Like story successfully!',
            data: story.viewed
        })
    } catch (error) {
        res.status(500).json({
            message: error.toString()
        })
    }
}

const getAllStoryOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const limit = req.query.limit || 12;
        const offset = req.query.offset || 0;
        const post = await videoService.getAllStoryOfUser(limit, offset, userId);
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

export default {
    uploadStory,
    deleteStory,
    getStory,
    likeVideo,
    viewVideo,
    getViewer,
    getAllStoryOfUser
}