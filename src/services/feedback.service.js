import { ulid } from "ulid"
import { eq } from "drizzle-orm"
import { db } from "../config/db.config.js"
import { movieFeedbacks } from "../schema.js"
import { ApiError } from "../utils/ApiError.utill.js"

export const addUserFeedback = async (userId, movieId, feedback) => {
    await db.insert(movieFeedbacks)
        .values({
            id: ulid(),
            userId,
            movieId,
            feedback
        })
}

export const updateFeedback = async (id, updatedFeedback) => {
    const feedback = await db.update(movieFeedbacks)
        .set(updatedFeedback)
        .where(eq(movieFeedbacks.id, id))
        .returning()

    if (feedback.length === 0) {
        throw new ApiError(404, "Feedback not found")
    }

    return feedback[0]
}

export const getMovieFeedbacks = async(movieId ) =>{
    const feedbacks = await db.select({
                            id : movieFeedbacks.id,
                            userId : movieFeedbacks.userId,
                            feedback : movieFeedbacks.feedback
                        }).from(movieFeedbacks)
                        .where(eq(movieId, movieFeedbacks.movieId))

    return feedbacks;
}