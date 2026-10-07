import { unstable_cache } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { siteSettings } from "@/db/schema"
import { PROFILE_PICTURE_CACHE_TAG } from "@/lib/cache-tags"
import { ABOUT_PHOTO_KEY } from "@/lib/profile-picture"

// File name of the About photo in the profile_pictures bucket, or null when none was picked yet
export const getCachedAboutPhotoName = unstable_cache(
	async () => {
		const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, ABOUT_PHOTO_KEY))
		return row?.value ?? null
	},
	["about-photo"],
	{ tags: [PROFILE_PICTURE_CACHE_TAG], revalidate: false }
)
