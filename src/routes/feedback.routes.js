import { Router } from "express"
import { authenticate } from "../middlewares/authenticate.middleware.js"
import * as feedbackController from "../controllers/feedback.controller.js"

const router = Router()

router.post(
    "/",
    authenticate,
    feedbackController.addFeedback
)

router.patch(
    "/:id",
    authenticate,
    feedbackController.updateFeedback
)

router.get(
    "/movie/:movieId",
    feedbackController.getMovieFeedbacks
)

export default router