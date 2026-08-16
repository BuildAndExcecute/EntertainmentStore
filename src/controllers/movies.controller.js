import { ApiError } from "../utils/ApiError.utill.js"
import { asyncHandler } from "../utils/asyncHandler.util.js"
import { ApiResponse } from "../utils/ApiResponse.util.js"
import * as movieService from "../services/movie.service.js"

export const getMovies = asyncHandler(async(req,res) =>{
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

    const movies = await movieService.getMovies(page,limit)

    res.status(200).json(
        new ApiResponse(200, movies, "Movies Fetched Successfully")
    )
})

export const getMovie = asyncHandler(async(req,res)=>{
    const id = req.params.id

    const movieData = await movieService.getMovie(id)

    res.status(200).json(
        new ApiResponse(200, movieData, "Movie Fetched Successfully")
    )
})

export const playMovie = asyncHandler(async(req,res)=>{
    const id = req.params.id
    const userId = req.user.id

    const movieUrl = await movieService.playMovie(id, userId)

    res.status(200).json(
        new ApiResponse(200, movieUrl, "Movie fetched Successfully")
    )
})

export const uploadMovie = asyncHandler(async(req,res)=>{

    const movie = await movieService.uploadMovie(req.body, req.files)

    res.status(200).json(
        new ApiResponse(200, movie, "Movie Uploaded Successfully")
    )
})

export const editMovie = asyncHandler(async(req,res)=>{
    const id = req.params.id
    
    const movie = await movieService.editMovie(id, req.body , req.files)

    res.status(200).json(
        new ApiResponse(200, movie, "Movie Updated successfully")
    )
})