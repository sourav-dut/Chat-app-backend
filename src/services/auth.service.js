import OtpModel from "../../models/Otp.model.js";
import User from "../../models/User.model.js";
import bcrypt from 'bcryptjs';
import { generateOTP } from "../utils/generateOtp.js";
import { sendMail } from "../utils/Email.js";
import cloudinary from "../../config/cloudinary.js";
// import { generateToken } from "../utils/generateToken.js";

class AuthService {
    // Registration
    static async registerUser(email, phone, fullName, password, profilePic) {
        let user = await User.findOne({ email });
        if (user) throw new Error("User already exists");

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            phone,
            fullName,
            password: hashedPassword,
            profilePic
        });

        // OTP System - [Send OTP]
        await OtpModel.deleteMany({ user_id: newUser._id });

        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);

        const newOtp = new OtpModel({ user_id: newUser._id, otp: hashedOtp, expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME) * 1000 })
        await newOtp.save()

        await sendMail(newUser.email, `OTP Verification for Verify your gmail account`, `Your One-Time Password (OTP) for account verification is: <b>${otp}</b>.</br>Do not share this OTP with anyone for security reasons`);

        return newUser;
    };

    // Login
    static async loginUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User Does not exists please create an account");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid Password');

        return user;
    }

    // Verify Otp
    static async verifyOtp(user_id, otp, res) {
        const isValidUserId = await User.findById(user_id);
        if (!isValidUserId) throw new Error("User not found");

        const dbOtp = await OtpModel.findOne({ user_id: isValidUserId._id });
        if (!dbOtp) throw new Error("resend otp");

        if (dbOtp.expiresAt < Date.now()) {
            await OtpModel.findByIdAndDelete(dbOtp._id);
            return res.status(400).json({ message: "Otp has been expired" });
        };

        // checks if otp is there and matches the hash value then updates the user verified status to true and returns the updated user
        if (dbOtp && (await bcrypt.compare(otp, dbOtp.otp))) {
            await OtpModel.findByIdAndDelete(dbOtp._id)
            const verifiedUser = await User.findByIdAndUpdate(isValidUserId._id, { isVerified: true }, { new: true });
        }

        // Check The user is isVerified or not- if not then delete the user account from db
        const user = await User.findById(user_id);
        if (user.isVerified === false) {
            await User.findByIdAndDelete(user_id);
        };

        return user;
    };


    // Update Profile
    static async updateProfile (profilePic, userId) {
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        if (!uploadResponse) throw new Error("Somthing wrong in cloudinary");
        
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { profilePic: uploadResponse.secure_url },
          { new: true }
        );
        return updatedUser
    };
};


export default AuthService;