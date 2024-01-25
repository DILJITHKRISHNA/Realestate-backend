import User from "../models/userModel.js";
import OTP from '../models/otpModel.js'
import bcypt from "bcrypt"
import createSecretToken from '../utils/secretToken.js'
import jwt from "jsonwebtoken"


export const registerUser = async (req, res) => {

    try {
        const { username, password, mobile, email } = req.body
        if (!username || !email || !password || !mobile) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            });
        }
        const hashedPassword = await bcypt.hash(password, 10);

        const userExist = await User.findOne({ email: email });
        if (userExist) {
            console.log("user already exist");
        } else {
            const userData = new User({
                username: username,
                mobile: mobile,
                password: hashedPassword,
                email: email,
            })
            console.log(userData, "iiiiiiiiiiiiiiiiiiiiii");
            await userData.save()
            const token = createSecretToken(userData._id);
            res.cookie("token", token, {
                httpOnly: false,
                withCredentials: true
            })
            return res.status(201).json({ message: "User signed in successfully", success: true, userData });
        }
    } catch (error) {
        console.log(error);
    }
}

export const UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body.email, "emailllllllllllllllllllllllllll");
        const userExist = await User.findOne( req.body.email );

        console.log(userExist, "userexistttttttttttttttttt");
        if (!userExist) {
            return res.status(400).send({
                success: false,
                message: 'User not found'
            });
        } else {
            const isMatch = await bcypt.compare(password, userExist.password);
            console.log(isMatch, "ISmATCHHHHH");
            if (!isMatch) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid Password',
                });
            } else {
                let token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                return res.status(200).send({
                    success: true,
                    token: token,
                    user: userExist,
                    message: "User Logged In"
                });
            }
        }
    } catch (error) {
        console.error('Error in UserLogin:', error);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

