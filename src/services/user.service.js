import { db } from "../config/db.config.js"
import { movieFeedbacks, watchedMovies, movies } from "../schema.js"
import { eq, desc } from "drizzle-orm";


export const getUserHistory = async (id) => {
  const history = await db
    .select({
      watchedAt: watchedMovies.watchedAt,
      movieId: movies.id,
      title: movies.title,
      description: movies.description,
      thumbnailUrl: movies.thumbnailUrl, // Updated from thumbnailPublicId
      bannerUrl: movies.bannerUrl,       // Updated from bannerPublicId
      views: movies.views,
      likes: movies.likes,
      dislikes: movies.dislikes,
    })
    .from(watchedMovies)
    .innerJoin(
      movies,
      eq(watchedMovies.movieId, movies.id)
    )
    .where(eq(watchedMovies.userId, id))
    .orderBy(desc(watchedMovies.watchedAt));

  return history;
};


export const getUserFeedbacks = async(id) =>{
    const feedbacks = await db.select({
        id: movieFeedbacks.id,
        movieId: movieFeedbacks.movieId,
        feedback: movieFeedbacks.feedback,
        updatedAt: movieFeedbacks.updatedAt
    })
    .from(movieFeedbacks)
    .where(eq(movieFeedbacks.userId, id))

    return feedbacks;
}

