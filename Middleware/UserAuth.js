import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

import dotenv from "dotenv";
dotenv.config();

export const UserAuth = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization;
            const decoded = jwt.verify(token, process.env.JWT_SECRET,
                async (err, decoded) => {
                    if (err) {
                        return res.status(401).json({ message: "Token expired please login" });
                    } else {
                        const user = await User.findOne({
                            _id: decoded.id,
                        });
                        if (user) {
                            if (user.is_block === false) {
                                req.headers.userId = decoded.id;

                                next();
                            } else {
                                return res
                                    .status(403)
                                    .json({ message: "You are blocked by admin " });
                            }
                        } else {
                            return res
                                .status(400)
                                .json({ message: "user not authorised or inavid user" });
                        }
                    }
                }
            );
        } else {
            return res.status(400).json({ message: "user not authorised" });
        }
    } catch (error) {
        console.log(error.message);
    }
}