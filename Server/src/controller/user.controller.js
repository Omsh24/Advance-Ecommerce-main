import { User } from "../models/user.model.js"
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";



const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, password, email, phoneNumber, address, role } = req.body;

    if (!firstName || !lastName || !password || !email || !phoneNumber || !address) {
        throw new ApiError(400, "All fields are required")
    }

    if (!email.includes('@')) {
        throw new ApiError(400, "Invalid Email address");
    }

    const existedUser = await User.findOne(email)
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    const user = await User.create({
        firstName: firstName,
        password: password,
        email: email,
        lastName: lastName,
        address: address,
        phoneNumber: phoneNumber,
        role: role
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    );

})