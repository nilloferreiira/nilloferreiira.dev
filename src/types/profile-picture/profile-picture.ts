export type ProfilePicture = {
	name: string | null
	url: string
}

export type ProfilePictureImage = {
	name: string
	url: string
	size: number | null
	createdAt: string | null
}

export type ProfilePictureImageList = {
	images: ProfilePictureImage[]
	selected: string | null
}
