'use client';

import * as React from 'react';
import Link from 'next/link';
import {
	Calendar as CalendarIcon,
	Camera,
	CheckCircle2,
	Flame,
	Sparkles,
} from 'lucide-react';
import type { MonthlyCaptureItem } from '@/backend/db/collections';
import { Button } from '@/components/ui/button';

interface ConsistencyCalendarProps {
	monthlyCaptures: MonthlyCaptureItem[];
	isTodayCompleted: boolean;
	streakCount: number;
}

export function ConsistencyCalendar({
	monthlyCaptures,
	isTodayCompleted,
	streakCount,
}: ConsistencyCalendarProps) {
	const now = new Date();
	const year = now.getUTCFullYear();
	const month = now.getUTCMonth();
	const totalDaysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	const todayDate = now.getUTCDate();
	const monthName = now.toLocaleString('en-US', { month: 'long' });

	// Map captures by date string YYYY-MM-DD
	const capturesMap = React.useMemo(() => {
		const map = new Map<number, MonthlyCaptureItem>();
		for (const cap of monthlyCaptures) {
			const dayNum = parseInt(cap.date.slice(-2), 10);
			if (!isNaN(dayNum)) {
				map.set(dayNum, cap);
			}
		}
		return map;
	}, [monthlyCaptures]);

	const daysArray = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
	const activeDaysCount = capturesMap.size;
	const consistencyRate = Math.round((activeDaysCount / todayDate) * 100) || 0;

	return (
		<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-4 sm:p-6 shadow-brutal-lg space-y-4">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-[length:var(--border-width)] border-black/15 pb-4">
				<div className="flex items-center gap-2.5">
					<span className="flex size-9 items-center justify-center border-[length:var(--border-width)] border-black rounded-md bg-secondary text-secondary-foreground shadow-brutal-xs">
						<CalendarIcon className="size-4.5" strokeWidth={2.5} />
					</span>
					<div>
						<h2 className="font-title text-xl font-black tracking-tight">
							{monthName} Habit Matrix
						</h2>
						<p className="font-mono text-xs text-muted-foreground">
							{activeDaysCount} active days • {consistencyRate}% month consistency
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{isTodayCompleted ? (
						<span className="inline-flex items-center gap-1.5 border-[length:var(--border-width)] border-black rounded-md bg-success/20 px-3 py-1 font-mono text-xs font-bold text-success-foreground shadow-brutal-xs">
							<CheckCircle2 className="size-3.5 text-success" strokeWidth={3} />
							Smiled Today!
						</span>
					) : (
						<Button
							asChild
							size="sm"
							className="border-[length:var(--border-width)] border-black rounded-md bg-primary text-primary-foreground font-title font-black text-xs uppercase shadow-brutal-xs brutal-lift hover:bg-primary/90"
						>
							<Link href="/capture" className="flex items-center gap-1.5">
								<Camera className="size-3.5" strokeWidth={2.5} />
								Smile Today
							</Link>
						</Button>
					)}
				</div>
			</div>

			{/* Calendar Grid */}
			<div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
				{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
					<div
						key={idx}
						className="text-center font-mono text-[10px] sm:text-xs font-bold uppercase text-muted-foreground py-1"
					>
						{day}
					</div>
				))}

				{daysArray.map((dayNum) => {
					const item = capturesMap.get(dayNum);
					const isPast = dayNum < todayDate;
					const isToday = dayNum === todayDate;
					const isCompleted = Boolean(item && item.count > 0);
					const score = item?.maxScore || 0;

					let bgClass = 'bg-muted/40 text-muted-foreground';
					if (isCompleted) {
						if (score >= 90) {
							bgClass = 'bg-accent text-accent-foreground shadow-brutal-xs';
						} else if (score >= 75) {
							bgClass = 'bg-warning text-warning-foreground shadow-brutal-xs';
						} else {
							bgClass = 'bg-primary/40 text-primary-foreground shadow-brutal-xs';
						}
					} else if (isToday) {
						bgClass = 'bg-card border-dashed border-2 border-primary text-primary animate-pulse';
					}

					return (
						<div
							key={dayNum}
							title={
								isCompleted
									? `Day ${dayNum}: Score ${score} (${item?.count} captures)`
									: isToday
									? `Day ${dayNum}: Today (Not yet captured)`
									: `Day ${dayNum}`
							}
							className={`relative flex flex-col items-center justify-center aspect-square border-[length:var(--border-width)] border-black rounded-lg text-xs font-mono font-bold transition-all ${bgClass}`}
						>
							<span className="tabular-nums">{dayNum}</span>
							{isCompleted && score > 0 && (
								<span className="hidden sm:inline font-mono text-[8px] font-black opacity-80">
									{score}
								</span>
							)}
							{isToday && (
								<span className="absolute -top-1 -right-1 size-2 rounded-full bg-primary" />
							)}
						</div>
					);
				})}
			</div>

			{/* Legend */}
			<div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-[length:var(--border-width)] border-black/15 font-mono text-[10px] font-bold text-muted-foreground">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-1">
						<span className="size-3 rounded-xs border-[length:var(--border-width)] border-black bg-accent" />
						<span>90+ Score</span>
					</div>
					<div className="flex items-center gap-1">
						<span className="size-3 rounded-xs border-[length:var(--border-width)] border-black bg-warning" />
						<span>75-89 Score</span>
					</div>
					<div className="flex items-center gap-1">
						<span className="size-3 rounded-xs border-[length:var(--border-width)] border-black bg-muted" />
						<span>Missed</span>
					</div>
				</div>

				<div className="flex items-center gap-1 text-foreground">
					<Flame className="size-3 text-secondary fill-secondary" />
					<span>{streakCount} day streak maintained</span>
				</div>
			</div>
		</div>
	);
}
