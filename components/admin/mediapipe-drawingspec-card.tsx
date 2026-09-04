'use client';

import * as React from 'react';
import {
	ScanFace,
	Palette,
	RotateCcw,
	Check,
	Sparkles,
	Sliders,
	CircleDot,
	Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
	DEFAULT_DRAWING_SPEC,
	type MediaPipeDrawingSpec,
} from '@/lib/mediapipe-drawing';

interface MediaPipeDrawingSpecCardProps {
	value?: MediaPipeDrawingSpec;
	onSave: (spec: MediaPipeDrawingSpec) => Promise<void>;
	isSaving?: boolean;
}

const CONNECTOR_COLOR_PRESETS = [
	{ label: 'Classic Green', value: '#00FF00' },
	{ label: 'Cyber Mint', value: '#00E599' },
	{ label: 'Neon Cyan', value: '#00F0FF' },
	{ label: 'Electric Blue', value: '#3B82F6' },
	{ label: 'Gold Amber', value: '#FACC15' },
	{ label: 'Pure White', value: '#FFFFFF' },
];

const LANDMARK_COLOR_PRESETS = [
	{ label: 'Classic Red', value: '#FF0000' },
	{ label: 'Hot Pink', value: '#FF007F' },
	{ label: 'Bright Orange', value: '#FF7700' },
	{ label: 'Cyber Green', value: '#00FF00' },
	{ label: 'Pure White', value: '#FFFFFF' },
];

export function MediaPipeDrawingSpecCard({
	value,
	onSave,
	isSaving = false,
}: MediaPipeDrawingSpecCardProps) {
	const [spec, setSpec] = React.useState<MediaPipeDrawingSpec>(() => ({
		...DEFAULT_DRAWING_SPEC,
		...(value || {}),
	}));

	React.useEffect(() => {
		if (value) {
			setSpec((prev) => ({
				...DEFAULT_DRAWING_SPEC,
				...value,
			}));
		}
	}, [value]);

	const updateSpec = <K extends keyof MediaPipeDrawingSpec>(
		key: K,
		val: MediaPipeDrawingSpec[K],
	) => {
		setSpec((prev) => ({ ...prev, [key]: val }));
	};

	const handleReset = () => {
		setSpec(DEFAULT_DRAWING_SPEC);
	};

	// Generate sample face coordinates for realistic SVG/canvas preview
	const previewLandmarks = React.useMemo(() => {
		// Centered normalized coordinates [0..1]
		const oval = [
			{ x: 0.5, y: 0.12 },
			{ x: 0.68, y: 0.16 },
			{ x: 0.8, y: 0.3 },
			{ x: 0.84, y: 0.48 },
			{ x: 0.8, y: 0.68 },
			{ x: 0.68, y: 0.82 },
			{ x: 0.5, y: 0.88 },
			{ x: 0.32, y: 0.82 },
			{ x: 0.2, y: 0.68 },
			{ x: 0.16, y: 0.48 },
			{ x: 0.2, y: 0.3 },
			{ x: 0.32, y: 0.16 },
		];

		const leftBrow = [
			{ x: 0.27, y: 0.32 },
			{ x: 0.34, y: 0.28 },
			{ x: 0.42, y: 0.3 },
		];

		const rightBrow = [
			{ x: 0.58, y: 0.3 },
			{ x: 0.66, y: 0.28 },
			{ x: 0.73, y: 0.32 },
		];

		const leftEye = [
			{ x: 0.29, y: 0.39 },
			{ x: 0.35, y: 0.36 },
			{ x: 0.41, y: 0.39 },
			{ x: 0.35, y: 0.42 },
		];

		const rightEye = [
			{ x: 0.59, y: 0.39 },
			{ x: 0.65, y: 0.36 },
			{ x: 0.71, y: 0.39 },
			{ x: 0.65, y: 0.42 },
		];

		const nose = [
			{ x: 0.5, y: 0.35 },
			{ x: 0.5, y: 0.46 },
			{ x: 0.46, y: 0.52 },
			{ x: 0.5, y: 0.55 },
			{ x: 0.54, y: 0.52 },
		];

		const smileLips = [
			{ x: 0.33, y: 0.65 },
			{ x: 0.42, y: 0.63 },
			{ x: 0.5, y: 0.64 },
			{ x: 0.58, y: 0.63 },
			{ x: 0.67, y: 0.65 },
			{ x: 0.58, y: 0.73 },
			{ x: 0.5, y: 0.75 },
			{ x: 0.42, y: 0.73 },
		];

		const cheekMesh = [
			{ x: 0.26, y: 0.52 },
			{ x: 0.32, y: 0.54 },
			{ x: 0.38, y: 0.56 },
			{ x: 0.62, y: 0.56 },
			{ x: 0.68, y: 0.54 },
			{ x: 0.74, y: 0.52 },
			{ x: 0.5, y: 0.22 },
			{ x: 0.4, y: 0.22 },
			{ x: 0.6, y: 0.22 },
			{ x: 0.5, y: 0.82 },
		];

		const allPoints = [
			...oval,
			...leftBrow,
			...rightBrow,
			...leftEye,
			...rightEye,
			...nose,
			...smileLips,
			...cheekMesh,
		];

		return {
			oval,
			leftBrow,
			rightBrow,
			leftEye,
			rightEye,
			nose,
			smileLips,
			allPoints,
		};
	}, []);

	return (
		<div className="rounded-xl border-[length:var(--border-width)] border-border bg-card p-4 sm:p-6 shadow-brutal space-y-6">
			{/* Card Header */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-border/20 pb-4">
				<div className="flex items-center gap-2.5">
					<div className="flex size-9 items-center justify-center rounded-lg border-[length:var(--border-width-sm)] border-border bg-accent text-accent-foreground shadow-brutal-xs">
						<ScanFace className="size-5" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h2 className="font-title text-base sm:text-lg font-black text-foreground">
								MediaPipe Face Mesh & DrawingSpec
							</h2>
							<span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
								Live Overlay HUD
							</span>
						</div>
						<p className="font-mono text-xs text-muted-foreground mt-0.5">
							Controls the real-time facial landmark drawing shapes, contour connectors, and point styles in the webcam feed.
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleReset}
						disabled={isSaving}
						className="gap-1.5 font-mono text-xs font-bold uppercase border-[length:var(--border-width-sm)] border-border shadow-brutal-xs">
						<RotateCcw className="size-3.5" />
						Reset Defaults
					</Button>

					<Button
						type="button"
						size="sm"
						onClick={() => onSave(spec)}
						disabled={isSaving}
						className="gap-1.5 font-mono text-xs font-bold uppercase bg-primary text-primary-foreground border-[length:var(--border-width-sm)] border-border shadow-brutal-xs">
						<Check className="size-3.5" />
						{isSaving ? 'Saving...' : 'Save DrawingSpec'}
					</Button>
				</div>
			</div>

			{/* Master Toggle Banner */}
			<div className="flex items-center justify-between gap-4 rounded-xl border-[length:var(--border-width-sm)] border-border bg-muted/40 p-4 shadow-brutal-xs">
				<div className="space-y-0.5">
					<div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-foreground">
						<Sparkles className="size-3.5 text-primary" />
						Enable Face Mesh & Landmark Shape in Webcam View
					</div>
					<p className="font-mono text-[11px] text-muted-foreground">
						When enabled, users will see the real-time biometric face contours and landmark dots tracking their smile.
					</p>
				</div>
				<Switch
					checked={spec.enabled}
					onCheckedChange={(checked) => updateSpec('enabled', checked)}
					aria-label="Toggle MediaPipe Drawing Shape"
				/>
			</div>

			{/* Main Grid: Controls vs Preview */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				{/* Controls Form: 7 cols */}
				<div className="lg:col-span-7 space-y-5">
					{/* SECTION 1: Connectors Spec */}
					<div className="rounded-xl border-[length:var(--border-width-sm)] border-border bg-card p-4 shadow-brutal-xs space-y-4">
						<div className="flex items-center justify-between border-b border-border/20 pb-2">
							<div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-foreground">
								<Eye className="size-3.5 text-primary" />
								1. Facial Connectors (Contours & Mesh)
							</div>
							<div className="flex items-center gap-2">
								<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
									{spec.showConnectors ? 'Enabled' : 'Disabled'}
								</span>
								<Switch
									checked={spec.showConnectors}
									onCheckedChange={(checked) => updateSpec('showConnectors', checked)}
									aria-label="Toggle connectors"
								/>
							</div>
						</div>

						{/* Mode Selector */}
						<div className="space-y-1.5">
							<label className="font-mono text-[11px] font-bold uppercase text-foreground">
								Connection Mode
							</label>
							<div className="grid grid-cols-3 gap-2">
								{[
									{ id: 'contours', label: 'Contours Only', desc: 'Eyes, lips, oval (as pictured)' },
									{ id: 'tesselation', label: 'Mesh Only', desc: 'Triangulation web' },
									{ id: 'both', label: 'Contours + Mesh', desc: 'Complete biometric HUD' },
								].map((modeItem) => {
									const isSelected = spec.connectionMode === modeItem.id;
									return (
										<button
											key={modeItem.id}
											type="button"
											onClick={() => updateSpec('connectionMode', modeItem.id as any)}
											className={cn(
												'rounded-lg border-[length:var(--border-width-sm)] border-border p-2 text-left font-mono transition-all shadow-brutal-xs',
												isSelected
													? 'bg-primary text-primary-foreground font-black'
													: 'bg-muted/30 hover:bg-muted text-foreground'
											)}>
											<div className="text-xs font-bold leading-none">{modeItem.label}</div>
											<div className={cn('text-[10px] mt-1 leading-tight', isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
												{modeItem.desc}
											</div>
										</button>
									);
								})}
							</div>
						</div>

						{/* Connector Line Color */}
						<div className="space-y-2">
							<label className="font-mono text-[11px] font-bold uppercase text-foreground flex items-center justify-between">
								<span>Connector Line Color</span>
								<span className="font-mono text-[10px] text-muted-foreground">
									Default: #00FF00 (Lime Green)
								</span>
							</label>

							<div className="flex items-center gap-2">
								<div className="relative flex size-9 items-center justify-center rounded-lg border-[length:var(--border-width-sm)] border-border overflow-hidden shrink-0 shadow-brutal-xs">
									<input
										type="color"
										value={spec.connectionColor}
										onChange={(e) => updateSpec('connectionColor', e.target.value)}
										className="absolute -inset-2 size-14 cursor-pointer"
									/>
								</div>

								<Input
									type="text"
									value={spec.connectionColor}
									onChange={(e) => updateSpec('connectionColor', e.target.value)}
									placeholder="#00FF00"
									className="font-mono text-xs uppercase h-9 flex-1"
								/>
							</div>

							{/* Presets */}
							<div className="flex flex-wrap items-center gap-1.5 pt-1">
								{CONNECTOR_COLOR_PRESETS.map((c) => (
									<button
										key={c.value}
										type="button"
										onClick={() => updateSpec('connectionColor', c.value)}
										className={cn(
											'inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border font-mono text-[10px] font-bold transition-transform active:scale-95',
											spec.connectionColor.toLowerCase() === c.value.toLowerCase()
												? 'bg-foreground text-background font-black shadow-brutal-xs'
												: 'bg-card text-foreground hover:bg-muted'
										)}>
										<span
											className="size-2 rounded-full border border-black/40 shrink-0"
											style={{ backgroundColor: c.value }}
										/>
										<span>{c.label}</span>
									</button>
								))}
							</div>
						</div>

						{/* Line Width */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-between font-mono text-[11px]">
								<label className="font-bold uppercase text-foreground">Line Thickness</label>
								<span className="font-bold tabular-nums text-foreground bg-muted px-1.5 py-0.5 rounded border border-border/40 text-[10px]">
									{spec.connectionLineWidth} px
								</span>
							</div>
							<input
								type="range"
								min="0.5"
								max="5.0"
								step="0.5"
								value={spec.connectionLineWidth}
								onChange={(e) => updateSpec('connectionLineWidth', parseFloat(e.target.value))}
								className="w-full accent-primary cursor-pointer"
							/>
						</div>
					</div>

					{/* SECTION 2: Landmarks Spec */}
					<div className="rounded-xl border-[length:var(--border-width-sm)] border-border bg-card p-4 shadow-brutal-xs space-y-4">
						<div className="flex items-center justify-between border-b border-border/20 pb-2">
							<div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-foreground">
								<CircleDot className="size-3.5 text-destructive" />
								2. Landmark Dots (468+ Facial Vertices)
							</div>
							<div className="flex items-center gap-2">
								<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
									{spec.showLandmarks ? 'Enabled' : 'Disabled'}
								</span>
								<Switch
									checked={spec.showLandmarks}
									onCheckedChange={(checked) => updateSpec('showLandmarks', checked)}
									aria-label="Toggle landmark dots"
								/>
							</div>
						</div>

						{/* Landmark Point Color */}
						<div className="space-y-2">
							<label className="font-mono text-[11px] font-bold uppercase text-foreground flex items-center justify-between">
								<span>Landmark Dot Color</span>
								<span className="font-mono text-[10px] text-muted-foreground">
									Default: #FF0000 (Crimson Red)
								</span>
							</label>

							<div className="flex items-center gap-2">
								<div className="relative flex size-9 items-center justify-center rounded-lg border-[length:var(--border-width-sm)] border-border overflow-hidden shrink-0 shadow-brutal-xs">
									<input
										type="color"
										value={spec.landmarkColor}
										onChange={(e) => updateSpec('landmarkColor', e.target.value)}
										className="absolute -inset-2 size-14 cursor-pointer"
									/>
								</div>

								<Input
									type="text"
									value={spec.landmarkColor}
									onChange={(e) => updateSpec('landmarkColor', e.target.value)}
									placeholder="#FF0000"
									className="font-mono text-xs uppercase h-9 flex-1"
								/>
							</div>

							{/* Presets */}
							<div className="flex flex-wrap items-center gap-1.5 pt-1">
								{LANDMARK_COLOR_PRESETS.map((c) => (
									<button
										key={c.value}
										type="button"
										onClick={() => updateSpec('landmarkColor', c.value)}
										className={cn(
											'inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border font-mono text-[10px] font-bold transition-transform active:scale-95',
											spec.landmarkColor.toLowerCase() === c.value.toLowerCase()
												? 'bg-foreground text-background font-black shadow-brutal-xs'
												: 'bg-card text-foreground hover:bg-muted'
										)}>
										<span
											className="size-2 rounded-full border border-black/40 shrink-0"
											style={{ backgroundColor: c.value }}
										/>
										<span>{c.label}</span>
									</button>
								))}
							</div>
						</div>

						{/* Landmark Radius */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-between font-mono text-[11px]">
								<label className="font-bold uppercase text-foreground">Dot Radius</label>
								<span className="font-bold tabular-nums text-foreground bg-muted px-1.5 py-0.5 rounded border border-border/40 text-[10px]">
									{spec.landmarkRadius} px
								</span>
							</div>
							<input
								type="range"
								min="0.5"
								max="4.0"
								step="0.5"
								value={spec.landmarkRadius}
								onChange={(e) => updateSpec('landmarkRadius', parseFloat(e.target.value))}
								className="w-full accent-destructive cursor-pointer"
							/>
						</div>
					</div>

					{/* SECTION 3: Global Opacity */}
					<div className="rounded-xl border-[length:var(--border-width-sm)] border-border bg-card p-4 shadow-brutal-xs space-y-2">
						<div className="flex items-center justify-between font-mono text-[11px]">
							<label className="font-bold uppercase text-foreground flex items-center gap-1.5">
								<Sliders className="size-3.5 text-muted-foreground" />
								<span>Overall Overlay Opacity</span>
							</label>
							<span className="font-bold tabular-nums text-foreground bg-muted px-1.5 py-0.5 rounded border border-border/40 text-[10px]">
								{Math.round((spec.opacity ?? 0.9) * 100)}%
							</span>
						</div>
						<input
							type="range"
							min="0.2"
							max="1.0"
							step="0.05"
							value={spec.opacity ?? 0.9}
							onChange={(e) => updateSpec('opacity', parseFloat(e.target.value))}
							className="w-full accent-primary cursor-pointer"
						/>
					</div>
				</div>

				{/* Live Preview Column: 5 cols */}
				<div className="lg:col-span-5 flex flex-col gap-4">
					<div className="rounded-xl border-[length:var(--border-width)] border-border bg-[#0e1017] p-5 shadow-brutal text-white relative overflow-hidden flex flex-col items-center">
						<div className="w-full flex items-center justify-between border-b border-white/10 pb-2.5 mb-4">
							<div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-400">
								<span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
								<span>Live Visual Preview</span>
							</div>
							<span className="font-mono text-[10px] text-white/50 uppercase">
								{spec.enabled ? 'Overlay Active' : 'Overlay Inactive'}
							</span>
						</div>

						{/* SVG Face Mesh Diagram simulating webcam render */}
						<div className="relative size-64 sm:size-72 flex items-center justify-center">
							<svg
								viewBox="0 0 100 100"
								className="size-full overflow-visible transition-opacity duration-200"
								style={{ opacity: spec.enabled ? spec.opacity ?? 0.9 : 0.2 }}>
								{/* Connector Lines */}
								{spec.showConnectors && (
									<g
										stroke={spec.connectionColor}
										strokeWidth={spec.connectionLineWidth * 0.8}
										strokeLinecap="round"
										strokeLinejoin="round"
										fill="none">
										{/* Face Oval */}
										<polygon
											points={previewLandmarks.oval.map((p) => `${p.x * 100},${p.y * 100}`).join(' ')}
										/>

										{/* Eyebrows */}
										<polyline
											points={previewLandmarks.leftBrow.map((p) => `${p.x * 100},${p.y * 100}`).join(' ')}
										/>
										<polyline
											points={previewLandmarks.rightBrow.map((p) => `${p.x * 100},${p.y * 100}`).join(' ')}
										/>

										{/* Eyes */}
										<polygon
											points={previewLandmarks.leftEye.map((p) => `${p.x * 100},${p.y * 100}`).join(' ')}
										/>
										<polygon
											points={previewLandmarks.rightEye.map((p) => `${p.x * 100},${p.y * 100}`).join(' ')}
										/>

										{/* Nose */}
										<polyline
											points={previewLandmarks.nose.map((p) => `${p.x * 100},${p.y * 100}`).join(' ')}
										/>

										{/* Lips */}
										<polygon
											points={previewLandmarks.smileLips.map((p) => `${p.x * 100},${p.y * 100}`).join(' ')}
										/>

										{/* Tesselation Triangulation lines if mode is tesselation or both */}
										{(spec.connectionMode === 'tesselation' || spec.connectionMode === 'both') && (
											<g strokeOpacity="0.45" strokeWidth={Math.max(0.5, spec.connectionLineWidth * 0.5)}>
												<line x1="50" y1="12" x2="35" y2="28" />
												<line x1="50" y1="12" x2="65" y2="28" />
												<line x1="50" y1="12" x2="50" y2="35" />
												<line x1="35" y1="28" x2="50" y2="35" />
												<line x1="65" y1="28" x2="50" y2="35" />
												<line x1="20" y1="48" x2="35" y2="42" />
												<line x1="80" y1="48" x2="65" y2="42" />
												<line x1="35" y1="42" x2="50" y2="55" />
												<line x1="65" y1="42" x2="50" y2="55" />
												<line x1="20" y1="48" x2="33" y2="65" />
												<line x1="80" y1="48" x2="67" y2="65" />
												<line x1="50" y1="55" x2="50" y2="64" />
												<line x1="33" y1="65" x2="50" y2="88" />
												<line x1="67" y1="65" x2="50" y2="88" />
											</g>
										)}
									</g>
								)}

								{/* Landmark Points */}
								{spec.showLandmarks && (
									<g fill={spec.landmarkColor}>
										{previewLandmarks.allPoints.map((p, idx) => (
											<circle
												key={idx}
												cx={p.x * 100}
												cy={p.y * 100}
												r={spec.landmarkRadius * 0.8}
											/>
										))}
									</g>
								)}
							</svg>
						</div>

						{/* Spec Summary Tag */}
						<div className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 p-3 text-center space-y-1 font-mono text-[11px]">
							<div className="flex items-center justify-center gap-3">
								<span className="flex items-center gap-1.5 text-xs font-bold text-white">
									<span
										className="size-2.5 rounded-full"
										style={{ backgroundColor: spec.connectionColor }}
									/>
									Connectors: {spec.connectionLineWidth}px
								</span>

								<span className="text-white/30">•</span>

								<span className="flex items-center gap-1.5 text-xs font-bold text-white">
									<span
										className="size-2.5 rounded-full"
										style={{ backgroundColor: spec.landmarkColor }}
									/>
									Points: r={spec.landmarkRadius}px
								</span>
							</div>

							<div className="text-[10px] text-white/60">
								Mode: {spec.connectionMode.toUpperCase()} · Opacity: {Math.round((spec.opacity ?? 0.9) * 100)}%
							</div>
						</div>
					</div>

					<div className="rounded-xl border-[length:var(--border-width-sm)] border-border bg-card p-4 shadow-brutal-xs text-xs font-mono space-y-1.5 text-muted-foreground">
						<p className="font-bold text-foreground">💡 How this works in production:</p>
						<p>
							1. Saved settings update the database and broadcast instantly across all active client webcam sessions.
						</p>
						<p>
							2. MediaPipe renders on client GPUs; raw camera feeds are never uploaded to any server.
						</p>
						<p>
							3. Palm Shutter: Users can show an open palm and close their hand into a fist to start the capture countdown (toggleable via Palm ON/OFF button).
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
