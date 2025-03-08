import jwt from "jsonwebtoken";

export const generateToken = (res, user) => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in environment variables.");
        }

        const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            httpOnly: true, 
            sameSite: "strict",
            // secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });

    } catch (error) {
        console.error(`Error in generateToken(): ${error.message}`);
        throw error; // Make sure the caller handles this error
    }
};
