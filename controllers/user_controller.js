import User from "../models/userModel.js";
import bcypt from "bcrypt"


export const registerUser = async(req, res)=>{
    
    try {
        const {username, password, mobile, email} = req.body
        if (!username || !email || !password || !mobile) {
            return res.status(403).json({
              success: false,
              message: 'All fields are required',
            });
          }
        const hashedPassword = await bcypt.hash(password, 10);

        const userExist = await User.findOne({email: email});
        console.log(userExist,"oo");
        if (userExist){
            console.log("user already exist");
        }else{
            const userData = new User({
                username : username ,
                mobile: mobile,
                password : hashedPassword ,
                email : email,
            })
            console.log(userData,"iiiiiiiiiiiiiiiiiiiiii");
           await userData.save()
           return res.json({message:"registerd",success:true,userData})

        }
    } catch (error) {
        console.log(error.message);
    }
}