import User from '../models/User.js';
import Video from '../models/Video.js';
import VideoSchema from '../models/Video.js'

const uploadVideo = async (userId, path, thumbnail) => {
    try {
        const video = await VideoSchema.create({ path, userId, thumbnail, liked: [], viewed: [] });
        return video;
    } catch (error) {
        throw new Error(error.toString())
    }
}

const deleteVideo = async (path) => {
    try {
        await VideoSchema.deleteOne({ path: path });
    } catch (error) {
        throw new Error(error.toString());
    }
}

const getStories = async (usreId) => {
    try {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const now = new Date();
        var userFriends = await User.findOne({ _id: usreId });
        const stories = await Video.find({ $or: [{ userId: { $in: userFriends.friends } }, { userId: usreId }], createdAt: { $gte: oneDayAgo } }).populate('userId', "username avatar");
        return stories;
    } catch (error) {
        throw new Error(error.toString());
    }
}

const likeStory = async (userId, storyId) => {
    try {
        const likedUpdate = await Video.updateOne({ _id: storyId }, { $push: { liked: userId } })
        return likedUpdate;
    } catch (error) {
        throw new Error(error.toString());
    }
}

const viewStory = async (userId, storyId) => {
    try {
        const likedUpdate = await Video.updateOne({ _id: storyId }, { $push: { viewed: userId } })
        return likedUpdate;
    } catch (error) {
        throw new Error(error.toString());
    }
}

const getViewer = async (storyId) => {
    try {
        console.log("tren");
        console.log(storyId);
        const story = await Video.findOne({ _id: storyId }).populate("viewed", "username").exec();
        console.log("duoi");
        return story;
    } catch (error) {
        throw new Error(error.toString());
    }
}

const getAllStoryOfUser = async (limit, offset, userId) => {
    try {
        const getPosts = await Video.find()
        .sort([['createdAt', -1]])
        .skip(Number(offset))
        .limit(Number(limit))
        .populate('userId', 'username')
        .exec();
        return getPosts;
    } catch (error) {
        throw new Error(error.toString());
    }
}

export default {
    uploadVideo,
    deleteVideo,
    getStories,
    likeStory,
    viewStory,
    getViewer,
    getAllStoryOfUser
}