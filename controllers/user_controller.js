import User from "../models/userModel.js";


export const registerUser = async(req, res)=>{
    
    try {
        const {username, password, email} = req.body
        const userExist = await User.findOne({Email: email});
        if (userExist){
            console.log("user already exist");
        }else{
            const user = new User({
                username : username ,
                password : password ,
                Email : email
            })
            user.save().then(()=>console.log("user saved succesfully",username))
        }
    } catch (error) {
        console.log(error.message);
    }
    
}