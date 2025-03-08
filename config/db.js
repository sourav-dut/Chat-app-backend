import { connect } from 'mongoose';

export const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI)
        console.log("DB connected");
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};