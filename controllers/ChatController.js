import ChatModel from '../models/ChatModel.js'

export const createChat = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params
        const alreadyExists = await ChatModel.findOne({
            members: {
                $all: [
                    { $elemMatch: { $eq: senderId } },
                    { $elemMatch: { $eq: receiverId } }
                ]
            }
        });
        console.log(alreadyExists, "alredtt");
        if (!alreadyExists) {

            const newChat = new ChatModel({
                members: [senderId, receiverId]
            });
            const result = await newChat.save()
            return res.status(200).json(result)
        } else {
            return res.json({ success: false, message: "Chat already exists!" })
        }

    } catch (error) {
        return res.status(500).json(error)
    }
};

export const userChats = async (req, res) => {
    try {
        const { userId } = req.params

        const chat = await ChatModel.find({
            members: { $in: [userId] }
        }).populate({
            path: "members",
            select: "username imageUrls",
            match: { _id: { $ne: userId } },
            model: 'Owner'
        })
        const Members = await ChatModel.find({
            members: { $in: [userId] }
        })

        return res.status(200).json({ success: true, message: "Data fetched successfully", chat, Members })

    } catch (error) {
        res.status(500).json(error)
    }
}

export const ownerChats = async (req, res) => {
    try {
        const { ownerId } = req.params
        console.log(ownerId, "99)))))");
        const chat = await ChatModel.find({
            members: { $in: [ownerId] }
        }).populate({
            path: "members",
            select: "username imageUrls",
            match: { _id: { $ne: ownerId } },
            model: 'User'
        })
        const Members = await ChatModel.find({
            members: { $in: [ownerId] }
        })
        return res.status(200).json({ success: true, message: "Data fetched successfully", chat, Members })

    } catch (error) {
        res.status(500).json(error)
    }
}

export const findChat = async (req, res) => {
    try {
        const chat = await ChatModel.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] }
        })
        return res.status(200).json(chat)
    } catch (error) {
        return res.status(500).json(error)
    }
}