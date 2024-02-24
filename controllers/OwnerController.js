import bcrypt from "bcrypt"
import createSecretToken from '../utils/secretToken.js'
import Owner from "../models/ownerModel.js";
import OTP from "../models/otpModel.js";
import otpGenerator from 'otp-generator'
import jwt from 'jsonwebtoken'
import Kyc from "../models/KycModel.js";
import Property from "../models/PropertyModel.js";
import Bookings from '../models/BookModel.js'
import cloudinary from "../utils/cloudinary.js";

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (err) {
        console.log(err.message);
    }
};

export const ownerSignup = async (req, res) => {
    console.log("entered to owner signup");
    try {
        const { username, password, mobile, email } = req.body;
        console.log(req.body, "datas from owner controller");
        console.log(email, "fsdkjhkjfhkj");

        if (!username || !email || !password || !mobile) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const ownerExist = await Owner.findOne({ email: email });

        if (ownerExist) {
            console.log("owner already exists");
            return res.status(409).json({
                success: false,
                message: 'Owner already exists',
            });
        } else {
            const ownerData = new Owner({
                username: username,
                mobile: mobile,
                password: hashedPassword,
                email: email,
            });

            console.log(ownerData, "5646546546546");

            await ownerData.save();

            const token = createSecretToken(ownerData._id);

            res.cookie("token", token, {
                httpOnly: false,
                withCredentials: true,
            });

            return res.status(201).json({
                message: "Owner signed up successfully",
                success: true,
                ownerData,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const OwnersendOtp = async (req, res) => {
    try {
        console.log(req.body, 'sfsgsgsgsgsg');
        const { email } = req.body;
        console.log(email, 'sfsgsgsgsgsg');

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
        return res.status(200).json({
            success: true,
            alert: "OTP sent successfully",
            otp,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const ownerVerifyOtp = async (req, res) => {
    try {
        const { otp } = req.body
        console.log(otp, "otp from verify otp");
        const existOtp = await OTP.findOne({ otp: otp })
        console.log(existOtp, "existtttttttt");
        if (existOtp) {
            return res.status(200).json({ success: true, message: "Owner created!" })
        } else {
            return res.json({ success: false, message: "invalid OTP" })
        }
    } catch (error) {
        console.log(error.message);
    }
}

export const ownerLogin = async (req, res) => {
    const { email, password } = req.body
    console.log();
    const OwnerExist = await Owner.findOne({ email: email })
    if (OwnerExist) {
        const passwordMatch = await bcrypt.compare(password, OwnerExist.password)

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Invalid Password" })
        } else {
            let token = jwt.sign({ id: OwnerExist._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
            console.log("token : ", token);
            return res.status(200).send({
                success: true,
                token: token,
                user: OwnerExist,
                message: "Owner Logged In"
            });
        }
    }
}

export const handleKycData = async (req, res) => {
    //validatoins
    try {
        const { username, email, address, state, zipCode, occupation, city, country, panCard } = req.body
        console.log(req.body, "dataaa");
        const OwnerData = await Kyc.findOne({ email: email })
        if (OwnerData) {
            console.log("ownerData already exist");
        } else {
            const OwnerKyc = new Kyc({
                username: username,
                email: email,
                address: address,
                state: state,
                zipCode: zipCode,
                city: city,
                country: country,
                occupation: occupation,
                panCard: panCard,

            })
            await OwnerKyc.save().then(() => console.log("Kyc Added successfully"))
            return res.status(200).json({ success: true, message: "Kyc added successfully", OwnerKyc })
        }

    } catch (error) {
        console.log(error);
    }
}


export const RegisterWithGoogle = async (req, res) => {
    console.log('enter to backend controller');
    try {
        const { id, email, name, mobile } = req.body
        console.log(email);
        const hash = await securePassword(id)
        const owner = await Owner.findOne({ email: email });
        if (!owner) {

            let GoogleOwner = new Owner({
                username: name,
                googleId: id,
                email: email,
                password: hash,
                mobile: mobile || "1111111111",
                is_google: true
            })

            const GoogleData = await GoogleOwner.save()
            console.log("GoogleDAta saved Successfully", GoogleData);

            if (GoogleData) {
                const token = await createSecretToken(GoogleData._id)
                res.cookie("token", token, {
                    withCredentials: true,
                    httpOnly: false
                })
                if (token) {
                    return res.status(200).json({
                        success: true,
                        message: "Owner Logged In",
                        token
                    });
                }
            }
        } else {
            console.log("Owner Already Exists");
            return res.json({
                success: false,
                message: "Owner already exists",
            });
        }
    } catch (error) {
        console.log(error);
    }
}

export const GetKycData = async (req, res) => {
    console.log("enterejhwejrthwejrkjw");
    try {
        const kycData = await Kyc.find({})
        console.log(kycData, "dataat kyccc");
        if (kycData) {
            return res.status(200).json({ success: true, message: "Successfully get the kyc data", kycData })
        } else {
            return res.json({ success: false, message: "failed to get kyc data" })
        }
    } catch (error) {
        console.log(error);
    }
}


export const AddProperty = async (req, res) => {
    try {
        const { id } = req.params
        console.log(req.body, "bodddddddmasssssss");
        const { title, rent, type, state, balconies, imageUrl, additionalDetails, bedroom, bathroom, parking, furnished, buildUpArea, FloorCount, location, country, city } = req.body;
        const propertyExist = await Property.findOne({ name: title });
        if (propertyExist) {
            return res.json({ success: false, message: "Property with the same title already exists" });
        } else {


            const newProperty = new Property({
                name: title,
                type: type,
                Rent: rent,
                details: additionalDetails,
                bathrooms: bathroom,
                bedrooms: bedroom,
                furnished: furnished,
                parking: parking,
                buildUpArea: buildUpArea,
                FloorCount: FloorCount,
                location: location,
                country: country,
                balcony: balconies,
                city: city,
                imageUrls: imageUrl,
                state: state,
                ownerRef: id,
                is_verified: false,
                is_Booked: false
            });
            console.log(newProperty, "new Propertyyy");

            const saved = await newProperty.save();

            return res.status(200).json({ success: true, message: "Property added successfully", saved });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const ImageUpload = async (req, res) => {
    console.log("0000000000000000000");
    try {
        const fileStr = req.body.data

        const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'dev_setups'
        })

        const id = uploadedResponse && uploadedResponse.public_id;
        console.log(id, "9999999999999999");



        console.log(uploadedResponse, "uploadresponse");
        return res.json({ success: true, message: 'image Uploaded Successfully', uploadedResponse })

    } catch (error) {
        console.log(error);
    }
}

export const getPropertyData = async (req, res) => {
    try {
        const property = await Property.find({})

        if (property) {
            return res.status(200).json({ success: true, message: "get data from Propety Database", property })
        } else {
            return res.status(500).json({ success: false, message: "Error while fetching Data" });
        }
    } catch (error) {
        console.log("get property", error);
    }
}
export const EditPropertyData = async (req, res) => {
    try {
        const { id } = req.params
        // const { title, rent, type, state, balconies, imageUrl, additionalDetails, bedroom, bathroom, parking, furnished, buildUpArea, FloorCount, location, country, city } = req.body;
        const property = await Property.find({ _id: id })

        if (property) {
            // let updateProperty = await Property.updateMany(
            //     { _id : id },

            // )

            return res.status(200).json({ success: true, message: "get data from Propety Database", property })
        } else {
            return res.status(500).json({ success: false, message: "Error while fetching Data" });
        }
    } catch (error) {
        console.log("get property", error);
    }
}
export const hideProperty = async (req, res) => {
    try {
        const { id } = req.params
        const property = await Property.findOne({ _id: id })

        if (property) {
            const hiddenProperty = await Property.findByIdAndUpdate({ _id: id }, { $set: { is_hide: !property.is_hide } })

            return res.status(200).json({ success: true, message: "get data from Propety Database", property, hiddenProperty })
        } else {
            return res.status(500).json({ success: false, message: "Error while fetching Data" });
        }
    } catch (error) {
        console.log("get property", error);
    }
}
export const GetBookingData = async (req, res) => {
    console.log("enter to getbooking dataa");
    try {
        const GetData = await Bookings.find({})

        if (GetData) {
            return res.status(200).json({ success: true, message: "get data from Bookings", GetData })
        } else {
            return res.status(500).json({ success: false, message: "Error while fetching Data" });
        }
    } catch (error) {
        console.log("GetBooking Data", error);
    }
}