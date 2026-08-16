import { Router } from "express"
import { authenticate } from "../middlewares/authenticate.middleware.js"

import {verifyAdmin } from "../middlewares/verifyAdmin.middleware.js"

import * as movieController from "../controllers/movies.controller.js"

import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.get("/", movieController.getMovies)

router.get("/:id", movieController.getMovie)

router.get("/:id/stream", authenticate, movieController.playMovie)

router.post("/upload"
    , authenticate
    , verifyAdmin,upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ])
, movieController.uploadMovie)

router.patch("/:id"
    , authenticate
    , verifyAdmin
    ,upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ])
  ,  movieController.editMovie)




export default router;


