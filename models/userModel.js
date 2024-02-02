import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
    },
    mobile: {
        type: Number,
        required: true
    },
    is_block: {
        type: Boolean,
        default:false
    },
    is_Active: {
        type: Boolean,
        default:false
    },
    is_Admin: {
        type: Boolean,
        default:false
    },
    googleId:{
        type: String,
      },
    is_google: {
        type: Boolean,
        default: false
    }
    // role: {
    //     type: String,
    //     enum: ['Admin', 'User', 'Owner']
    // }
},{ timestamps: true })

const User = mongoose.model('User', userSchema)
export default User