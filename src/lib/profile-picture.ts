import { clientEnv } from "@/lib/env.client"

export const PROFILE_PICTURES_BUCKET = "profile_pictures"

// site_settings key holding the file name (not the URL) of the photo shown in About
export const ABOUT_PHOTO_KEY = "about_photo"

// Used until a photo is selected in the admin, or if the API fails
export const FALLBACK_PHOTO_URL = "https://github.com/nilloferreiira.png"

export const PROFILE_PICTURE_MAX_SIZE = 5 * 1024 * 1024

export const PROFILE_PICTURE_TYPES: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp"
}

export function getProfilePictureUrl(name: string) {
	return `${clientEnv.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${PROFILE_PICTURES_BUCKET}/${encodeURIComponent(name)}`
}
