import User from "../models/userModel.js";
import Owner from "../models/ownerModel.js"
import Category from "../models/category_model.js";
import Kyc from '../models/kyc_model.js'
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

export const getuserDetails = async (req, res) => {
    try {
        const UserDetails = await User.find({ is_Admin: false })
        if (UserDetails) {
            return res.status(200).json({ success: true, message: "successfully gained user data", UserDetails })
        } else {
            return res.json({ success: false, message: "userDetails is not exist" })

        }
    } catch (error) {
        console.log(error);
    }
}

export const getOwnerDetails = async (req, res) => {
    console.log("controllersss");
    try {
        const OwnerDetails = await Kyc.find({ is_approve: true })
        console.log(OwnerDetails, "ownererererer");
        if (OwnerDetails) {
            return res.status(200).json({ success: true, message: "Successfull", OwnerDetails })
        } else {
            return res.json({ success: false, message: "Failed to get the Owner data" })
        }
    } catch (error) {
        console.log(error);
    }
}

export const ListCategory = async (req, res) => {
    console.log("enter to controllererererererjjjjjjjjjjj");
    try {
        const { category } = req.body
        const categoryTypeExist = await Category.findOne({ category: category })
        console.log(categoryTypeExist, "existttttttttttt");
        if (categoryTypeExist) {
            console.log("category already exist");
        } else {
            const CatTypes = new Category({
                category: category
            })
            await CatTypes.save()
            res.status(200).json({ success: true, message: "Category added", CatTypes })
        }
    } catch (error) {
        console.log(error);
    }
}

export const ListKyc = async (req, res) => {
    console.log("enter to list kyc controllerre");
    try {
        const ownerData = await Kyc.find({})
        if (ownerData) {
            return res.status(200).json({ success: true, message: "Kyc data added", ownerData })
        } else {
            return res.json({ success: false, message: "Kyc data is not exist" })
        }

    } catch (error) {
        console.log(error);
    }
}

export const OwnerApproval = async (req, res) => {
    try {
        const id = req.params.id
        const ownerExist = await Kyc.findOne({ _id: id })
        console.log(ownerExist, "hiiiiiiiiiiiiiiiii");
        if (ownerExist) {
            const approved = await Kyc.updateOne(
                { _id: id },
                { $set: { is_approve: !ownerExist.is_approve } })

            console.log(approved, "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
            if (approved) {
                const OwnerUpdate = await Owner.findOne({ email: ownerExist.email })
                console.log(OwnerUpdate, "Ownerupdateeeeeeeeeeeeeeeeeee");
                if(OwnerUpdate){
                    const ownerApprove = await Owner.updateOne({email: ownerExist.email},{$set: {is_Kyc: !OwnerUpdate.is_Kyc}})
                    console.log(ownerApprove,"ownerrrrrrapprovveeeeeeee");
                    return res.status(200).json({ success: true, message: "Approved", OwnerUpdate })
                }else{
                    return res.json({ success: false, message: "not approved" })
                }
            } else {
                return res.json({ success: false, message: "not approved" })
            }
        } else {
            return res.json({ success: false, message: "not approved" })
        }
    } catch (error) {
        console.log(error);
    }
}

export const getCategoryDetails = async (req, res) => {
    console.log("enter to getcategory detailssss");
    try {
        const categoryData = await Category.find({})
        if (categoryData) {
            return res.status(200).json({ success: true, message: "category listed successfully", categoryData })
        } else {
            return res.json({ success: false, message: "failed to list category" })
        }
    } catch (error) {
        console.log(error);
    }
}

export const UserblockHandle = async (req, res) => {
    console.log("enter to user block handle controller");
    try {
        const { id } = req.params
        const UserData = await User.findOne({ _id: id })

        if (!UserData.is_block == true) {
            const Updatedata = await User.updateOne(
                { _id: id },
                { $set: { is_block: true } }
            )
            console.log(Updatedata, "updated dataaaaaaaa");
            return res.status(200).json({ success: true, message: "Successfully Unblocked User", Updatedata, UserData })
        } else {
            const newData = await User.updateOne(
                { _id: id },
                { $set: { is_block: false } }
            );
            console.log(newData, "newww");
            console.log(UserData, "userdataaaa");
            return res.json({ success: true, message: "Successfully Unblocked User", newData, UserData });
        }
    } catch (error) {
        console.log(error);
    }
}

export const OwnerblockHandle = async (req, res) => {
    console.log("enter to Owner block handle controller");
    try {
        const { id } = req.params
        const OwnerData = await Owner.findOne({ _id: id })
        if (OwnerData) {
            const Updatedata = await Owner.updateOne(
                { _id: id },
                { $set: { is_block: !OwnerData.is_block } }
            )
            console.log(Updatedata, "updated dataaaaaaaa");
            return res.status(200).json({ success: true, message: "Successfully Unblocked Owner", Updatedata, OwnerData })
        } 
    } catch (error) {
        console.log(error);
    }
}
