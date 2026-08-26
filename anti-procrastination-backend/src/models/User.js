import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    passwordHash: String,
});

export default mongoose.model('User', userSchema);
