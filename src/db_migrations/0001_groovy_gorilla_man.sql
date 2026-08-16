ALTER TABLE "movies" ADD COLUMN "thumbnail_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "movies" ADD COLUMN "banner_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "movies" DROP COLUMN "thumbnailUrl";--> statement-breakpoint
ALTER TABLE "movies" DROP COLUMN "bannerURL";