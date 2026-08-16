import { auth } from "../config/auth.config.js"
import { ApiError } from "../utils/ApiError.utill.js"
import { asyncHandler } from "../utils/asyncHandler.util.js"

// async function authenticate(req, res, next) {

//     try{
//         const session  = await auth.api.getSession({
//             headers: req.headers
//         })

//         if(!session){
//             throw new ApiError(401, "Unauthorized Request")
//         }

//         req.user = session.user
//         next()
//     }catch(err){
//         next(err)
//     }
    
// }

const authenticate = asyncHandler(async(req, res, next) =>{
    const session = await auth.api.getSession({
        headers: req.headers
    })

    if(!session){
        throw new ApiError(401, "Unauthorized Request ")
    }

    req.user = session.user
    req.session = session.session
    next()
})

export {authenticate}