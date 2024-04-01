import User from "../models/userModel.js";
import env from 'dotenv'
env.config()
import OTP from '../models/otpModel.js'
import Property from '../models/PropertyModel.js'
import bcrypt from "bcrypt"
import createSecretToken from '../utils/secretToken.js'
import jwt from "jsonwebtoken"
import Booking from "../models/BookModel.js";
import Stripe from 'stripe'
import mailSender from "../utils/mailSender.js";
import otpGenerator from 'otp-generator'
import Wishlist from "../models/WishlistModel.js";
import Reserve from "../models/ReserveModal.js";
import { isValidObjectId } from 'mongoose';
import Category from "../models/CategoryModel.js";
import Owner from "../models/ownerModel.js";
import { ObjectId } from "mongodb";



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
        if (username === '' && password === '' && mobile === "" && email === "") {
            return res.json({ success: false, message: "please add the required field" })
        } else {
            console.log(email, "sighhhhh");
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
                    imageUrls: null,
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
        }
    } catch (error) {
        console.log(error);
    }
}

export const UserLogin = async (req, res) => {
    try {

        console.log("fgfdddddddddddddddddddddddddddd");
        const { email, password } = req.body;
        console.log(email, password, "emailllllllllllllllllllllllllll");
        const userExist = await User.findOne({ email: email });


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
                let token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
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

export const forgotPass = async (req, res) => {
    try {
        const { email } = req.body
        const UserEmail = await User.find({ email: email })
        console.log(UserEmail, "useremaillllllllllllllllllllll");
        if (UserEmail) {
            return res.status(200).json({ success: true, message: "email is existing", UserEmail })
        }
    } catch (error) {
        console.log(error);
    }
}

export const resetPassword = async (req, res) => {
    try {

        const { password, email } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        } else {
            const hashedPassword = await securePassword(password);
            const updatedUser = await User.updateOne({ email: email }, { $set: { password: hashedPassword } });
            return res.status(200).json({ updatedUser, success: true, message: "Password updated successfully" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const GooglAuthRegister = async (req, res) => {
    console.log('enter to backend controller');
    try {
        const { id, email, name, mobile } = req.body
        console.log(email);
        const hash = await securePassword(id)
        const user = await User.findOne({ email: email });
        if (!user) {

            let Googleuser = new User({
                username: name,
                googleId: id,
                email: email,
                password: hash,
                mobile: mobile || "1111111111",
                is_google: true
            })

            const GoogleData = await Googleuser.save()
            console.log("GoogleDAta saved Successfully", GoogleData);

            let UserToken = jwt.sign({ id: GoogleData._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
            const token = await createSecretToken(GoogleData._id)
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false
            })
            if (UserToken) {
                return res.status(200).json({
                    success: true,
                    message: "User Logged In",
                    token,
                    UserToken,
                    GoogleData
                });
            }
        } else {
            let UserToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
            return res.status(200).json({
                success: true,
                message: "Login data fetched",
                UserToken,
                user
            });
        }
    } catch (error) {
        console.log(error.message);
    }
}


export const GetProperty = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid property ID format" });
        }
        const property = await Property.findOne({ _id: id });
        if (property) {
            return res.status(200).json({ success: true, message: "Property fetched successfully!", data: property });
        } else {
            return res.status(404).json({ success: false, message: "Property not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const GetPropertyData = async (req, res) => {
    try {
        const property = await Property.find({})
        if (property) {
            return res.status(200).json({ success: true, message: "Properties Fetched Successfully!", data: property });
        } else {
            return res.json({ success: false, message: "Failed to fetch property" })
        }
    } catch (error) {
        console.log(error);
    }
}

export const CheckIsBooked = async (req, res) => {
    console.log("CheckIsBooked");
    try {
        const { id } = req.params
        console.log(id, "iddddddd");
        const property = await Property.findOne({ _id: id })
        console.log(property.is_Booked, "isbokk ceckkk");
        if (property.is_Booked === false) {
            return res.status(200).json({ success: true, message: "Properties Booking On process!", property });
        } else {
            return res.json({ success: false, message: "Propert is already Booked", property })
        }
    } catch (error) {
        console.log(error);
    }
}


export const Payment = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id, "idddddd");
        const stripe = new Stripe(process.env.STRIPE_KEY)
        const property = await Property.findById({ _id: id })
        console.log(property, "propertyy");
        const RentAmount = property.Rent

        const paymentIntent = await stripe.paymentIntents.create({
            amount: RentAmount * 100,
            currency: "inr",
            automatic_payment_methods: {
                enabled: true
            },
        })
        return res.status(200).send({ success: true, message: "client id passed to client", clientSecret: paymentIntent.client_secret, RentAmount })

    } catch (error) {
        console.log(error);
    }
}

export const PaymentSuccess = async (req, res) => {
    console.log("enter to payment success");
    try {
        const { data, userId, ownerId } = req.body
        const { id } = req.params
        const rent = await Property.findById({ _id: id })
        console.log(rent, "7777");
        const booking = await Booking.findOne({ email: data.email })
        if (
            data.name.trim() === "" ||
            data.contact.trim() === "" ||
            data.email.trim() === '' ||
            data.re_location.trim() === ""
        ) {
            return res.json({ success: false, message: "Please add the required data" });
        } else {

            if (!booking) {
                const property = await Property.findOneAndUpdate(
                    { _id: id },
                    { $set: { is_Booked: true } }
                )
                const hideProperty = await Property.findOneAndUpdate(
                    { _id: id },
                    { $set: { is_hide: true } }
                )
                const NewBooking = new Booking({
                    username: data.name,
                    mobile: data.contact,
                    property_id: id,
                    user_id: userId,
                    owner_id: ownerId,
                    Rent: rent.Rent,
                    email: data.email,
                    payment_type: 'Stripe',
                    bookingStatus: "Success",
                    relocationDate: data.relocationDate,
                    is_canceled: false
                })
                NewBooking.save()

                return res.status(200).json({ success: true, message: "Property booked Successfull", property });
            } else {
                return res.json({ success: false, message: "Property is already Booked" })

            }
        }
    } catch (error) {
        console.log(error);
    }
}

export const PaymentHistory = async (req, res) => {
    try {
        const history = await Booking.find({}).sort([['date', -1]]);
        if (history) {
            return res.status(200).json({ success: true, message: "Got the payment history", history })
        } else {
            return res.json({ success: false, message: "error while fetching payment history" })
        }
    } catch (error) {
        console.log('PaymentHistoryy', error);
    }
}
export const cancelPayment = async (req, res) => {
    try {
        const { propId } = req.body
        const { id } = req.params
        const history = await Booking.findOne({ _id: id })
        const rentAmount = history.Rent
        if (history) {
            const updateHistory = await Booking.updateOne(
                { _id: id },
                { $set: { is_canceled: true } }
            )
            const updateProperty = await Property.findByIdAndUpdate(
                { _id: propId },
                { $set: { is_Booked: false, is_hide: false } }
            )

            const user = await User.findById(history.user_id);
            if (user) {
                user.wallet += rentAmount;
                await user.save();
            }

            return res.status(200).json({ success: true, message: "Booking Canceled", updateHistory, updateProperty, history })
        } else {
            return res.json({ success: false, message: "error while fetching payment history" })
        }
    } catch (error) {
        console.log('PaymentHistoryy', error.message);
    }
}

export const ResendOtp = async (req, res) => {
    try {
        const { email } = req.body
        const result = await User.findOne({ email: email })
        if (result) {

            let otp = otpGenerator.generate(4, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });

            let result = await OTP.findOne({ otp: otp });
            while (result) {
                otp = otpGenerator.generate(4, {
                    upperCaseAlphabets: false,
                });
                result = await OTP.findOne({ otp: otp });
            }
            const otpPayload = { email, otp };
            const otpBody = await OTP.create(otpPayload);
            mailSender(
                email,
                "Resend OTP",
                "Your  OTP for registration is : " + otp
            )
            return res.json({ success: true, message: 'OTP Re-Sent Successfully', otp })
        } else {
            return res.json({ success: false, message: "Error while re-sending the Otp" })
        }
    } catch (error) {
        console.log(error);
    }
}

export const GetProfileData = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.params.id })
        if (userData) {
            return res.status(200).json({ success: true, message: "Profile data fetched successfully", userData })
        } else {
            return res.json({ success: false, message: "Error while fetching data" })
        }
    } catch (error) {
        console.log(error);
    }
}
export const GetPaginateProperty = async (req, res) => {
    try {
        const { page = 1, pageSize = 6, propertyType, searchTitle, searchLocation, minpriceRange, maxpriceRange } = req.params;


        const query = { is_hide: false, is_verified: true, is_pending: false, is_Booked: false }

        if (propertyType !== "null") {
            query.type = propertyType;
        }

        if (searchLocation != 0 || searchTitle != 0) {
            query.$or = [
                { location: { $regex: searchLocation, $options: "i" } },
                { name: { $regex: searchTitle, $options: "i" } },
            ];
        }
        if (minpriceRange != 0 && maxpriceRange != 0) {
            query.Rent = { $gte: minpriceRange, $lte: maxpriceRange };
        }

        const PropertyData = await Property.find(query)
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
};

export const AddToWishlist = async (req, res) => {
    try {
        const { name, imageUrls, type, rent, ownerId, userRef } = req.body
        const addData = await Wishlist.findOne({ name: name })
        if (addData) {
            return res.status(200).json({ success: false, message: "error while saving data" })
        } else {
            const NewSavedData = new Wishlist({
                name: name,
                Rent: rent,
                type: type,
                ownerRef: ownerId,
                userRef: userRef,
                imageUrls: imageUrls,
            })
            NewSavedData.save()
            return res.status(200).json({ success: true, message: "Property saved to wishlist", NewSavedData })
        }
    } catch (error) {
        console.log(error);
    }
}
export const getWishlistData = async (req, res) => {
    try {
        const getData = await Wishlist.find({})
        if (getData) {
            return res.status(200).json({ success: true, message: "Property Fetched from wishlist", getData })
        } else {
            return res.json({ success: false, message: "error while fetching data" })
        }
    } catch (error) {
        console.log(error);
    }
}
export const AddProfileImage = async (req, res) => {
    console.log("hiiii");
    try {
        const { id } = req.params
        const imageUrl = req.body
        const AddProfileImage = await User.findByIdAndUpdate(
            { _id: id },
            { $set: { imageUrls: imageUrl } }
        )
        return res.status(200).json({ success: true, message: "Profile Image added", AddProfileImage })
    } catch (error) {
        console.log(error);
    }
}
export const EditProfileData = async (req, res) => {
    try {
        const { id } = req.params
        const formData = req.body
        const editProfile = await User.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    username: formData.name,
                    email: formData.email,
                    mobile: formData.mobile
                }
            }
        )
        return res.status(200).json({ success: true, message: "Profile Data Updated", editProfile })
    } catch (error) {
        console.log(error);
    }
}
export const ReserveProperty = async (req, res) => {
    try {
        const { propertyId } = req.params
        const { reserveData, userId, ownerId } = req.body
        const reserve = await Reserve.findOne({ _id: propertyId })
        if (!reserve) {
            const newReserve = new Reserve({
                username: reserveData.name,
                mobile: reserveData.contact,
                email: reserveData.email,
                interest: reserveData.interest,
                OwnerRef: ownerId,
                Property_id: propertyId,
                UserRef: userId
            })
            newReserve.save()
            return res.status(200).json({ success: true, message: "Property Reserved!", reserve, newReserve })
        } else {
            return res.json({ success: false, message: "Reservation unsuccessfull!" })
        }
    } catch (error) {
        console.log(error);
    }
}

export const FetchReservations = async (req, res) => {
    try {
        const enquiryData = await Reserve.find({})
        if (enquiryData) {
            return res.status(200).json({ success: true, message: "Data fetched successfully!", enquiryData })
        } else {
            return res.json({ success: false, message: "Error while fetching data!" })
        }
    } catch (error) {
        console.log(error);
    }
}
export const ShareProperty = async (req, res) => {
    try {
        const { propId } = req.params;
        const share = req.body;
        const property = await Property.findOne({ _id: propId });
        const possibleName = share.email.split('@')[0];

        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://aurora.varlet.online'//add domain here after hosting
            : 'http://localhost:5000';

        const propertyLink = `${baseUrl}/property/${property._id}`;

        const message = `
        Hi ${possibleName},

        I'm excited to share a property that I think you might be interested in. It's located at ${property.location}.
        <br/>
        To learn more about this property, <a href="${propertyLink}">click here</a>.
        <br/>
        I'm confident you'll love the quiet neighborhood and convenient location. Feel free to reach out if you have any questions.
        <br/>
        <p><strong>P.S. The property also features a recently renovated kitchen with stainless steel appliances!</strong></p>
        
        Thank you`;

        if (property) {
            mailSender(
                share.email,
                'Share Property',
                message
            );
            return res.status(200).json({ success: true });
        } else {
            return res.json({ success: false, message: "Property does not exist!" });
        }
    } catch (error) {
        console.log(error);
    }
};

export const FetchCategory = async (req, res) => {
    try {
        const categoryList = await Category.find({})
        if (categoryList) {
            return res.status(200).json({ success: true, message: "Category Fetching Successfull", categoryList })
        } else {
            return res.status(500).json({ success: false, message: "Error while fetching Data" });
        }
    } catch (error) {
        console.log("categoryList Data", error);
    }
}
export const getPropertyData = async (req, res) => {
    try {
        const { id } = req.params
        const propertyList = await Property.find({ _id: id })
        if (propertyList) {
            return res.status(200).json({ success: true, message: "propertyList Fetching Successfull", propertyList })
        } else {
            return res.status(500).json({ success: false, message: "Error while fetching Data" });
        }
    } catch (error) {
        console.log("categoryList Data", error);
    }
}
export const walletPayment = async (req, res) => {
    try {
        const { propId, userId, ownerId, data } = req.body
        const propertyList = await Property.findOne({ _id: propId })
        const PropertyRent = propertyList.Rent
        if (propertyList) {
            const userList = await User.findOne({ _id: userId })
            const wallet = userList.wallet;
            if (wallet >= PropertyRent) {
                const updateWallet = await User.findByIdAndUpdate(
                    { _id: userId },
                    { $inc: { wallet: -PropertyRent } }
                )
                const propertyList = await Property.updateOne(
                    { _id: propId },
                    { $set: { is_Booked: true, is_hide: true } }
                )
                const newBooking = await Booking({
                    username: data.name,
                    mobile: data.contact,
                    property_id: propId,
                    user_id: userId,
                    owner_id: ownerId,
                    Rent: PropertyRent,
                    email: data.email,
                    payment_type: 'Wallet',
                    bookingStatus: "Success",
                    relocationDate: data.re_locationDate,
                    is_canceled: false
                })
                newBooking.save()

                return res.status(200).json({ success: true, message: "Wallet payment successfull!", updateWallet, userList, propertyList })
            } else {
                return res.json({ success: false, message: "Wallet Balance is not enough to buy this!", userList, propertyList });
            }
        } else {
            return res.json({ success: false, message: "We couldn't find the property!" })
        }


    } catch (error) {
        console.log("categoryList Data", error);
    }
}

export const GetWalletHistory = async (req, res) => {
    try {
        const Wallethistory = await Booking.find({ payment_type: "Wallet" })
        console.log(Wallethistory, "wallet history dataaa");
        if (Wallethistory) {
            return res.status(200).json({ success: true, message: "wallet payment data fetched successfully!", Wallethistory })
        } else {
            return res.json({ success: false, message: "Error while fetching data!" })
        }
    } catch (error) {
        console.log(error);
    }
}
export const GetChatOwnerToSidebar = async (req, res) => {
    try {
        const loggedinUserId = req.headers.userId
        const filteredUsers = await User.find({ _id: { $ne: loggedinUserId } }).select('-password');
        if (filteredUsers) {
            const filteredOwners = await Owner.find({})
            return res.status(200).json({ success: true, filteredOwners })
        } else {
            return res.json({ success: false, message: "Error while fetching data!" })
        }
    } catch (error) {
        console.log(error);
    }
}

export const getOwnerData = async (req, res) => {
    try {
        const OwnerData = await Owner.find({})
        if (OwnerData) {
            return res.status(200).json({ success: true, message: "Successfully fetched ownerData", OwnerData })
        } else {
            return res.json({ success: false, message: "error while fetching data" })
        }
    } catch (error) {
        console.log(error);
    }
}

export const GetChatUserToSidebar = async (req, res) => {
    try {
        const filteredUsers = await User.find({})
        if (filteredUsers) {
            return res.status(200).json({ success: true, filteredUsers })
        } else {
            return res.json({ success: false, message: "Error while fetching data!" })
        }
    } catch (error) {
        console.log(error);
    }
}
export const ResetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const details = req.body;
        const resetPassword = await User.findOne({ _id: id });

        if (resetPassword) {
            const comparePass = await bcrypt.compare(details.oldPassword, resetPassword.password);
            if (comparePass) {
                if (details.oldPassword === details.newPassword) {
                    return res.json({ success: false, message: "Old and new passwords must be different." });
                } else {
                    const hashedPassword = await securePassword(details.newPassword);
                    const newPassword = await User.updateOne(
                        { _id: id },
                        { $set: { password: hashedPassword } },
                        { new: true }
                    );

                    return res.status(200).json({ success: true, message: "Password updated successfully", resetPassword });
                }
            } else {
                return res.json({ success: false, message: "Incorrect old password." });
            }
        } else {
            return res.json({ success: false, message: "Error while Updating Password!" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

