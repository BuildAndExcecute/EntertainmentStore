import { db } from "../config/db.config.js"
import { movieFeedbacks, watchedMovies } from "../schema.js"

export const getUserHistory = async (id) => {
  const history = await db
    .select({
      watchedAt: watchedMovies.watchedAt,
      movie: {
        id: movies.id,
        title: movies.title,
        description: movies.description,
        thumbnailPublicId: movies.thumbnailPublicId,
        views: movies.views,
        likes: movies.likes,
        dislikes: movies.dislikes,
      },
    })
    .from(watchedMovies)
    .innerJoin(movies, eq(watchedMovies.movieId, movies.id))
    .where(eq(watchedMovies.userId, id))
    .orderBy(desc(watchedMovies.watchedAt));

  return history;
}


export const getUserFeedbacks = async(id) =>{
    const feedbacks = db.select({
        id: movieFeedbacks.id,
        movieId: movieFeedbacks.movieId,
        feedback: movieFeedbacks.feedback,
        updatedAt: movieFeedbacks.updatedAt
    })
    .from(movieFeedbacks)
    .where(eq(movieFeedbacks.userId, id))

    return feedbacks;
}

