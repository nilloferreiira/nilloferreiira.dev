import type { ProfilePictureImageList } from "@/types/profile-picture/profile-picture"
import { useQuery } from "@tanstack/react-query"

async function fetchProfilePictureImages(): Promise<ProfilePictureImageList> {
	const res = await fetch("/api/profile-picture/images")
	const json = await res.json().catch(() => ({}))
	if (!res.ok || !json.ok) throw new Error(json.error ?? "Erro ao listar imagens do bucket")
	return json.data as ProfilePictureImageList
}

// Admin: every image in the profile_pictures bucket + which one is selected.
// Lives under ["profile-picture"] so invalidating that key refreshes the public photo too.
export function useProfilePictureImages() {
	return useQuery<ProfilePictureImageList>({
		queryKey: ["profile-picture", "images"],
		queryFn: fetchProfilePictureImages
	})
}
