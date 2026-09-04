function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function parseInlineFormatting(text: string): string {
	let output = escapeHtml(text);

	output = output.replace(
		/`([^`]+)`/g,
		'<code style="background-color: #f1f0ee; border: 1px solid #d4d4d4; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; color: #111827;">$1</code>'
	);

	output = output.replace(
		/\*\*([^*]+)\*\*/g,
		'<strong style="font-weight: 800; color: #0f0f0f;">$1</strong>'
	);
	output = output.replace(
		/__([^_]+)__/g,
		'<strong style="font-weight: 800; color: #0f0f0f;">$1</strong>'
	);

	output = output.replace(
		/(^|[^\*])\*([^*]+)\*([^\*]|$)/g,
		'$1<em style="font-style: italic;">$2</em>$3'
	);
	output = output.replace(
		/(^|[^_])_([^_]+)_([^_]|$)/g,
		'$1<em style="font-style: italic;">$2</em>$3'
	);

	output = output.replace(
		/\[([^\]]+)\]\(([^)]+)\)/g,
		'<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #7B61FF; font-weight: 700; text-decoration: underline;">$1</a>'
	);

	return output;
}

export function markdownToEmailHtml(markdown: string): string {
	if (!markdown || !markdown.trim()) return '';

	const lines = markdown.replace(/\r\n/g, '\n').split('\n');
	const outputParts: string[] = [];

	let inUl = false;
	let inOl = false;

	const closeLists = () => {
		if (inUl) {
			outputParts.push('</ul>');
			inUl = false;
		}
		if (inOl) {
			outputParts.push('</ol>');
			inOl = false;
		}
	};

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		if (!line) {
			closeLists();
			continue;
		}

		if (line.startsWith('### ')) {
			closeLists();
			outputParts.push(
				`<h3 style="font-size: 16px; font-weight: 800; color: #0f0f0f; margin: 16px 0 6px;">${parseInlineFormatting(line.slice(4))}</h3>`
			);
			continue;
		}

		if (line.startsWith('## ')) {
			closeLists();
			outputParts.push(
				`<h2 style="font-size: 19px; font-weight: 800; color: #0f0f0f; margin: 18px 0 8px;">${parseInlineFormatting(line.slice(3))}</h2>`
			);
			continue;
		}

		if (line.startsWith('# ')) {
			closeLists();
			outputParts.push(
				`<h1 style="font-size: 22px; font-weight: 900; color: #0f0f0f; margin: 20px 0 10px; letter-spacing: -0.5px;">${parseInlineFormatting(line.slice(2))}</h1>`
			);
			continue;
		}

		if (line.startsWith('> ')) {
			closeLists();
			outputParts.push(
				`<blockquote style="margin: 12px 0; padding: 6px 14px; border-left: 3px solid #0f0f0f; background-color: #faf8f5; color: #57534e; font-style: italic;">${parseInlineFormatting(line.slice(2))}</blockquote>`
			);
			continue;
		}

		const ulMatch = line.match(/^[-*]\s+(.*)$/);
		if (ulMatch) {
			if (inOl) {
				outputParts.push('</ol>');
				inOl = false;
			}
			if (!inUl) {
				outputParts.push('<ul style="margin: 8px 0; padding-left: 20px; list-style-type: disc; color: #374151;">');
				inUl = true;
			}
			outputParts.push(`<li style="margin: 4px 0; font-size: 15px; line-height: 1.6;">${parseInlineFormatting(ulMatch[1])}</li>`);
			continue;
		}

		const olMatch = line.match(/^\d+\.\s+(.*)$/);
		if (olMatch) {
			if (inUl) {
				outputParts.push('</ul>');
				inUl = false;
			}
			if (!inOl) {
				outputParts.push('<ol style="margin: 8px 0; padding-left: 20px; list-style-type: decimal; color: #374151;">');
				inOl = true;
			}
			outputParts.push(`<li style="margin: 4px 0; font-size: 15px; line-height: 1.6;">${parseInlineFormatting(olMatch[1])}</li>`);
			continue;
		}

		closeLists();
		outputParts.push(
			`<p style="font-size: 15px; color: #374151; line-height: 1.6; margin: 8px 0;">${parseInlineFormatting(line)}</p>`
		);
	}

	closeLists();
	return outputParts.join('');
}
