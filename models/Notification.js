import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    receiver: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    type: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    sender: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    isRead: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
     timestamps: true 
});

const Notification = mongoose.model('Notifications', notificationSchema);
export default Notification; 