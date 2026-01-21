import { useLanguage } from "@/hooks/useLanguage"
import { Github, Linkedin, FileUser } from "lucide-react"

export function Links() {
	const { language } = useLanguage()

	const cvPath = language === "en" ? "danillo-ferreira-cv-en.pdf" : "danillo-ferreira-cv-pt.pdf"

	return (
		<div className="px-12 flex items-center justify-between">
			<a
				href="https://github.com/nilloferreiira"
				target="_blank"
				className="ring-1 ring-zinc-100 rounded-full size-12 p-6 flex items-center justify-center hover:shadow-md hover:shadow-zinc-50/40"
			>
				<span>
					<Github className="text-zinc-100" />
				</span>
			</a>
			<a
				href="https://www.linkedin.com/in/danillo-ferreira-dev/"
				target="_blank"
				className="ring-1 ring-zinc-100 rounded-full size-12 p-6 flex items-center justify-center hover:shadow-md hover:shadow-zinc-50/40"
			>
				<span>
					<Linkedin className="text-zinc-100" />
				</span>
			</a>
			<a
				href={`/files/${cvPath}`}
				download
				className="ring-1 ring-zinc-100 rounded-full size-12 p-6 flex items-center justify-center hover:shadow-md hover:shadow-zinc-50/40"
			>
				<span>
					<FileUser className="text-zinc-100" />
				</span>
			</a>
		</div>
	)
}
