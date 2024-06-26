import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true,
    },
    
    email: {
        type:String,
        required:true,
        unique:true,
    },
    password: {
        type:String,
        required:true,
    },
    resetToken: {
        type:String,
    },
    number: {
        type:String,
    },
    avatar: {
        type:String,
        default:"https://media.istockphoto.com/id/1316947194/vector/messenger-profile-icon-on-white-isolated-background-vector-illustration.jpg?s=612x612&w=0&k=20&c=1iQ926GXQTJkopoZAdYXgU17NCDJIRUzx6bhzgLm9ps=",
    },
    isAdmin: {
        type:Boolean,
        default:false,
    },
},{ timestamps: true}
);

const User = mongoose.model('User',userSchema);

export default User;