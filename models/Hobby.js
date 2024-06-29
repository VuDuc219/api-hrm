import mongoose, { Schema } from "mongoose";

const hobbySchema = new Schema({
  hobbyName: String
});

const Hobby = mongoose.model('Hobbies', hobbySchema);
export default Hobby;