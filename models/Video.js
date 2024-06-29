import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
    path: {
        type: String,
        required: true,
        unique: true
    },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    thumbnail: {
        type: String,
        required: true,
        unique: true
    },
    liked: [{ type: Schema.Types.ObjectId, ref: 'Users'}],
    viewed: [{ type: Schema.Types.ObjectId, ref: 'Users'}],
    isHide: Boolean
}, { timestamps: true });

const Video = mongoose.model('Videos', videoSchema);
export default Video
