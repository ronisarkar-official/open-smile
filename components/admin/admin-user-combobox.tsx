'use client';

import * as React from 'react';
import { Search, X, Loader2, User, Check, Flame } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage, DEFAULT_AVATAR_URL } from '@/components/ui/avatar';
import { CoinIcon } from '@/components/ui/coin-icon';
import { cn } from '@/lib/utils';

export interface AdminUserItem {
	id: string;
	name: string;
	email: string;
	image?: string;
	role?: string;
	banned?: boolean;
	streak_count?: number;
	coin_balance?: number;
}

interface AdminUserComboboxProps {
	value: string;
	onChange: (userIdOrEmail: string, user?: AdminUserItem | null) => void;
	placeholder?: string;
	label?: string;
	className?: string;
	initialUser?: AdminUserItem | null;
}

export function AdminUserCombobox({
	value,
	onChange,
	placeholder = 'Search by name, email, or user ID...',
	label,
	className,
	initialUser = null,
}: AdminUserComboboxProps) {
	const [query, setQuery] = React.useState('');
	const [isOpen, setIsOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const [users, setUsers] = React.useState<AdminUserItem[]>([]);
	const [selectedUser, setSelectedUser] = React.useState<AdminUserItem | null>(initialUser);
	const containerRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (initialUser) {
			setSelectedUser(initialUser);
		} else if (!value) {
			setSelectedUser(null);
		}
	}, [initialUser, value]);

	React.useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const searchUsers = React.useCallback(async (searchTerm: string) => {
		try {
			setIsLoading(true);
			const params = new URLSearchParams({
				limit: '8',
			});
			if (searchTerm.trim()) {
				params.set('search', searchTerm.trim());
			}

			const res = await fetch(`/api/admin/users?${params.toString()}`);
			if (!res.ok) return;

			const data = await res.json();
			setUsers(data.users || []);
		} catch {
		} finally {
			setIsLoading(false);
		}
	}, []);

	React.useEffect(() => {
		if (!isOpen) return;

		const timer = setTimeout(() => {
			searchUsers(query);
		}, 200);

		return () => clearTimeout(timer);
	}, [query, isOpen, searchUsers]);

	const handleSelect = (user: AdminUserItem) => {
		setSelectedUser(user);
		onChange(user.email || user.id, user);
		setIsOpen(false);
		setQuery('');
	};

	const handleCustomUse = () => {
		if (!query.trim()) return;
		const customValue = query.trim();
		setSelectedUser(null);
		onChange(customValue, null);
		setIsOpen(false);
	};

	const handleClear = () => {
		setSelectedUser(null);
		onChange('', null);
		setQuery('');
		setIsOpen(false);
	};

	return (
		<div ref={containerRef} className={cn('relative space-y-2', className)}>
			{label && (
				<label className="font-mono text-xs font-bold uppercase tracking-wider block text-foreground">
					{label}
				</label>
			)}

			{selectedUser ? (
				<div className="flex items-center justify-between border-[length:var(--border-width)] border-black rounded-lg p-3 bg-card shadow-brutal-xs">
					<div className="flex items-center gap-3 min-w-0">
						<Avatar className="size-9 border-[length:var(--border-width)] border-black shadow-brutal-xs shrink-0">
							<AvatarImage src={selectedUser.image || DEFAULT_AVATAR_URL} alt={selectedUser.name} className="object-cover" />
							<AvatarFallback className="text-xs font-black bg-primary text-primary-foreground">
								{selectedUser.name?.slice(0, 2).toUpperCase() || 'U'}
							</AvatarFallback>
						</Avatar>
						<div className="min-w-0">
							<div className="flex items-center gap-2">
								<span className="font-title font-bold text-sm truncate text-foreground">{selectedUser.name}</span>
								<span className={cn(
									'border border-black rounded-xs px-1.5 py-0.2 font-mono text-[9px] font-black uppercase',
									selectedUser.role === 'admin' ? 'bg-accent text-black' : 'bg-muted text-muted-foreground'
								)}>
									{selectedUser.role || 'user'}
								</span>
								{selectedUser.banned && (
									<span className="border border-destructive rounded-xs px-1 py-0.2 font-mono text-[9px] font-black uppercase bg-destructive/15 text-destructive">
										Banned
									</span>
								)}
							</div>
							<div className="font-mono text-[11px] text-muted-foreground truncate">{selectedUser.email}</div>
						</div>
					</div>

					<div className="flex items-center gap-2 shrink-0 ml-3">
						{typeof selectedUser.coin_balance === 'number' && (
							<div className="hidden sm:flex items-center gap-1 font-mono text-xs font-bold bg-muted/60 border border-black/20 rounded px-2 py-1">
								<span>{Number(selectedUser.coin_balance).toLocaleString()}</span>
								<CoinIcon size={12} />
							</div>
						)}
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleClear}
							className="h-8 border border-black rounded-md bg-background px-2.5 font-mono text-xs font-bold hover:bg-destructive/10 hover:text-destructive transition-colors shadow-brutal-xs"
						>
							<X className="size-3.5 mr-1" />
							<span>Change</span>
						</Button>
					</div>
				</div>
			) : value && !selectedUser ? (
				<div className="flex items-center justify-between border-[length:var(--border-width)] border-black rounded-lg p-3 bg-card shadow-brutal-xs">
					<div className="flex items-center gap-2.5 min-w-0">
						<div className="size-8 rounded border border-black bg-primary/20 flex items-center justify-center shrink-0">
							<User className="size-4 text-primary" />
						</div>
						<div className="min-w-0">
							<div className="font-mono text-xs font-bold truncate text-foreground">{value}</div>
							<div className="font-mono text-[10px] text-muted-foreground">Custom Recipient Target</div>
						</div>
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleClear}
						className="h-8 border border-black rounded-md bg-background px-2.5 font-mono text-xs font-bold hover:bg-destructive/10 hover:text-destructive shadow-brutal-xs"
					>
						<X className="size-3.5 mr-1" />
						<span>Clear</span>
					</Button>
				</div>
			) : (
				<div className="relative">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
						<Input
							value={query}
							onChange={(e) => {
								setQuery(e.target.value);
								if (!isOpen) setIsOpen(true);
							}}
							onFocus={() => {
								setIsOpen(true);
								searchUsers(query);
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									if (users.length > 0) {
										handleSelect(users[0]);
									} else if (query.trim()) {
										handleCustomUse();
									}
								} else if (e.key === 'Escape') {
									setIsOpen(false);
								}
							}}
							placeholder={placeholder}
							className="pl-9 pr-9 border-[length:var(--border-width)] border-black font-mono text-xs bg-background"
						/>
						{isLoading && (
							<div className="absolute right-3 top-1/2 -translate-y-1/2">
								<Loader2 className="size-4 animate-spin text-muted-foreground" />
							</div>
						)}
					</div>

					{isOpen && (
						<div className="absolute left-0 right-0 top-full mt-1.5 border-[length:var(--border-width)] border-black rounded-lg bg-card shadow-brutal-md z-50 overflow-hidden max-h-72 overflow-y-auto divide-y divide-black/10">
							<div className="p-2 bg-muted/40 font-mono text-[10px] uppercase font-bold text-muted-foreground flex items-center justify-between">
								<span>Select Smiler from Database</span>
								<span>{users.length} results</span>
							</div>

							{isLoading && users.length === 0 ? (
								<div className="p-6 text-center font-mono text-xs text-muted-foreground flex items-center justify-center gap-2">
									<Loader2 className="size-4 animate-spin text-primary" />
									<span>Querying user records...</span>
								</div>
							) : users.length === 0 ? (
								<div className="p-4 space-y-2">
									<p className="text-center font-mono text-xs text-muted-foreground">
										No user matching &ldquo;{query}&rdquo; found
									</p>
									{query.trim() && (
										<button
											type="button"
											onClick={handleCustomUse}
											className="w-full text-left p-2.5 border border-black/20 rounded bg-background hover:bg-muted font-mono text-xs flex items-center justify-between cursor-pointer transition-colors"
										>
											<span className="truncate">Use &ldquo;{query.trim()}&rdquo;</span>
											<span className="font-bold text-[10px] uppercase text-primary shrink-0 ml-2">Apply</span>
										</button>
									)}
								</div>
							) : (
								users.map((u) => (
									<div
										key={u.id}
										onClick={() => handleSelect(u)}
										className="p-2.5 hover:bg-muted/40 cursor-pointer flex items-center justify-between gap-3 transition-colors text-left"
									>
										<div className="flex items-center gap-2.5 min-w-0">
											<Avatar className="size-8 border border-black shrink-0">
												<AvatarImage src={u.image || DEFAULT_AVATAR_URL} alt={u.name} />
												<AvatarFallback className="text-[10px] font-black bg-primary text-primary-foreground">
													{u.name?.slice(0, 2).toUpperCase() || 'U'}
												</AvatarFallback>
											</Avatar>
											<div className="min-w-0">
												<div className="flex items-center gap-1.5">
													<span className="font-bold text-xs truncate text-foreground">{u.name}</span>
													<span className={cn(
														'border border-black/30 rounded-xs px-1 py-0.2 font-mono text-[8px] font-black uppercase',
														u.role === 'admin' ? 'bg-accent text-black' : 'bg-muted text-muted-foreground'
													)}>
														{u.role || 'user'}
													</span>
													{u.banned && (
														<span className="border border-destructive rounded-xs px-1 py-0.2 font-mono text-[8px] font-black uppercase bg-destructive/15 text-destructive">
															Banned
														</span>
													)}
												</div>
												<div className="font-mono text-[10px] text-muted-foreground truncate">{u.email}</div>
											</div>
										</div>

										<div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
											{u.streak_count ? (
												<span className="inline-flex items-center gap-0.5 text-muted-foreground font-bold">
													<Flame className="size-3 text-orange-500 fill-orange-500" />
													{u.streak_count}
												</span>
											) : null}
											{typeof u.coin_balance === 'number' && (
												<span className="inline-flex items-center gap-1 font-bold text-foreground">
													{Number(u.coin_balance).toLocaleString()}
													<CoinIcon size={11} />
												</span>
											)}
										</div>
									</div>
								))
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
