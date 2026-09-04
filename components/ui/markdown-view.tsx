'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownViewProps {
	content: string;
	className?: string;
}

export function MarkdownView({ content, className }: MarkdownViewProps) {
	if (!content || !content.trim()) return null;

	return (
		<div className={cn('text-xs leading-relaxed space-y-1.5 break-words font-sans', className)}>
			<ReactMarkdown
				components={{
					p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed text-inherit">{children}</p>,
					strong: ({ children }) => <strong className="font-extrabold text-foreground">{children}</strong>,
					em: ({ children }) => <em className="italic">{children}</em>,
					a: ({ href, children }) => (
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							onClick={(e) => e.stopPropagation()}
							className="text-primary underline font-bold hover:text-primary/80 transition-colors"
						>
							{children}
						</a>
					),
					code: ({ children }) => (
						<code className="px-1.5 py-0.5 rounded border border-black/20 bg-muted font-mono text-[11px] font-bold text-foreground">
							{children}
						</code>
					),
					ul: ({ children }) => <ul className="list-disc pl-4 space-y-0.5 my-1">{children}</ul>,
					ol: ({ children }) => <ol className="list-decimal pl-4 space-y-0.5 my-1">{children}</ol>,
					li: ({ children }) => <li className="leading-relaxed">{children}</li>,
					blockquote: ({ children }) => (
						<blockquote className="border-l-2 border-primary pl-2.5 my-1.5 text-muted-foreground italic">
							{children}
						</blockquote>
					),
					h1: ({ children }) => <h1 className="font-title font-black text-base mt-2 mb-1 text-foreground">{children}</h1>,
					h2: ({ children }) => <h2 className="font-title font-black text-sm mt-1.5 mb-1 text-foreground">{children}</h2>,
					h3: ({ children }) => <h3 className="font-title font-bold text-xs mt-1 mb-0.5 text-foreground">{children}</h3>,
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
