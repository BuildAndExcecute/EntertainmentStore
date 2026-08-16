import { ApiError } from "../utils/ApiError.utill.js"
import { asyncHandler } from "../utils/asyncHandler.util.js"

export const verifyAdmin = asyncHandler(async(req, res, next) =>{
    if(req.user.role !== "admin"){
        throw new ApiError(403, "Forbidden Request")
    }

    next()
})