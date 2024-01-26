import mongoose from "mongoose"


const ownerSchema = new mongoose.Schema({
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
        type: Boolean,
        default: false
    },
    is_Active: {
        type: Boolean,
        default: false
    }
})

const Owner = mongoose.model('Owner', ownerSchema)
export default Owner