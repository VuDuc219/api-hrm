import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema({
    manager: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    content: String,
    member: [{ type: Schema.Types.ObjectId, ref: 'Users', required: true }],
    image: String,
    title: {
        type: String,
        required: true
    },
    isHide: {
        type: Boolean,
        default: false
    },
    uuid: String
}, { timestamps: true });

const Department = mongoose.model('Departments', departmentSchema);
export default Department;