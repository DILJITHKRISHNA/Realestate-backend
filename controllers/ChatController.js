import ChatModel from '../models/ChatModel.js'

export const createChat = async (req, res) => {
    const newChat = new ChatModel({
        members: [req.body.senderId, req.body.receiverId]
    });

    try {
        const result = await newChat.save()
       return res.status(200).json(result)
    } catch (error) {
       return res.status(500).json(error)
    }
};

export const userChats = async (req, res) => {
    try {
        const { userId } = req.params

        const chat = await ChatModel.find({
            members: {$in: [userId]}
        }).populate({
            path: "members",
            select: "username imageUrls",
            match: {_id: {$ne: userId}},
            model: 'Owner'
        })
        const Members = await ChatModel.find({
            members: {$in: [userId]}
        })

       return res.status(200).json({success: true, message:"Data fetched successfully", chat, Members})
        
    } catch (error) {
        res.status(500).json(error)
    }
}

export const ownerChats = async (req, res) => {
    try {
        const { ownerId } = req.params
        console.log(ownerId,"99)))))");
        const chat = await ChatModel.find({ 
            members: {$in: [ownerId]}
        }).populate({
            path: "members",
            select: "username imageUrls",
            match: {_id: {$ne: ownerId}},
            model: 'User'
        })
        const Members = await ChatModel.find({ 
            members: {$in: [ownerId]}
        })
        return res.status(200).json({success: true, message:"Data fetched successfully", chat, Members})
        
    } catch (error) {
        res.status(500).json(error)
    }
}

export const findChat = async (req, res) => {
    try {
        const chat = await ChatModel.findOne({
            members: {$all: [req.params.firstId, req.params.secondId]}
        })
       return res.status(200).json(chat)
    } catch (error) {
      return res.status(500).json(error)
    }
}