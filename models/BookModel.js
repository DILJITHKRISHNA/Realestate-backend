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
    bookingStatus: {
        type: String,
        default: "pending",
    },
    Rent: {
        type: Number
    },
    property_id: {
        type: String,
    },
    user_id: {
        type: String,
    },
    owner_id: {
        type: String,
    },
    email: {
        type: String,
    },
    is_canceled: {
        type: Boolean
    }
}, { timestamps: true })

const Booking = mongoose.model('Booking', bookSchema)
export default Booking