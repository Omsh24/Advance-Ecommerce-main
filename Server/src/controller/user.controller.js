import { User } from "../models/user.model.js"
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";



const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {firstName, lastName, password, email, phoneNumber, address, role} = req.body;
})