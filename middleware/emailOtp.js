import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { sendMail } from "../src/utils/Email.js";
import { generateOTP } from "../src/utils/generateOtp.js";
import OtpModel from "../models/Otp.model.js";

export const sendOtpMiddleware = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({email: req.body.email})
        
        if (!existingUser) {
            return res.status(404).json({ "message": "User not found" })
        }

        await OtpModel.deleteMany({ user_id: existingUser._id })

        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);

        const newOtp = new OtpModel({ user_id: existingUser._id, otp: hashedOtp, expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME) * 1000 })
        await newOtp.save()

        await sendMail(existingUser.email, `OTP Verification for Verify your gmail account`, `Your One-Time Password (OTP) for account verification is: <b>${otp}</b>.</br>Do not share this OTP with anyone for security reasons`)

        res.status(201).json({ 'message': "OTP sent" })

        next();

    } catch (error) {
        res.status(500).json({ 'message': "Some error occured while resending otp, please try again later" })
        console.log(error);
    }
};