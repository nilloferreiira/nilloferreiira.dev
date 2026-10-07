import type { ProfilePicture } from "@/types/profile-picture/profile-picture"
import { useQuery } from "@tanstack/react-query"

async function fetchProfilePicture(): Promise<ProfilePicture> {
	const res = await fetch("/api/profile-picture")
	if (!res.ok) throw new Error("Erro ao buscar foto de perfil")
	const json = await res.json()
	return json.data as ProfilePicture
}

// Photo shown in the public About section
export function useProfilePicture() {
	return useQuery<ProfilePicture>({
		queryKey: ["profile-picture"],
		queryFn: fetchProfilePicture,
		staleTime: 1000 * 60 * 5 // 5 minutes
	})
}
