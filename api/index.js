import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.routes.js';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import path from 'path';
import bcryptjs from 'bcryptjs'
import User from './models/user.model.js';

const __dirname = path.resolve();

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to MongoDB!');
}).catch((err) =>{
    console.log(err);
});


const app = express();

const transporter = nodemailer.createTransport({
    host:'node235.r-usdatacenter.register.lk',
    port:587,
    secure:false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const generateResetToken = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                const token = buffer.toString('hex');
                resolve(token);
            }
        });
    });
};

app.use(express.json());

app.use(cookieParser());

app.post('/api/forgot-password', async (req, res, next) => {
    const { email } = req.body;

    try {
        // Generate reset token
        const resetToken = await generateResetToken();

        // Store reset token in your database (MongoDB)
        // Example: Assuming you have a User model
        await User.findOneAndUpdate({ email }, { resetToken });

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            html: `<p>You requested a password reset. Click <a href="http://localhost:5173/reset-password/${resetToken}">here</a> to reset your password.</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent. Check your inbox.' });
    } catch (error) {
        console.error('Error sending email:', error);
        next(error); // Pass the error to the error handler middleware
    }
});

app.post('/api/reset-password/:token', async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Find user by reset token
        const user = await User.findOne({ resetToken: token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Update user's password
        const hashedPassword = bcryptjs.hashSync(newPassword,10);
        user.password = hashedPassword;

        // Clear/reset the resetToken in database after password change
        user.resetToken = undefined;
        await user.save();

        // Optionally, send an email notifying the user of password change

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        next(error);
    }
});



app.listen (3000, () => {
    console.log('Server is running on port 3000!!!');
    }
);


app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);


app.use(express.static(path.join(__dirname,'/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  })

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});







  
  
  