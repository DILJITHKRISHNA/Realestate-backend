import User from "../models/userModel.js";
import OTP from '../models/otpModel.js'
import bcrypt from "bcrypt"
import createSecretToken from '../utils/secretToken.js'
import jwt from "jsonwebtoken"

const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (err) {
      console.log(err.message);
    }
  };

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
            return res.json({
                success: false,
                message: 'User Already Exists',
            });
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
            return res.json({
                success: false,
                message: 'User not found, please sign up'
            });
        } else {
            const isMatch = await bcrypt.compare(password, userExist.password);
            console.log(isMatch, "ISmATCHHHHH");
            if (!isMatch) {
                return res.json({
                    success: false,
                    message: 'Invalid Password',
                });
            } else {
                let token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                return res.status(200).json({
                    success: true,
                    token: token,
                    user: userExist,
                    message: "User Logged In"
                });
            }
        }
    } catch (error) {
        console.error('Error in UserLogin:', error);
        return res.status(500).json({
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

export const GooglAuthRegister = async(req, res) => {
    console.log('enter to backend controller');
    try {
        const {id, email, name, mobile} = req.body
        console.log(email);
        const hash = await securePassword(id)
        const user = await User.findOne({email: email});
        if(!user){

            let Googleuser = new User({
                username: name,
                googleId : id ,
                email: email,
                password: hash,
                mobile: mobile || "1111111111",
                is_google: true
            })
            
            const GoogleData = await Googleuser.save()
            console.log("GoogleDAta saved Successfully",GoogleData);
            
            if(GoogleData){
                const token = await createSecretToken(GoogleData._id)
                res.cookie("token", token, {
                    withCredentials: true,
                    httpOnly: false
                })
                if(token){
                    return res.status(200).json({
                        success:true,
                        message:"User Logged In",
                        token
                    });
                }
            }
        }else{
            console.log("User Already Exists");
            return res.json({
                success:false,
                message:"User already exists",
            });            
        }
    } catch (error) {
        console.log(error.message);
    }
}

export const GooglAuthLogin = async(req, res) => {
    try {
        const {email, password} = req.body
        console.log("pkacjuu");
        const user = await User.findOne({email: email})
        if(user){
            const PassMatch = await bcrypt.compare(email, user.email)
            if(PassMatch){
                let token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})
                console.log(token,"token ssjsjsjsjsjsj");
                return res.status(200).json({
                    success: true,
                    message: "Google Logged In",
                    token,
                    user
                })
            }else{
                return  res.status(400).json({
                    success: false,
                    message: 'Invalid Password'
                })
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}