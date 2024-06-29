import mongoose, { Schema } from "mongoose";

const logTimeSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'Users', required: true},
    calendar_id: {type: Schema.Types.ObjectId, ref: 'Calendar', required: true},
    log_time: [{type: String}],
    is_late: {
        type: Boolean,
        default: false
    },
    total_time: Number,
});

const Post = mongoose.model('LogTimes', logTimeSchema);
export default Post;