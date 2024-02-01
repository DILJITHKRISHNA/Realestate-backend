import bcypt from "bcrypt"
import createSecretToken from '../utils/secretToken.js'
import Owner from "../models/ownerModel.js";
import OTP from "../models/otpModel.js";
import otpGenerator from 'otp-generator'
import jwt from 'jsonwebtoken'
import Kyc from "../models/kyc_model.js";



export const ownerSignup = async (req, res) => {
    console.log("entered to owner signup");
    try {
        const { username, password, mobile, email } = req.body
        console.log(req.body, "datas from owner controller");
        console.log(email, "fsdkjhkjfhkj");
        if (!username || !email || !password || !mobile) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            });
        }
        const hashedPassword = await bcypt.hash(password, 10);

        const OwnerExist = await Owner.findOne({ email: email });
        if (OwnerExist) {
            console.log("owner already exist");
        } else {
            const OwnerData = new Owner({
                username: username,
                mobile: mobile,
                password: hashedPassword,
                email: email,
            })
            console.log(OwnerData, "5646546546546");
            await OwnerData.save()
            const token = createSecretToken(OwnerData._id);
            res.cookie("token", token, {
                httpOnly: false,
                withCredentials: true
            })
            return res.status(201).json({ message: "Owner signed up successfully", success: true, OwnerData });
        }
    } catch (error) {
        console.log(error);
    }
}

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
        return res.status(500).json({ success: false, error: error.message });
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
        const passwordMatch = await bcypt.compare(password, OwnerExist.password)

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
    try {
        const { username, email, address, state, zipCode, occupation, city, country, panCard } = req.body
        console.log(req.body,"dataaa");
        const OwnerData = await Kyc.findOne({email: email})
        if (OwnerData) {
            console.log("ownerData already exist");
        }else{
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