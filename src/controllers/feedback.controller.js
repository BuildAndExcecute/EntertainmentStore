import { ApiError } from "../utils/ApiError.utill.js"
import { ApiResponse } from "../utils/ApiResponse.util.js"
import { asyncHandler } from "../utils/asyncHandler.util.js"
import * as feedbackService from "../services/feedback.service.js"

export const addFeedback = asyncHandler(async (req, res) => {
    const { movieId, feedback } = req.body

    if (!movieId || !feedback) {
        throw new ApiError(400, "Movie ID and feedback are required")
    }

    const userId = req.user.id

    await feedbackService.addUserFeedback(
        userId,
        movieId,
        feedback
    )

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                null,
                "Feedback added successfully"
            )
        )
})

export const updateFeedback = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { feedback } = req.body

    if (!feedback) {
        throw new ApiError(400, "Feedback is required")
    }

    const updatedFeedback = await feedbackService.updateFeedback(
        id,
        { feedback }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedFeedback,
                "Feedback updated successfully"
            )
        )
})

export const getMovieFeedbacks = asyncHandler(async (req, res) => {
    const { movieId } = req.params

    if (!movieId) {
        throw new ApiError(400, "Movie ID is required")
    }

    const feedbacks = await feedbackService.getMovieFeedbacks(movieId)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                feedbacks,
                "Feedbacks fetched successfully"
            )
        )
})