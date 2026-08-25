'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  Loader2,
  LogOut,
  SlidersHorizontal,
  User,
} from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { ProfileContent } from '@/components/settings/profile-content';
import { PreferencesContent } from '@/components/settings/preferences-content';
import { PlaceholderContent } from '@/components/settings/placeholder-content';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SettingsSection } from '@/components/settings/settings-shared';

const mobileNavSections: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile & Security', icon: User },
  { id: 'preferences', label: 'Appearance & UI', icon: SlidersHorizontal },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = React.useState<SettingsSection>('profile');
  const [avatarOverride, setAvatarOverride] = React.useState<string | null>(null);

  const user = session?.user;
  const userName = user?.name ?? 'User';
  const userEmail = user?.email ?? '';
  const userAvatar = avatarOverride ?? user?.image ?? '';
  const userInitials =
    userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  if (isPending) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-4xl items-center justify-center p-4">
        <div className="flex items-center gap-2 border-[2px] border-black bg-card px-4 py-3 shadow-[4px_4px_0_#000]">
          <Loader2 className="size-5 animate-spin text-primary" />
          <span className="font-mono text-xs font-bold uppercase">Loading Settings...</span>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="mx-auto w-full max-w-3xl px-3 py-4 sm:px-6 sm:py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 border-[2px] border-black bg-card px-2.5 font-mono text-xs font-bold shadow-[2px_2px_0_#000]"
          >
            <Link href="/dashboard" className="gap-1">
              <ArrowLeft className="size-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
              Settings
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              Account, privacy & preferences
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            signOut({
              fetchOptions: {
                onSuccess: () => {
                  window.location.href = '/';
                },
              },
            })
          }
          className="border-[2px] border-black bg-card font-mono text-xs font-bold uppercase text-destructive shadow-[2px_2px_0_#000] hover:bg-destructive/10"
        >
          <LogOut className="size-3.5" strokeWidth={2.5} />
          <span className="hidden sm:inline ml-1">Log out</span>
        </Button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b-[2px] border-black/15">
        {mobileNavSections.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 border-[2px] px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all',
                active
                  ? 'border-black bg-primary text-black shadow-[3px_3px_0_#000]'
                  : 'border-transparent bg-card text-muted-foreground hover:border-black hover:text-foreground'
              )}
            >
              <Icon className="size-4" strokeWidth={2.5} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 border-[3px] border-black bg-card p-4 sm:p-6 shadow-[6px_6px_0_#000]">
        {activeTab === 'profile' ? (
          <ProfileContent
            userName={userName}
            userEmail={userEmail}
            userAvatar={userAvatar}
            userInitials={userInitials}
            onAvatarChange={setAvatarOverride}
          />
        ) : activeTab === 'preferences' ? (
          <PreferencesContent />
        ) : (
          <PlaceholderContent
            title="Notification Settings"
            description="Manage your email and daily habit reminder preferences."
          />
        )}
      </div>
    </main>
  );
}
