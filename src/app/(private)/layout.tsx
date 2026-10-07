export default function PrivateLayout({ children }: { children: React.ReactNode }) {
	return (
		<div data-theme="dark" className="min-h-screen bg-background text-muted-foreground p-24">
			{children}
		</div>
	)
}
