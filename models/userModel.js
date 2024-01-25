import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        require:true,
    },
    mobile: {
        type: Number,
        required: true
    },
    is_block: {
        type: Boolean
    },
    is_Active: {
        type: Boolean
    }
    // role: {
    //     type: String,
    //     enum: ['Admin', 'User', 'Owner']
    // }
},
    { timestamps: true })

const User = mongoose.model('User', userSchema)
export default User