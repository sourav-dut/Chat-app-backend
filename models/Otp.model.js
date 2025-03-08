import { Schema, model } from "mongoose"

const otpSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
})

const OtpModel = model("Otp", otpSchema);
export default OtpModel;