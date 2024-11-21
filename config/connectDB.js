import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URL) {
    throw new Error(
        "You must provide a MONGODB_URL environment variable"
    );
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connecté à la base de données");
    } catch (error) {
        console.log("La connexion à MongoDB a échoué", error);
        process.exit(1);
    }
}

export default connectDB;
