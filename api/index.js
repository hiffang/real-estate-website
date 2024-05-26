import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.routes.js';

mongoose.connect("mongodb+srv://hifgaffoor01:Wer172829@realestate.bo8ql60.mongodb.net/?retryWrites=true&w=majority&appName=realestate").then(()=>{
    console.log('Connected to MongoDB!');
}).catch((err) =>{
    console.log(err);
});


const app = express();

app.listen (3000, () => {
    console.log('Server is running on port 3000!!!');
    }
);


app.use('/api/user',userRouter);
