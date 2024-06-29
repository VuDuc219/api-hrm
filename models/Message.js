import mongoose from 'mongoose';
import Conversations from './Conversation.js';


const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Conversations,
        required: true
    },
    senderId: { type: String, required: true },
    text: {
        type: String,
        required: true
    }
},{
    timestamps: true,
})

const messages = mongoose.model('Messages', messageSchema);

export default messages;