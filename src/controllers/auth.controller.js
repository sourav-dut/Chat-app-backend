import User from "../../models/User.model.js";
import AuthService from "../services/auth.service.js";
import { generateToken } from "../utils/generateToken.js";
import { senetizeUser } from "../utils/senetizeUser.js";

// Registration
export const registerUser = async (req, res) => {
    try {
        const { email, phone, fullName, password, profilePic } = req.body;

        if (!email || !phone || !fullName || !password) {
            return res.status(404).send({
                msg: "All fildes are required"
            });
        };

        // Bussiness registration - Services
        const user = await AuthService.registerUser(email, phone, fullName, password, profilePic);
        console.log("user", user);


        const secureInfo = senetizeUser(user);
        const token = generateToken(res, secureInfo);

        return res.status(201).send({
            message: "New user created successfully",
            user,
            token: token
        });
    } catch (error) {
        console.log(`Error in register Api: ${error}`);
        return res.status(500).send({
            success: false,
            message: "Error in registor api"
        })
    }
}

// Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).send({
                msg: "All fildes are required"
            });
        };

        // Bussiness login - Services
        const user = await AuthService.loginUser(email, password);

        const secureInfo = senetizeUser(user);
        const token = generateToken(res, secureInfo);

        return res.status(201).send({
            message: "Logged In successfully",
            user,
            token: token
        });
    } catch (error) {
        console.log(`Error in login Api: ${error}`);
        return res.status(500).send({
            success: false,
            message: "Error in login api"
        })
    }
};

// otp Verification
export const otpVerification = async (req, res) => {
    try {
        const { user_id, otp } = req.body;
        if (!user_id || !otp) return res.status(404).send({ msg: "All fildes are required" });

        // Bussiness logic - Services
        const user = await AuthService.verifyOtp(user_id, otp, res);

        return res.status(201).send({
            message: "gmail verification successfully",
            user,
        });

    } catch (error) {
        console.log(`Error in otp verification Api: ${error}`);
        return res.status(500).send({
            success: false,
            message: "Error in otp verification api"
        })
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.body.user._id;
    
        if (!profilePic) {
          return res.status(400).json({ message: "Profile pic is required" });
        }
    
        const updatedUser = await AuthService.updateProfile(profilePic, userId);
    
        res.status(200).json(updatedUser);
      } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
      }
  };

// Logout User
export const logout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Just check the user is authenticate or not
export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.body.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };