import mongoose from "mongoose"


const wishlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    Rent: {
        type: String,
        require: true,
    },
    imageUrls: {
        type: Array,
    },
    ownerRef: {
        type: String,
        required: true
    },
    userRef: {
        type: String,
        required: true
    },
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema)
export default Wishlist