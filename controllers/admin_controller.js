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