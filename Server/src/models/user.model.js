import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: { type: String, required: true },
    email: {
        type: String,
        required: true
    },
    phoneNumber: String,
    address: String,
    role: { 
        type: String, 
        enum: ['customer', 'admin'], 
        default: 'customer' 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    refreshToken:{
        type:String
    }
}, { timestamps: true });




export const User = mongoose.model('User', userSchema);