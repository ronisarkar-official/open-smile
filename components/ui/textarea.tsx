import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {}

function Textarea({ className, ...props }: TextareaProps) {
	return (
		<textarea
			className={cn(
				"flex min-h-[120px] w-full border-[length:var(--border-width)] border-border rounded-lg bg-card px-3.5 py-2.5 text-sm font-medium text-card-foreground outline-none placeholder:text-muted-foreground transition-all duration-150 focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-brutal-xs",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
