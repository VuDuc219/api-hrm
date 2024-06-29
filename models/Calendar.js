import mongoose, { Schema } from "mongoose";

const calendarSchema = new Schema({
    day: Number,
    month: Number,
    year: Number,
    is_holiday: {
        type: Boolean,
        default: false,
    },
    is_day_off: {
        type: Boolean,
        default: false
    },
    note: String,
    uuid: String
});

const Post = mongoose.model('Calendars', calendarSchema);
export default Post;