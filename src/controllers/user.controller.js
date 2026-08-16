import { ApiError } from "../utils/ApiError.utill.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

import * as UserService from "../services/user.service.js"


export const getUserHistory = asyncHandler(async(req, res ) =>{
    const userId = req.user.id

    const userHistory = await UserService.getUserHistory(userId)

    if(!userHistory){
        throw new ApiError(404, "History Not Found")
    }

    res.status(200).json(
        new ApiResponse(200, userHistory, " User History Fetched Successfully" )
    )
})

export const getUserFeedbacks = asyncHandler(async(req, res) =>{
    const userId = req.user.id

    const userFeedbacks = await UserService.getUserFeedbacks(userId)

    if(!userFeedbacks){
        throw new ApiError(404, "Not Found")
    }

    res.status(200).json(
        new ApiResponse(200, userFeedbacks, " User Feedbacks are Fetched Successfully")
    )

})