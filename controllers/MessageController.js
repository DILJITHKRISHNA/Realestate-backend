import Promise from "mongoose"
import Conversation from "../models/ConversationModel.js"
import Message from "../models/MessageModel.js"

export const SendMessage = async (req, res) => {
    try {
        const { userId: receiverId } = req.params;
        const senderId = req.headers.userId;
        console.log(receiverId, senderId, "00990099");
        const message = req.body;
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!conversation) {
            conversation = await Conversation.create({ participants: [senderId, receiverId], messages: [] });
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            message: message.message
        });

        conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);


        res.status(200).json({
            success: true,
            message: "New message sent successfully!",
            newMessage,
            conversation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const GetMessage = async (req, res) => {
    try {
        const { id: userChatId } = req.params;
        const senderId = req.headers.userId;
        console.log(userChatId, senderId, "usercagt idd , sender idd");

        const textChats = await Conversation.findOne({
            participants: { $in: [senderId, userChatId] }
        }).populate("messages");

        if (!textChats) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const messages = textChats.messages || [];
        res.status(200).json({ success: true, message: "Message passed successfully", messages, textChats });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};