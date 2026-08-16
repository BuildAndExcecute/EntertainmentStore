import { Router } from "express"
import { authenticate } from "../middlewares/authenticate.middleware.js"

import {verifyAdmin } from "../middlewares/verifyAdmin.middleware.js"

import * as movieController from "../controllers/movies.controller.js"
import * as userController from "../controllers/user.controller.js"

import {upload} from "../middlewares/multer.middleware.js"

const router =  Router();

router.get("/user-feedbacks", authenticate, userController.getUserFeedbacks)

router.get("/user-history",authenticate, userController.getUserHistory)

export default router

