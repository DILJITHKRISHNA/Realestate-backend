import mongoose from "mongoose";

const reserveSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    mobile: {
        type: Number,
        required: true
    },
    interest: {
        type: String,
    },
    OwnerRef: {
        type: String
    },
    UserRef: {
        type: String
    },
    Property_id: {
        type: String
    },
    
}, { timestamps: true })

const Reserve = mongoose.model('Reserve', reserveSchema)
export default Reserve