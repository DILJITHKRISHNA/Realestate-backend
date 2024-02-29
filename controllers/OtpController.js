import otpGenerator from 'otp-generator'
import OTP from '../models/otpModel.js'
import User from '../models/userModel.js'

export const sendOTP = async (req, res) => {
  try {
    console.log(req.body,'sfsgsgsgsgsg');
    const { email } = req.body;
    console.log(email,'sfsgsgsgsgsg');

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
    res.status(200).json({
      success: true,
      alert: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { otp } = req.body
  console.log(otp,'igjkghjghjghj');
  const ExistOtp = await OTP.findOne({ otp: otp })
  if (!ExistOtp) {
    return res.json({success: false, message:"invalid OTP "})
  } else {    
    return res.status(200).json({ success: true, message: "User created!" });
  }
}

