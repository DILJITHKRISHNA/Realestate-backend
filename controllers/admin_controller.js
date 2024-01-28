import User from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const loginAdmin = async (req, res) => {
    console.log("enter to controllerrrrrr");
    try {
        const { email, password } = req.body
        console.log(email);
        const admin = await User.findOne({ is_Admin: true })
        if (admin) {
            const validPass = await bcrypt.compare(password, admin.password)

            if (!validPass) {
                console.log("invalid password");
                return res.json({ success: false, message: "invalid password" })
            } else {
                let token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
                return res.status(200).json({ success: true, message: "Admin Logged succesfully", token: token, admin: admin })
            }
        }

    } catch (error) {
        console.log(error.message);
    }
}

export const getuserDetails = async(req, res) => {
    console.log("enter to admin controllerrrrrr");
    try {
        const UserDetails = await User.find({is_Admin: false})
        console.log(UserDetails,"usedetailsssssssssssssss");
        if(UserDetails){
            return res.status(200).json({success: true, message: "successfully gained user data", UserDetails})
        }else{
            return res.json({success: false, message: "userDetails is not exist"})
            
        }
    } catch (error) {
        console.log(error);
    }
}