'use client';

import * as React from 'react';
import {
	Eye,
	EyeOff,
	KeyRound,
	Laptop,
	Smartphone,
	Globe,
	Loader2,
	Trash2,
	AlertTriangle,
	CheckCircle2,
	XCircle,
	LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage, DEFAULT_AVATAR_URL } from '@/components/ui/avatar';
import { authClient, signOut } from '@/lib/auth-client';
import { convertToWebP } from '@/lib/convert-to-webp';
import { GoogleIcon, GitHubIcon } from '@/components/icons';
import {
	SettingsRow,
	ActionButton,
} from '@/components/settings/settings-shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileContentProps {
	userName: string;
	userEmail: string;
	userAvatar: string;
	userInitials: string;
	onAvatarChange?: (newUrl: string) => void;
}

interface SessionItem {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	token: string;
	expiresAt: Date;
	ipAddress?: string;
	userAgent?: string;
}

interface AccountItem {
	id: string;
	providerId: string;
	accountId: string;
}

export function ProfileContent({
	userName,
	userEmail,
	userAvatar,
	userInitials,
	onAvatarChange,
}: ProfileContentProps) {
	// Avatar state
	const [avatar, setAvatar] = React.useState(userAvatar || DEFAULT_AVATAR_URL);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	// User Auth Accounts & Sessions State
	const [accounts, setAccounts] = React.useState<AccountItem[]>([]);
	const [accountsLoading, setAccountsLoading] = React.useState(true);
	const [linkingProvider, setLinkingProvider] = React.useState<string | null>(null);
	const [unlinkingProvider, setUnlinkingProvider] = React.useState<string | null>(null);

	// Password Form Collapse / Expand State
	const [showPasswordForm, setShowPasswordForm] = React.useState(false);
	const [currentPassword, setCurrentPassword] = React.useState('');
	const [newPassword, setNewPassword] = React.useState('');
	const [confirmPassword, setConfirmPassword] = React.useState('');
	const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
	const [showNewPassword, setShowNewPassword] = React.useState(false);
	const [revokeOtherSessions, setRevokeOtherSessions] = React.useState(false);

	const [passLoading, setPassLoading] = React.useState(false);
	const [passSuccess, setPassSuccess] = React.useState<string | null>(null);
	const [passError, setPassError] = React.useState<string | null>(null);

	// Active Sessions State
	const [sessions, setSessions] = React.useState<SessionItem[]>([]);
	const [sessionsLoading, setSessionsLoading] = React.useState(true);
	const [revokingToken, setRevokingToken] = React.useState<string | null>(null);
	const [revokingAll, setRevokingAll] = React.useState(false);

	// Danger Zone / Account Deletion State
	const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
	const [deleteConfirmInput, setDeleteConfirmInput] = React.useState('');
	const [deleteLoading, setDeleteLoading] = React.useState(false);
	const [deleteError, setDeleteError] = React.useState<string | null>(null);

	React.useEffect(() => {
		setAvatar(userAvatar || DEFAULT_AVATAR_URL);
	}, [userAvatar]);

	// Fetch linked social accounts and active sessions
	const fetchAccounts = React.useCallback(async () => {
		setAccountsLoading(true);
		try {
			const res = await authClient.listAccounts();
			if (res?.data) {
				setAccounts(res.data as unknown as AccountItem[]);
			}
		} catch (err) {
			console.error('Failed to load accounts:', err);
		} finally {
			setAccountsLoading(false);
		}
	}, []);

	const fetchSessions = React.useCallback(async () => {
		setSessionsLoading(true);
		try {
			const res = await authClient.listSessions();
			if (res?.data) {
				setSessions(res.data as unknown as SessionItem[]);
			}
		} catch (err) {
			console.error('Failed to load sessions:', err);
		} finally {
			setSessionsLoading(false);
		}
	}, []);

	React.useEffect(() => {
		fetchAccounts();
		fetchSessions();
	}, [fetchAccounts, fetchSessions]);

	// Account derived info
	const hasPasswordAccount = accounts.some(
		(acc) => acc.providerId === 'credential' || acc.providerId === 'email'
	);
	const isGoogleLinked = accounts.some((acc) => acc.providerId === 'google');
	const isGitHubLinked = accounts.some((acc) => acc.providerId === 'github');

	// Avatar file upload handler
	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const localUrl = URL.createObjectURL(file);
		setAvatar(localUrl);
		onAvatarChange?.(localUrl);

		const webpFile = await convertToWebP(file, 0.82, 512);

		try {
			const formData = new FormData();
			formData.append('file', webpFile);
			formData.append('fileName', `avatar_${Date.now()}.webp`);
			formData.append('folder', '/avatars');
			if (userAvatar && userAvatar.includes('ik.imagekit.io')) {
				formData.append('deleteOldUrl', userAvatar);
			}

			const res = await fetch('/api/imagekit/upload', {
				method: 'POST',
				body: formData,
			});
			const data = await res.json();
			if (res.ok && data.file?.url) {
				const imageUrl = data.file.url;
				setAvatar(imageUrl);
				onAvatarChange?.(imageUrl);
				await authClient.updateUser({ image: imageUrl });
			}
		} catch (err) {
			console.error('ImageKit upload error:', err);
		}
	};

	const triggerUpload = () => {
		fileInputRef.current?.click();
	};

	// Social Account Linking / Unlinking Handlers
	const handleLinkSocial = async (provider: 'google' | 'github') => {
		setLinkingProvider(provider);
		try {
			await authClient.linkSocial({
				provider,
				callbackURL: '/dashboard',
			});
		} catch (err) {
			console.error(`Failed to link ${provider}:`, err);
			setLinkingProvider(null);
		}
	};

	const handleUnlinkSocial = async (providerId: 'google' | 'github') => {
		setUnlinkingProvider(providerId);
		try {
			const res = await authClient.unlinkAccount({ providerId });
			if (!res?.error) {
				fetchAccounts();
			}
		} catch (err) {
			console.error(`Failed to unlink ${providerId}:`, err);
		} finally {
			setUnlinkingProvider(null);
		}
	};

	// Password submit handler
	const handlePasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setPassError(null);
		setPassSuccess(null);

		if (newPassword.length < 8) {
			setPassError('Password must be at least 8 characters.');
			return;
		}

		if (newPassword !== confirmPassword) {
			setPassError('Passwords do not match.');
			return;
		}

		setPassLoading(true);

		try {
			const res = await authClient.changePassword({
				currentPassword: currentPassword || '',
				newPassword,
				revokeOtherSessions,
			});

			if (res?.error) {
				setPassError(res.error.message || 'Failed to update password.');
			} else {
				setPassSuccess(
					hasPasswordAccount
						? 'Password updated successfully!'
						: 'Password created! You can now log in with email/password or social SSO.'
				);
				setCurrentPassword('');
				setNewPassword('');
				setConfirmPassword('');
				fetchAccounts();
				if (revokeOtherSessions) {
					fetchSessions();
				}
			}
		} catch {
			setPassError('An error occurred while saving password.');
		} finally {
			setPassLoading(false);
		}
	};

	// Active Session Handlers
	const handleRevokeSession = async (token: string) => {
		setRevokingToken(token);
		try {
			await authClient.revokeSession({ token });
			setSessions((prev) => prev.filter((s) => s.token !== token));
		} catch (err) {
			console.error('Failed to revoke session:', err);
		} finally {
			setRevokingToken(null);
		}
	};

	const handleRevokeOtherSessions = async () => {
		setRevokingAll(true);
		try {
			await authClient.revokeOtherSessions();
			fetchSessions();
		} catch (err) {
			console.error('Failed to revoke other sessions:', err);
		} finally {
			setRevokingAll(false);
		}
	};

	// Account Deletion Handler
	const handleDeleteAccount = async () => {
		if (deleteConfirmInput !== 'DELETE') {
			setDeleteError('Type DELETE to confirm account deletion.');
			return;
		}

		setDeleteLoading(true);
		setDeleteError(null);

		try {
			const res = await authClient.deleteUser();
			if (res?.error) {
				setDeleteError(res.error.message || 'Failed to delete account.');
				setDeleteLoading(false);
			} else {
				await signOut({
					fetchOptions: {
						onSuccess: () => {
							window.location.href = '/';
						},
					},
				});
			}
		} catch {
			setDeleteError('An error occurred during account deletion.');
			setDeleteLoading(false);
		}
	};

	const getDeviceIcon = (ua?: string) => {
		if (!ua) return <Globe className="h-4 w-4 text-muted-foreground" />;
		const lower = ua.toLowerCase();
		if (lower.includes('mobile') || lower.includes('android') || lower.includes('iphone')) {
			return <Smartphone className="h-4 w-4 text-muted-foreground" />;
		}
		return <Laptop className="h-4 w-4 text-muted-foreground" />;
	};

	const formatUA = (ua?: string) => {
		if (!ua) return 'Unknown Device';
		if (ua.includes('Chrome')) return 'Chrome Browser';
		if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari Browser';
		if (ua.includes('Firefox')) return 'Firefox Browser';
		if (ua.includes('Edg')) return 'Microsoft Edge';
		return 'Web Browser';
	};

	return (
		<div className="space-y-6 pb-4">
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleFileSelect}
			/>

			{/* Page Header */}
			<div>
				<h2 className="text-2xl font-bold text-foreground">Profile</h2>
				<p className="text-sm text-muted-foreground mt-1">
					Manage your profile, login information, security, and active sessions
				</p>
			</div>

			{/* =================================================================== */}
			{/* SECTION 1: ACCOUNT & PROFILE                                        */}
			{/* =================================================================== */}
			<div>
				<h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
					Account & Info
				</h3>
				<div className="border-t border-border" />
				
				<div className="flex items-center gap-4 py-4">
					<Avatar
						onClick={triggerUpload}
						className="h-14 w-14 border-[length:var(--border-width)] border-black shadow-brutal shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
						<AvatarImage src={avatar || DEFAULT_AVATAR_URL} alt={userName} />
						<AvatarFallback className="bg-primary text-primary-foreground text-lg font-black font-title">
							{userInitials}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<p className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Preferred name</p>
						<div className="bg-card border-[length:var(--border-width)] border-black rounded-md shadow-brutal-sm px-3 py-1.5 text-sm font-bold text-foreground w-fit max-w-full truncate font-title">
							{userName}
						</div>
						<p className="text-xs text-muted-foreground mt-2">
							<span onClick={triggerUpload} className="font-mono text-xs font-bold text-primary-foreground underline cursor-pointer">
								Upload new photo
							</span>
						</p>
					</div>
				</div>

				<div className="border-t border-border" />
				<SettingsRow
					label="Email"
					description={userEmail}
					action={
						<span className="inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-bold uppercase bg-success/20 text-success-foreground border-[length:var(--border-width)] border-black rounded-md">
							Verified
						</span>
					}
				/>
			</div>

			{/* =================================================================== */}
			{/* SECTION 2: CONNECTED SOCIAL ACCOUNTS (SSO)                          */}
			{/* =================================================================== */}
			<div>
				<h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
					Connected Accounts
				</h3>
				<div className="border-t border-border" />

				{accountsLoading ? (
					<div className="py-4 flex justify-center">
						<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
					</div>
				) : (
					<>
						{/* Google Row */}
						<SettingsRow
							label="Google Account"
							description={isGoogleLinked ? 'Connected for single sign-on' : 'Not connected'}
							action={
								isGoogleLinked ? (
									<div className="flex items-center gap-2">
										<span className="inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-bold uppercase bg-success/20 text-success-foreground border-[length:var(--border-width)] border-black rounded-md">
											Connected
										</span>
										{accounts.length > 1 && (
											<ActionButton
												variant="destructive"
												onClick={() => handleUnlinkSocial('google')}>
												{unlinkingProvider === 'google' ? 'Unlinking...' : 'Unlink'}
											</ActionButton>
										)}
									</div>
								) : (
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleLinkSocial('google')}
										disabled={linkingProvider === 'google'}
										className="h-8 text-xs font-bold gap-1.5 border-[length:var(--border-width)] border-black shadow-brutal-sm">
										<GoogleIcon className="h-3.5 w-3.5" />
										{linkingProvider === 'google' ? 'Linking...' : 'Link Google'}
									</Button>
								)
							}
						/>
						<div className="border-t border-border" />

						{/* GitHub Row */}
						<SettingsRow
							label="GitHub Account"
							description={isGitHubLinked ? 'Connected for single sign-on' : 'Not connected'}
							action={
								isGitHubLinked ? (
									<div className="flex items-center gap-2">
										<span className="inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-bold uppercase bg-success/20 text-success-foreground border-[length:var(--border-width)] border-black rounded-md">
											Connected
										</span>
										{accounts.length > 1 && (
											<ActionButton
												variant="destructive"
												onClick={() => handleUnlinkSocial('github')}>
												{unlinkingProvider === 'github' ? 'Unlinking...' : 'Unlink'}
											</ActionButton>
										)}
									</div>
								) : (
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleLinkSocial('github')}
										disabled={linkingProvider === 'github'}
										className="h-8 text-xs font-bold gap-1.5 border-[length:var(--border-width)] border-black shadow-brutal-sm">
										<GitHubIcon className="h-3.5 w-3.5" />
										{linkingProvider === 'github' ? 'Linking...' : 'Link GitHub'}
									</Button>
								)
							}
						/>
					</>
				)}
			</div>

			{/* =================================================================== */}
			{/* SECTION 3: ACCOUNT SECURITY & PASSWORD                              */}
			{/* =================================================================== */}
			<div>
				<h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
					Security & Password
				</h3>
				<div className="border-t border-border" />

				<SettingsRow
					label="Password"
					description={
						hasPasswordAccount
							? 'Change your account password'
							: 'You logged in via OAuth. Set a password for email login.'
					}
					action={
						<ActionButton onClick={() => setShowPasswordForm(!showPasswordForm)}>
							{showPasswordForm
								? 'Cancel'
								: hasPasswordAccount
								? 'Change Password'
								: 'Set Password'}
						</ActionButton>
					}
				/>

				{/* Collapsible / Expandable Password Form */}
				{showPasswordForm && (
					<form
						onSubmit={handlePasswordSubmit}
						className="my-3 p-4 border-[length:var(--border-width)] border-black rounded-lg bg-muted/30 shadow-brutal space-y-3">
						<div className="flex items-center gap-2 text-xs font-bold font-title text-foreground">
							<KeyRound className="h-4 w-4 text-primary" strokeWidth={2.5} />
							{hasPasswordAccount ? 'Update Account Password' : 'Set Account Password'}
						</div>

						{passError && (
							<div className="flex items-center gap-2 bg-destructive/10 border-[length:var(--border-width)] border-black rounded-md p-2.5 text-xs font-bold text-destructive">
								<XCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
								<span>{passError}</span>
							</div>
						)}

						{passSuccess && (
							<div className="flex items-center gap-2 bg-success/20 border-[length:var(--border-width)] border-black rounded-md p-2.5 text-xs font-bold text-success-foreground">
								<CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" strokeWidth={2.5} />
								<span>{passSuccess}</span>
							</div>
						)}

						{hasPasswordAccount && (
							<div className="space-y-1">
								<Label htmlFor="currentPassword" className="text-[11px]">
									Current Password
								</Label>
								<div className="relative">
									<Input
										id="currentPassword"
										type={showCurrentPassword ? 'text' : 'password'}
										placeholder="Enter current password"
										value={currentPassword}
										onChange={(e) => setCurrentPassword(e.target.value)}
										className="pr-9 text-xs h-8"
										required
									/>
									<button
										type="button"
										onClick={() => setShowCurrentPassword(!showCurrentPassword)}
										className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
										{showCurrentPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
									</button>
								</div>
							</div>
						)}

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div className="space-y-1">
								<Label htmlFor="newPassword" className="text-[11px]">
									{hasPasswordAccount ? 'New Password' : 'Password'}
								</Label>
								<div className="relative">
									<Input
										id="newPassword"
										type={showNewPassword ? 'text' : 'password'}
										placeholder="Min. 8 characters"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										className="pr-9 text-xs h-8"
										required
										minLength={8}
									/>
									<button
										type="button"
										onClick={() => setShowNewPassword(!showNewPassword)}
										className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
										{showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
									</button>
								</div>
							</div>

							<div className="space-y-1">
								<Label htmlFor="confirmPassword" className="text-[11px]">
									Confirm Password
								</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="Re-enter password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="text-xs h-8"
									required
									minLength={8}
								/>
							</div>
						</div>

						<div className="flex items-center gap-2 pt-1">
							<input
								type="checkbox"
								id="revokeOthers"
								checked={revokeOtherSessions}
								onChange={(e) => setRevokeOtherSessions(e.target.checked)}
								className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
							/>
							<Label htmlFor="revokeOthers" className="text-[11px] font-normal text-muted-foreground cursor-pointer">
								Revoke all other active sessions after saving
							</Label>
						</div>

						<div className="flex justify-end pt-1">
							<Button type="submit" size="sm" disabled={passLoading} className="h-7 text-xs">
								{passLoading ? (
									<>
										<Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
										Saving...
									</>
								) : (
									'Save Password'
								)}
							</Button>
						</div>
					</form>
				)}
			</div>

			{/* =================================================================== */}
			{/* SECTION 4: ACTIVE SESSIONS & DEVICES                                */}
			{/* =================================================================== */}
			<div>
				<div className="flex items-center justify-between gap-2 mb-3">
					<h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
						Active Sessions ({sessions.length})
					</h3>
					{sessions.length > 1 && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleRevokeOtherSessions}
							disabled={revokingAll}
							className="h-7 text-[11px] gap-1 px-2 text-destructive hover:bg-destructive/10">
							{revokingAll ? (
								<Loader2 className="h-3 w-3 animate-spin" />
							) : (
								<LogOut className="h-3 w-3" />
							)}
							Revoke Others
						</Button>
					)}
				</div>
				<div className="border-t border-border" />

				{sessionsLoading ? (
					<div className="py-4 flex justify-center">
						<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
					</div>
				) : sessions.length === 0 ? (
					<p className="text-xs text-muted-foreground py-3">No active sessions found.</p>
				) : (
					<div className="divide-y divide-border">
						{sessions.map((session, index) => {
							const isCurrent = index === 0;
							return (
								<div key={session.id || session.token || index} className="flex items-center justify-between py-3">
									<div className="flex items-center gap-3">
										<div className="p-1.5 rounded-md bg-muted/60 border border-border">
											{getDeviceIcon(session.userAgent)}
										</div>
										<div>
											<div className="flex items-center gap-2">
												<p className="text-xs font-medium text-foreground">
													{formatUA(session.userAgent)}
												</p>
												{isCurrent && (
													<span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
														Current
													</span>
												)}
											</div>
											<p className="text-[11px] text-muted-foreground mt-0.5">
												IP: {session.ipAddress || '127.0.0.1'} •{' '}
												{session.updatedAt ? new Date(session.updatedAt).toLocaleDateString() : 'Active now'}
											</p>
										</div>
									</div>

									{!isCurrent && (
										<ActionButton
											variant="destructive"
											onClick={() => handleRevokeSession(session.token)}>
											{revokingToken === session.token ? 'Revoking...' : 'Revoke'}
										</ActionButton>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* DANGER ZONE */}
			<div className="mt-8 border-[length:var(--border-width)] border-black rounded-lg bg-destructive/10 p-4 shadow-brutal-md space-y-3">
				<div className="flex items-center justify-between flex-wrap gap-3">
					<div>
						<p className="text-xs font-black text-destructive uppercase tracking-wider font-mono">Delete Account</p>
						<p className="text-[11px] text-muted-foreground mt-0.5">
							Permanently erase your account, smile data, and coin balance.
						</p>
					</div>
					<Button
						variant="destructive"
						size="sm"
						onClick={() => setDeleteModalOpen(true)}
						className="h-8 text-xs font-black uppercase tracking-wider border-[length:var(--border-width)] border-black shadow-brutal-sm">
						<Trash2 className="mr-1.5 h-3.5 w-3.5" />
						Delete Account
					</Button>
				</div>
			</div>

			{/* DELETE ACCOUNT CONFIRMATION MODAL */}
			{deleteModalOpen && (
				<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60">
					<div className="w-full max-w-md border-[length:var(--border-width)] border-black rounded-xl bg-background p-6 shadow-brutal-xl space-y-4">
						<div className="flex items-center gap-3 text-destructive">
							<div className="p-2 border-[length:var(--border-width)] border-black rounded-md bg-destructive/10">
								<AlertTriangle className="h-6 w-6" strokeWidth={2.5} />
							</div>
							<div>
								<h3 className="text-lg font-black font-title">Delete Account?</h3>
								<p className="text-xs text-muted-foreground font-semibold">This action cannot be undone.</p>
							</div>
						</div>

						<p className="text-xs text-muted-foreground leading-relaxed">
							Deleting your account will immediately revoke access to all features and permanently erase your data.
						</p>

						{deleteError && (
							<div className="p-2.5 bg-destructive/10 border-[length:var(--border-width)] border-black rounded-md text-xs font-bold text-destructive">
								{deleteError}
							</div>
						)}

						<div className="space-y-1.5">
							<Label htmlFor="deleteConfirm" className="text-xs font-bold font-mono uppercase tracking-wider">
								Type <span className="font-black text-foreground select-all underline">DELETE</span> to confirm:
							</Label>
							<Input
								id="deleteConfirm"
								type="text"
								placeholder="DELETE"
								value={deleteConfirmInput}
								onChange={(e) => setDeleteConfirmInput(e.target.value)}
								className="text-sm h-9"
							/>
						</div>

						<div className="flex items-center justify-end gap-2 pt-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setDeleteModalOpen(false);
									setDeleteConfirmInput('');
									setDeleteError(null);
								}}>
								Cancel
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={handleDeleteAccount}
								disabled={deleteConfirmInput !== 'DELETE' || deleteLoading}>
								{deleteLoading ? (
									<>
										<Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
										Deleting...
									</>
								) : (
									'Permanently Delete Account'
								)}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
