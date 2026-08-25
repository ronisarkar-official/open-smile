'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { type SettingsSection, SECTION_META } from '@/components/settings/settings-shared';
import { SettingsSidebar, SettingsMobileNav } from '@/components/settings/settings-sidebar';
import { ProfileContent } from '@/components/settings/profile-content';
import { PreferencesContent } from '@/components/settings/preferences-content';
import { PlaceholderContent } from '@/components/settings/placeholder-content';

// ---------------------------------------------------------------------------
// Main Settings Dialog
// ---------------------------------------------------------------------------

export interface SettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userName: string;
	userEmail: string;
	userAvatar: string;
	userInitials: string;
	onAvatarChange?: (newUrl: string) => void;
	defaultSection?: SettingsSection;
}

export function SettingsDialog({
	open,
	onOpenChange,
	userName,
	userEmail,
	userAvatar,
	userInitials,
	onAvatarChange,
	defaultSection = 'profile',
}: SettingsDialogProps) {
	const [activeSection, setActiveSection] =
		React.useState<SettingsSection>(defaultSection);
	const [avatar, setAvatar] = React.useState(userAvatar);

	React.useEffect(() => {
		if (open) {
			setActiveSection(defaultSection);
		}
	}, [open, defaultSection]);

	React.useEffect(() => {
		setAvatar(userAvatar);
	}, [userAvatar]);

	const handleAvatarChange = React.useCallback((newUrl: string) => {
		setAvatar(newUrl);
		onAvatarChange?.(newUrl);
	}, [onAvatarChange]);

	return (
		<DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
			<AnimatePresence>
				{open && (
					<DialogPrimitive.Portal forceMount>
						{/* Overlay */}
						<DialogPrimitive.Overlay asChild forceMount>
							<motion.div
								className="fixed inset-0 z-50 bg-black/60"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.15 }}
							/>
						</DialogPrimitive.Overlay>

						{/* Content */}
						<DialogPrimitive.Content asChild forceMount>
							<motion.div
								className="fixed z-50 flex overflow-hidden border-[3px] border-black bg-background shadow-[8px_8px_0_#000] inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[min(95vw,960px)] sm:h-[min(85vh,680px)]"
								initial={{ opacity: 0, scale: 0.96, y: 10 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.96, y: 10 }}
								transition={{
									type: 'spring',
									damping: 25,
									stiffness: 350,
								}}>
								{/* Visually hidden title for accessibility */}
								<DialogPrimitive.Title className="sr-only">
									Settings
								</DialogPrimitive.Title>
								<DialogPrimitive.Description className="sr-only">
									Manage your account settings, workspace, and
									preferences.
								</DialogPrimitive.Description>

								{/* ---- Left Sidebar ---- */}
								<SettingsSidebar
									activeSection={activeSection}
									onSectionChange={setActiveSection}
									userName={userName}
									userAvatar={avatar}
									userInitials={userInitials}
								/>

								{/* ---- Mobile nav ---- */}
								<SettingsMobileNav
									activeSection={activeSection}
									onSectionChange={setActiveSection}
								/>

								{/* ---- Right Content ---- */}
								<div className="flex-1 overflow-y-auto p-6 sm:p-8 relative">
									{/* Close button */}
									<DialogPrimitive.Close className="absolute top-4 right-4 p-1.5 border-[2px] border-black bg-card shadow-[2px_2px_0_#000] text-foreground hover:bg-muted brutal-lift transition-all z-10">
										<X className="h-4 w-4" strokeWidth={2.5} />
										<span className="sr-only">Close</span>
									</DialogPrimitive.Close>

									{/* Render active section content */}
                  <AnimatePresence mode="wait" initial={false}>
										<motion.div
											key={activeSection}
											initial={{ opacity: 0, x: 8 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: -8 }}
											transition={{ duration: 0.15 }}>
										{activeSection === 'profile' ? (
											<ProfileContent
												userName={userName}
												userEmail={userEmail}
												userAvatar={avatar}
												userInitials={userInitials}
												onAvatarChange={handleAvatarChange}
											/>
										) : activeSection === 'preferences' ? (
											<PreferencesContent />
										) : (
												<PlaceholderContent
													title={
														SECTION_META[
															activeSection
														].title
													}
													description={
														SECTION_META[
															activeSection
														].description
													}
												/>
											)}
										</motion.div>
									</AnimatePresence>
								</div>
							</motion.div>
						</DialogPrimitive.Content>
					</DialogPrimitive.Portal>
				)}
			</AnimatePresence>
		</DialogPrimitive.Root>
	);
}
