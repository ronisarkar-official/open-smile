'use client';

import * as React from 'react';
import { Bold, Italic, Code, Link as LinkIcon, List, ListOrdered, Eye, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarkdownView } from './markdown-view';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
	value: string;
	onChange: (val: string) => void;
	placeholder?: string;
	rows?: number;
	className?: string;
	label?: string;
}

export function MarkdownEditor({
	value,
	onChange,
	placeholder = 'Write message using Markdown...',
	rows = 4,
	className,
	label,
}: MarkdownEditorProps) {
	const [activeTab, setActiveTab] = React.useState<'write' | 'preview'>('write');
	const textareaRef = React.useRef<HTMLTextAreaElement>(null);

	const insertFormatting = (prefix: string, suffix: string, defaultText: string = 'text') => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = value.substring(start, end) || defaultText;
		const replacement = `${prefix}${selectedText}${suffix}`;

		const nextValue = value.substring(0, start) + replacement + value.substring(end);
		onChange(nextValue);

		setTimeout(() => {
			textarea.focus();
			textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
		}, 0);
	};

	return (
		<div className={cn('space-y-1.5', className)}>
			{label && (
				<div className="flex items-center justify-between">
					<label className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
						{label}
					</label>
					<span className="font-mono text-[10px] text-muted-foreground font-semibold">
						Markdown supported
					</span>
				</div>
			)}

			<div className="border-[length:var(--border-width)] border-black rounded-lg bg-background shadow-brutal-xs overflow-hidden">
				<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 bg-muted/40 p-1.5 gap-2 flex-wrap">
					<div className="flex items-center gap-1">
						<button
							type="button"
							onClick={() => setActiveTab('write')}
							className={cn(
								'flex items-center gap-1 border rounded px-2.5 py-1 font-mono text-[11px] font-bold cursor-pointer transition-all',
								activeTab === 'write'
									? 'border-black bg-background text-foreground shadow-brutal-xs'
									: 'border-transparent text-muted-foreground hover:text-foreground'
							)}
						>
							<Edit3 className="size-3" />
							<span>Write</span>
						</button>
						<button
							type="button"
							onClick={() => setActiveTab('preview')}
							className={cn(
								'flex items-center gap-1 border rounded px-2.5 py-1 font-mono text-[11px] font-bold cursor-pointer transition-all',
								activeTab === 'preview'
									? 'border-black bg-background text-foreground shadow-brutal-xs'
									: 'border-transparent text-muted-foreground hover:text-foreground'
							)}
						>
							<Eye className="size-3" />
							<span>Preview</span>
						</button>
					</div>

					{activeTab === 'write' && (
						<div className="flex items-center gap-1">
							<button
								type="button"
								onClick={() => insertFormatting('**', '**', 'bold')}
								title="Bold (**text**)"
								className="size-7 flex items-center justify-center border border-black/20 rounded hover:border-black hover:bg-background text-foreground transition-colors cursor-pointer"
							>
								<Bold className="size-3.5" />
							</button>
							<button
								type="button"
								onClick={() => insertFormatting('*', '*', 'italic')}
								title="Italic (*text*)"
								className="size-7 flex items-center justify-center border border-black/20 rounded hover:border-black hover:bg-background text-foreground transition-colors cursor-pointer"
							>
								<Italic className="size-3.5" />
							</button>
							<button
								type="button"
								onClick={() => insertFormatting('`', '`', 'code')}
								title="Inline Code (`code`)"
								className="size-7 flex items-center justify-center border border-black/20 rounded hover:border-black hover:bg-background text-foreground transition-colors cursor-pointer"
							>
								<Code className="size-3.5" />
							</button>
							<button
								type="button"
								onClick={() => insertFormatting('[', '](https://example.com)', 'link text')}
								title="Link ([text](url))"
								className="size-7 flex items-center justify-center border border-black/20 rounded hover:border-black hover:bg-background text-foreground transition-colors cursor-pointer"
							>
								<LinkIcon className="size-3.5" />
							</button>
							<button
								type="button"
								onClick={() => insertFormatting('\n- ', '', 'list item')}
								title="Bullet List (- item)"
								className="size-7 flex items-center justify-center border border-black/20 rounded hover:border-black hover:bg-background text-foreground transition-colors cursor-pointer"
							>
								<List className="size-3.5" />
							</button>
							<button
								type="button"
								onClick={() => insertFormatting('\n1. ', '', 'ordered item')}
								title="Numbered List (1. item)"
								className="size-7 flex items-center justify-center border border-black/20 rounded hover:border-black hover:bg-background text-foreground transition-colors cursor-pointer"
							>
								<ListOrdered className="size-3.5" />
							</button>
						</div>
					)}
				</div>

				{activeTab === 'write' ? (
					<textarea
						ref={textareaRef}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						rows={rows}
						placeholder={placeholder}
						className="w-full bg-background p-3 text-xs font-sans leading-relaxed focus:outline-none resize-y"
					/>
				) : (
					<div className="p-3 bg-muted/20 min-h-[96px] text-xs">
						{value.trim() ? (
							<MarkdownView content={value} />
						) : (
							<span className="font-mono text-xs text-muted-foreground italic">
								Nothing to preview yet. Start typing in Write mode.
							</span>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
