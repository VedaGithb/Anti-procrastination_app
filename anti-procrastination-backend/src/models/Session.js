import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   taskName: {
       type: String,
       default: "Без названия",
   },
    type: {
        type: String,
        enum: ["work", "short_break", "long_break"],
        default: "work",
    },
    status: {
       type: String,
        enum: ["completed", "abandoned"],
        default: "completed",
    },
   durationSeconds: {
       type: Number,
       required: true,
   },
    startTime: {
       type: Date,
        default: Date.now
    }
   },
    {
       timestamps: true
    });

export default mongoose.model('Session', sessionSchema);