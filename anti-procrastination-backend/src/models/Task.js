import mongoose from "mongoose";

const  taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: "General",
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "complete"],
        default: "todo"
    },
    totalSecondsSpent: {
        type: Number,
        default: 0
    }
},  {
    timestamps: true,
});

export default mongoose.model("Task", taskSchema);