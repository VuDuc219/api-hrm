import mongoose, { Schema } from 'mongoose';
import User from './User.js';


const conversationSchema = new mongoose.Schema({
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: User,
        }
    ],
    isRead: [
        {
            type: Schema.Types.ObjectId
        }
    ],
    newMessage: {
        message: String,
        senderId: Schema.Types.ObjectId
    }
}, {
    timestamps: true,
})

const Conversations = mongoose.model('Conversations', conversationSchema);

export default Conversations;