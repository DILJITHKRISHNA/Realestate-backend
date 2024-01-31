import User from "../models/userModel.js";
import OTP from '../models/otpModel.js'
import bcrypt from "bcrypt"
import createSecretToken from '../utils/secretToken.js'
import jwt from "jsonwebtoken"


export const registerUser = async (req, res) => {

    try {
        const { username, password, mobile, email } = req.body
        console.log(email,"sighhhhh");
        if (!username || !email || !password || !mobile) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

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
        console.log(email, "emailllllllllllllllllllllllllll");
        const userExist = await User.findOne({email:email});

        console.log(userExist, "userexistttttttttttttttttt");
        if (!userExist) {
            return res.status(400).send({
                success: false,
                message: 'User not found'
            });
        } else {
            const isMatch = await bcrypt.compare(password, userExist.password);
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

export const forgotPass = async(req, res) => {
    try {
        const {email} = req.body
        const UserEmail =  await User.find({email: email})
        console.log(UserEmail,"useremaillllllllllllllllllllll");
        if(UserEmail){
            return res.status(200).json({success: true, message: "email is existing", UserEmail})
        }
    } catch (error) {
        console.log(error);
    }
}

export const resetPassword = async(req, res) => {
    console.log("enter to controller");
    try {
        const { password } = req.body
        console.log(req.body,"bodyyyyyyy");
        const user = await User.findOne({})
        const hashedPassword = await bcrypt.hash(password, 10);
        const newPass = await User.updateOne(
            {email: user.email},
            {$set:{password: hashedPassword}}
            )

        return res.status(200).json({success: true, message: "Password Updated successfully", newPass})            
    } catch (error) {
        console.log(error);
    }
}
