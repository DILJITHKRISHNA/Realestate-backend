import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();


export const AdminAuth = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization;
            console.log(JSON.parse(token), "admin tokennnn");
            const decoded = jwt.verify(JSON.parse(token), process.env.JWT_SECRET);
            console.log(decoded.id, "admin decoded token");
            const admin = await User.findOne({
                _id: decoded.id,
                is_Admin: true,
            });
            if (admin) {
                req.headers.adminId = decoded.id;
                next();
            } else {
                return res
                    .status(400)
                    .json({ message: "user not authorised or invalid user" });
            }
        } else {
            return res.status(400).json({ message: "user not authorised" });
        }
    } catch (error) {
        console.log(error.message);
    }
};