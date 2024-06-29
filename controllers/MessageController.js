import Conversations from '../models/Conversation.js';
import message from '../models/Message.js';


//create a new message
const createMessage = async (req, res) => {
    const {conversationId, senderId, text} = req.body;

    console.log(conversationId, senderId, text);
    if(!conversationId || !senderId || !text) {
        return res.status(404).json({
            message: "ERROR"
        });
    }
        
    try {
        const newMessage = await message.create({
            conversationId, 
            senderId, 
            text
        })

        const updateConversation = await Conversations.findByIdAndUpdate(conversationId, {
            $set: {
                isRead: [senderId],
                newMessage: {
                    message: text,
                    senderId
                }
            }
        })
        return res.status(200).json(newMessage);
    } catch (error) {
        res.status(404).json(error);
    }
};

//getMessagess
const getMessages = async (req, res) => {
    const {conversationId} = req.params;
   
    try {
        const messages = await message.find({
            conversationId: conversationId
        })
        console.log('messages', messages);
        return res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
};

export {
    createMessage,
    getMessages
}

export default{
    createMessage,
    getMessages
}