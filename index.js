import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import uploadRouter from './route/upload.route.js';
import SubCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';

dotenv.config();

const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.FROMTEND_URL
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined'));
app.use(helmet({
    crossOriginResourcePolicy: false
}));

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.json({
        message: 'Server en cours sur ' + PORT
    });
});

app.use('/api/user/',userRouter)
app.use('/api/category/',categoryRouter)
app.use('/api/subCategory/',SubCategoryRouter)
app.use('/api/file',uploadRouter)
app.use('/api/product/', productRouter)

connectDB();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

