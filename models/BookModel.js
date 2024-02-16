import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    mobile: {
        type: Number,
    },
    re_location: {
        type: Date,
    },
    email: {
        type: String,
    },
    is_canceled: {
        type:Boolean
    }
},{timestamps: true})

const Booking = mongoose.model('Booking', bookSchema)
export default Booking