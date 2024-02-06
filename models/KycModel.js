import mongoose from "mongoose";

const kycSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    panCard: {
        type: String,
        minlength: 10,
        maxlength: 10,
    },
    occupation: {
        type: String,
    },
    address: {
        type: String
    },
    city:{
        type :String,
    },
    country: {
        type:String,
    },
    zipCode: {
        type: Number,
        maxlength: 6
    },
    state: {
        type: String
    },
    is_approve: {
        type: Boolean,
        default: false
    }
})

const Kyc = mongoose.model('Kyc', kycSchema)
export default Kyc