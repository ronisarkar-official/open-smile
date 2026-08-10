export function PlaceholderContent({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div>
			<h2 className="text-2xl font-bold text-foreground">{title}</h2>
			<p className="text-sm text-muted-foreground mt-1">{description}</p>
			<div className="mt-8 flex items-center justify-center h-48 rounded-lg border border-dashed border-border">
				<p className="text-sm text-muted-foreground">
					{title} settings will appear here
				</p>
			</div>
		</div>
	);
}
