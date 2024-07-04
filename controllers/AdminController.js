import User from "../models/userModel.js";
import Owner from "../models/ownerModel.js"
import Category from "../models/CategoryModel.js";
import Kyc from '../models/KycModel.js'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mailSender from '../utils/mailSender.js'
import Property from "../models/PropertyModel.js";
import Booking from "../models/BookModel.js"
import Reserves from '../models/ReserveModal.js'

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
                let token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "24h" })
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
        console.log(UserDetails, "jiuuuu");
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
    try {
        const OwnerDetails = await Kyc.find({ is_approve: true })
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

        const categoryTypeExist = await Category.findOne({ category: { $regex: new RegExp(category, 'i') } });

        console.log(categoryTypeExist, "existttttttttttt");

        if (categoryTypeExist) {
            console.log("category already exists");
            return res.json({ success: false, message: "Category already exists" })
        } else {
            const CatTypes = new Category({
                category: category
            })
            await CatTypes.save()
            return res.status(200).json({ success: true, message: "Category added", CatTypes })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
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

export const KycApproval = async (req, res) => {
    try {
        const id = req.params.id
        const ownerExist = await Kyc.findOne({ _id: id })
        if (ownerExist) {
            const approved = await Kyc.updateOne(
                { _id: id },
                { $set: { is_approve: !ownerExist.is_approve, is_pending: false } })

            if (approved) {
                const OwnerUpdate = await Owner.findOne({ email: ownerExist.email })
                if (OwnerUpdate) {
                    const ownerApprove = await Owner.updateOne({ email: ownerExist.email }, { $set: { is_Kyc: !OwnerUpdate.is_Kyc } })

                    if (!OwnerUpdate.is_Kyc) {

                        await mailSender(OwnerUpdate.email, "VarLet - Owner Request Update",
                            `<p>Dear ${OwnerUpdate.username},</p>
                        <p>We are pleased to inform you that your KYC request has been approved by the admin. Your account is now verified.</p>
                        <p>Thank you for choosing VarLet.</p>
                        <p>Best regards,<br>VarLet</p>`
                        );
                    } else {

                        await mailSender(OwnerUpdate.email, "VarLet - Owner Request Update",
                            `<p>Dear ${OwnerUpdate.username},</p>
                        <p>We regret to inform you that your KYC request has been rejected by the admin. Please review the provided information and resubmit if necessary.</p>
                        <p>If you have any questions, feel free to contact our support team.</p>
                        <p>Best regards,<br>Your Company Name</p>`
                        );
                    }
                    return res.status(200).json({ success: true, message: "Approved", OwnerUpdate, ownerApprove });
                } else {
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
        UserData.is_block = !UserData.is_block
        UserData.save()        
        if (UserData.is_block) {
            const Updatedata = await User.updateOne(
                { _id: id },
                { $set: { is_block: false } }
            );
            console.log(Updatedata, "updated dataaaaaaaa");
            return res.status(200).json({ success: true, message: "Successfully Unblocked User", Updatedata, UserData });
        } else {
            const newData = await User.updateOne(
                { _id: id },
                { $set: { is_block: true } }
            );
            console.log(newData, "newww");
            console.log(UserData, "userdataaaa");
            return res.json({ success: true, message: "Successfully Blocked User", newData, UserData });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const OwnerblockHandle = async (req, res) => {
    console.log("enter to Owner block handle controller");
    try {

        const { OwnerId } = req.params

        console.log(req.params, "iiiiiiiiii");
        const OwnerData = await Owner.findOne(OwnerId)
        console.log(OwnerData, "................................");
        if (OwnerData) {
            const Updatedata = await Owner.updateOne(
                { _id: OwnerData._id },
                { $set: { is_block: !OwnerData.is_block } }
            )
            console.log(Updatedata, "updated dataaaaaaaa");
            return res.status(200).json({ success: true, message: "Successfully Unblocked Owner", Updatedata, OwnerData })
        }
    } catch (error) {
        console.log(error);
    }
}

export const handleBlockCategory = async (req, res) => {
    try {
        const { id } = req.params
        console.log(req.params, "ooo");
        console.log(id, "iddidididididi");

        const categoryExist = await Category.findOne({ _id: id })
        console.log(categoryExist.is_block, "exisssssss");
        if (categoryExist) {
            const UpdateCat = await Category.updateOne(
                { _id: id },
                { $set: { is_block: !categoryExist.is_block } }
            )
            return res.status(200).json({ success: true, message: "Successfull", UpdateCat, categoryExist })
        } else {
            return res.json({ success: false, message: "Action failed" })
        }
    } catch (error) {

    }
}

export const getPropertydetails = async (req, res) => {
    console.log("enter to getProperty Details controller");
    try {
        const propertyDetails = await Property.find({})
        if (propertyDetails) {
            return res.status(200).json({ success: true, message: "Successfully got the  details of properties ", data: propertyDetails });
        } else {
            return res.json({ success: false, message: "Failed to get Details" })
        }
    } catch (error) {
        console.log(error);
    }
}

export const PropertyStatusUpdate = async (req, res) => {
    console.log("enter to PropertyStatusUpdate controller");
    try {
        const { id } = req.params;
        const { action } = req.body;

        const propertyDetails = await Property.findOne({ _id: id });
        console.log(propertyDetails, "propertydetailssss in status function");

        if (propertyDetails) {
            let updateData = {};

            if (action === 'approve') {
                updateData = { is_verified: true, is_pending: false };
            } else if (action === 'disapprove') {
                updateData = { is_verified: false, is_pending: false };
            } else {
                return res.json({ success: false, message: "Invalid action" });
            }

            const updatedStatus = await Property.updateOne(
                { _id: id },
                { $set: updateData }
            );

            console.log(propertyDetails, "detaillssss");
            console.log(updatedStatus, "statusssssssssssssss");

            return res.status(200).json({
                success: true,
                message: "Action successful",
                updatedStatus,
                propertyDetails,
            });
        } else {
            return res.json({ success: false, message: "Failed to change status" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getBookingData = async (req, res) => {
    try {
        const Bookingdata = await Booking.find({})
        console.log(Bookingdata, "dataaa");
        if (Bookingdata) {
            return res.status(200).json({ success: true, message: "Data fetched successfully.", data: Bookingdata });
        } else {
            return res.json({ success: false, message: " Error while fetching data" })
        }
    } catch (error) {
        console.log("getBooking Data", error);
    }
}

export const PropertyDetails = async (req, res) => {
    console.log("enter to property Details controller");
    try {
        const { id } = req.params
        console.log(id, "000000000");
        const propertyDetails = await Property.find({ _id: id })
        if (propertyDetails) {
            return res.status(200).json({ success: true, message: "Successfully got the  details of properties ", data: propertyDetails });
        } else {
            return res.json({ success: false, message: "Failed to get Details" })
        }
    } catch (error) {
        console.log(error);
    }
}
export const EditCategory = async (req, res) => {
    console.log("enter to Edit Category controller");
    try {
        const { id } = req.params
        const { category } = req.body
        const CategoryDetails = await Category.findOne({ _id: id })
        const isExist = await Category.findOne({ category: { $regex: new RegExp(category, 'i') } })
        if (CategoryDetails && !isExist) {
            const updateCategory = await Category.updateOne(
                { _id: id },
                { $set: { category: category } }
            )
            return res.status(200).json({ success: true, message: "Category Updated successfully ", updateCategory });
        } else {
            return res.json({ success: false, message: "Category with same name already exists!", isExist })
        }

    } catch (error) {
        console.log(error);
    }
}

export const GetPaginateProperty = async (req, res) => {
    try {
        const { page = 1, pageSize = 6 } = req.params;

        const PropertyData = await Property.find({})
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize))
            .exec();

        const totalProperties = await Property.countDocuments();

        if (PropertyData) {
            const totalPages = Math.ceil(totalProperties / parseInt(pageSize));
            return res.status(200).json({
                success: true,
                message: "PropertyData fetched successfully",
                PropertyData,
                totalPages,
            });
        } else {
            return res.json({ success: false, message: "Error while fetching data" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const GetTotalCount = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const ownerCount = await Owner.countDocuments();

        const monthlyBookings = await Booking.aggregate([
            {
                $group: {
                    _id: { $month: { $toDate: "$createdAt" } },
                    count: { $sum: 1 }
                }
            }
        ]);

        const monthlyReservations = await Reserves.aggregate([
            {
                $group: {
                    _id: { $month: { $toDate: "$createdAt" } },
                    count: { $sum: 1 }
                }
            }
        ]);

        const TotalRent = await Booking.aggregate([
            { $group: { _id: null, totalRent: { $sum: "$Rent" } } }
        ]);
        const TotalBookings = await Booking.countDocuments();
        const TotalReserve = await Reserves.countDocuments();

        return res.status(200).json({
            success: true,
            message: "successfully got the counts!",
            userCount,
            ownerCount,
            TotalRent: TotalRent.length > 0 ? TotalRent[0].totalRent : 0,
            TotalBookings,
            TotalReserve,
            monthlyBookings,
            monthlyReservations
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
