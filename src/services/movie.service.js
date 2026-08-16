import { db } from "../config/db.config.js"
import { movies } from "../schema.js"
import { desc } from "drizzle-orm"
import { eq, and, sql, count } from "drizzle-orm";
import { movieFeedbacks, watchedMovies } from "../schema.js";
import { ulid } from "ulid";

import cloudinary from "../config/cloudinary.config.js";

export const getMovies = async (page, limit) => {
    const offset = (page - 1) * limit;

    const movieList = await db
        .select({
            id: movies.id,
            title: movies.title,
            description: movies.description,
            thumbnailUrl: movies.thumbnailUrl,
            views: movies.views,
            likes: movies.likes,
            dislikes: movies.dislikes,
        })
        .from(movies)
        .orderBy(desc(movies.views))
        .limit(limit)
        .offset(offset);

    const [{ totalMovies }] = await db
        .select({
            totalMovies: count(),
        })
        .from(movies);

    const totalPages = Math.ceil(totalMovies / limit);

    return {
        movies: movieList,
        pagination: {
            page,
            limit,
            totalMovies,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
};

export const getMovie = async (id) => {
    const [movie] = await db
        .select({
            id: movies.id,
            title: movies.title,
            description: movies.description,
            thumbnailUrl: movies.thumbnailUrl,
            bannerUrl: movies.bannerUrl,
            views: movies.views,
            likes: movies.likes,
            dislikes: movies.dislikes,
        })
        .from(movies)
        .where(eq(movies.id, id))
        .limit(1);

    if (!movie) {
        return null;
    }

    const feedbacks = await db
        .select({
            userId: movieFeedbacks.userId,
            feedback: movieFeedbacks.feedback,
            createdAt: movieFeedbacks.createdAt,
        })
        .from(movieFeedbacks)
        .where(eq(movieFeedbacks.movieId, id));

    return {
        movie,
        feedbacks,
    };
};

export const playMovie = async (id, userId) => {
    const [movie] = await db
        .select({
            id: movies.id,
            publicId: movies.videoPublicId,
        })
        .from(movies)
        .where(eq(movies.id, id))
        .limit(1);

    if (!movie) {
        return null;
    }

    const signedVideoUrl = cloudinary.url(movie.publicId, {
        resource_type: "video",
        type: "authenticated",
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 60 * 30, // 15 min
    });


    // still track "watched" status separately (first watch only), if you want it
    if (userId) {
        const [alreadyWatched] = await db
            .select({ id: watchedMovies.id })
            .from(watchedMovies)
            .where(
                and(
                    eq(watchedMovies.userId, userId),
                    eq(watchedMovies.movieId, id)
                )
            )
            .limit(1);

        if (!alreadyWatched) {
            await db
                .update(movies)
                .set({ views: sql`${movies.views} + 1` })
                .where(eq(movies.id, id));


            await db.insert(watchedMovies).values({
                id: ulid(),
                userId,
                movieId: id,
            });
        }
    }

    return { videoUrl: signedVideoUrl };
};


export const uploadMovie = async ({ title, description }, files) => {
    const [videoResult, thumbnailResult, bannerResult] = await Promise.all([
        uploadToCloudinary(files.video[0].buffer, "video", { type: "authenticated" }),
        uploadToCloudinary(files.thumbnail[0].buffer, "image"),
        uploadToCloudinary(files.banner[0].buffer, "image"),
    ]);

    const [movie] = await db
        .insert(movies)
        .values({
            id: ulid(),
            title,
            description,
            videoPublicId: videoResult.public_id,
            thumbnailUrl: thumbnailResult.secure_url,
            bannerUrl: bannerResult.secure_url,
        })
        .returning();

    return;
};

export const editMovie = async (id, { title, description }, files) => {
    const [existing] = await db.select().from(movies).where(eq(movies.id, id)).limit(1);

    if (!existing) {
        return null;
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;

    if (files?.video?.[0]) {
        const videoResult = await uploadToCloudinary(files.video[0].buffer, "video", {
            type: "authenticated",
        });
        updates.videoPublicId = videoResult.public_id;
        await cloudinary.uploader.destroy(existing.videoPublicId, { resource_type: "video" }).catch(() => {});
    }

    if (files?.thumbnail?.[0]) {
        const thumbnailResult = await uploadToCloudinary(files.thumbnail[0].buffer, "image");
        updates.thumbnailUrl = thumbnailResult.secure_url;
    }

    if (files?.banner?.[0]) {
        const bannerResult = await uploadToCloudinary(files.banner[0].buffer, "image");
        updates.bannerUrl = bannerResult.secure_url;
    }

    if (Object.keys(updates).length === 0) {
        return existing;
    }

    const [movie] = await db
        .update(movies)
        .set(updates)
        .where(eq(movies.id, id))
        .returning();

    return movie;
};