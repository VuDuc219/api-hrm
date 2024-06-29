import mongoose, {Schema}  from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  dateOfBirth: {
    type: Date,
  },
  avatar: String,
  bio: String,
  address: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  isBan: {
    type: Boolean,
    default: false
  },
  full_name: String,
  uuid: String,
  create_by: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
}, { timestamps: true });

// Create a 2dsphere index on the location field
// Place the index creation line right after you’ve defined the schema and before you compile the schema into a model 
// with mongoose.model. This ensures that the index is created when the model is used for the first time, allowing for 
// efficient geospatial queries on the location field.
userSchema.index({ location: '2dsphere' });

const User = mongoose.model('Users', userSchema);

export default User;
