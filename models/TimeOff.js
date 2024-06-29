import mongoose, { Schema } from "mongoose";

const timeOffSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'Users', required: true},
    note: String,
    type: {
        type: String,
    enum: ['nghi-phep', 'nghi-khong-luong', 'cham-bu']
    },
    time_start: String,
    time_end: String,
    is_accept: {
        type: Boolean,
        default: false
    },
});

const Post = mongoose.model('TimeOffs', timeOffSchema);
export default Post;