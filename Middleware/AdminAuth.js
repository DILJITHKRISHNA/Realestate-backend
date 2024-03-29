import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();


export const AdminAuth = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization;
            const decoded = jwt.verify(JSON.parse(token), process.env.JWT_SECRET,
                async (err, decoded) => {
                    if (err) {
                        return res.status(401).send({ msg: 'Unauthorized: Token is invalid' });
                    } else {
                        const admin = await User.findOne({
                            _id: decoded.id,
                            is_Admin: true,
                        });
                        if (admin) {
                            next();
                        } else {
                            return res
                                .status(400)
                                .json({ message: "user not authorised or invalid user" });
                        }
                    }
                });
        } else {
            return res.status(400).json({ message: "user not authorised" });
        }
    } catch (error) {
        console.log(error.message);
    }
};