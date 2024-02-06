import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    is_Active: {
        type: Boolean,
        default: false
    },
    is_block: {
        type: Boolean,
        default: false
    }
})

const Category = mongoose.model('Category', categorySchema)
export default Category