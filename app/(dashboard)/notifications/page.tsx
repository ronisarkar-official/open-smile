'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Bell,
  Check,
  CheckCheck,
  Flame,
  Gift,
  Trophy,
  Sparkles,
  Camera,
  Trash2,
  SlidersHorizontal,
  ArrowRight,
  UserPlus,
  ShieldCheck,
  Clock,
  Inbox,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CoinIcon } from '@/components/ui/coin-icon';
import { UserCoinBalance, UserStreak } from '@/components/icons';
import { cn } from '@/lib/utils';

export type NotificationCategory = 'all' | 'unread' | 'rewards' | 'streaks' | 'leaderboard';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  read: boolean;
  category: 'rewards' | 'streaks' | 'leaderboard' | 'social' | 'system';
  icon: React.ElementType;
  iconBg: string;
  action?: {
    label: string;
    url: string;
  };
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '3-Day Smile Streak Active! 🔥',
    description: 'You kept your smile streak going today! Smile again tomorrow before midnight to unlock your 1.5x coin multiplier.',
    time: '12m ago',
    date: 'Today',
    read: false,
    category: 'streaks',
    icon: Flame,
    iconBg: 'bg-secondary text-secondary-foreground',
    action: {
      label: 'Capture Smile',
      url: '/capture',
    },
  },
  {
    id: 'notif-2',
    title: '₹100 Amazon Voucher Unlocked 🎁',
    description: 'Congratulations! Your coin balance reached 247 coins. You now have enough to claim your first Amazon Gift Card voucher.',
    time: '2h ago',
    date: 'Today',
    read: false,
    category: 'rewards',
    icon: Gift,
    iconBg: 'bg-primary text-primary-foreground',
    action: {
      label: 'Claim Voucher',
      url: '/rewards',
    },
  },
  {
    id: 'notif-3',
    title: 'Top 10 Daily Leaderboard Placement 🏆',
    description: 'Your 96% genuine smile score placed you at #8 on today’s global leaderboard! Top 3 finishers win 500 bonus coins at midnight.',
    time: '5h ago',
    date: 'Today',
    read: false,
    category: 'leaderboard',
    icon: Trophy,
    iconBg: 'bg-accent text-accent-foreground',
    action: {
      label: 'View Rankings',
      url: '/leaderboard',
    },
  },
  {
    id: 'notif-4',
    title: 'Friend Joined Using Your Code ✨',
    description: 'Alex just joined Open Smile with your referral link! You earned +50 bonus referral coins.',
    time: '1d ago',
    date: 'Yesterday',
    read: true,
    category: 'social',
    icon: UserPlus,
    iconBg: 'bg-primary text-primary-foreground',
    action: {
      label: 'Invite More',
      url: '/refer',
    },
  },
  {
    id: 'notif-5',
    title: 'Account Security Verified 🛡️',
    description: 'Your email address and session authentication were successfully verified.',
    time: '2d ago',
    date: 'Aug 25',
    read: true,
    category: 'system',
    icon: ShieldCheck,
    iconBg: 'bg-muted text-muted-foreground',
  },
  {
    id: 'notif-6',
    title: 'Daily Smile Bonus Claimed 📸',
    description: 'You earned 68 coins from your morning smile detection test.',
    time: '3d ago',
    date: 'Aug 24',
    read: true,
    category: 'rewards',
    icon: Sparkles,
    iconBg: 'bg-primary text-primary-foreground',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = React.useState<NotificationCategory>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = React.useMemo(() => {
    return notifications.filter((item) => {
      if (activeCategory === 'unread') return !item.read;
      if (activeCategory === 'rewards') return item.category === 'rewards';
      if (activeCategory === 'streaks') return item.category === 'streaks';
      if (activeCategory === 'leaderboard') return item.category === 'leaderboard';
      return true;
    });
  }, [notifications, activeCategory]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  const categories: { id: NotificationCategory; label: string; count?: number }[] = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'rewards', label: 'Rewards & Coins' },
    { id: 'streaks', label: 'Streaks' },
    { id: 'leaderboard', label: 'Leaderboard' },
  ];

  return (
    <main id="main-content" className="mx-auto w-full max-w-4xl px-3 py-4 sm:px-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 border-[length:var(--border-width)] border-black rounded-md bg-card px-2.5 font-mono text-xs font-bold shadow-brutal-sm brutal-lift"
          >
            <Link href="/dashboard" className="gap-1.5">
              <ArrowLeft className="size-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="inline-flex items-center border-[length:var(--border-width)] border-black rounded-md bg-primary px-2 py-0.5 font-mono text-xs font-black shadow-brutal-xs">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Real-time activity, streaks, vouchers & challenge rewards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="border-[length:var(--border-width)] border-black rounded-md bg-card font-mono text-xs font-bold uppercase shadow-brutal-sm brutal-lift hover:bg-muted"
            >
              <CheckCheck className="size-3.5 mr-1" strokeWidth={2.5} />
              Mark all read
            </Button>
          )}

          {notifications.some((n) => n.read) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllRead}
              className="border-[length:var(--border-width)] border-black rounded-md bg-card font-mono text-xs font-bold uppercase text-muted-foreground shadow-brutal-sm brutal-lift hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5 mr-1" strokeWidth={2.5} />
              Clear read
            </Button>
          )}
        </div>
      </div>

      

        

        
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b-[length:var(--border-width)] border-black/15">
        {categories.map((tab) => {
          const active = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={cn(
                'flex items-center gap-2 border-[length:var(--border-width)] rounded-md px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all',
                active
                  ? 'border-black bg-primary text-primary-foreground shadow-brutal-sm'
                  : 'border-transparent bg-card text-muted-foreground hover:border-black hover:text-foreground'
              )}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  className={cn(
                    'rounded px-1.5 py-0.2 font-mono text-[10px] font-black',
                    active ? 'bg-black text-primary' : 'bg-muted text-foreground'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="mt-6 space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center border-[length:var(--border-width)] border-black rounded-xl bg-card p-10 text-center shadow-brutal-lg">
            <div className="flex size-14 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-primary/20 text-primary shadow-brutal-sm mb-4">
              <Inbox className="size-7" strokeWidth={2.5} />
            </div>
            <h3 className="font-display text-lg font-black tracking-tight">
              No notifications here
            </h3>
            <p className="font-mono text-xs text-muted-foreground max-w-sm mt-1 mb-6">
              You’re completely up to date! Capture smiles daily to keep earning streaks and leaderboard prizes.
            </p>
            <Button
              asChild
              className="border-[length:var(--border-width)] border-black rounded-md bg-primary font-mono text-xs font-black uppercase text-primary-foreground shadow-brutal brutal-lift hover:bg-primary/90"
            >
              <Link href="/capture" className="gap-2">
                <Camera className="size-4" strokeWidth={2.5} />
                <span>Capture Today&apos;s Smile</span>
              </Link>
            </Button>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={cn(
                  'group relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-[length:var(--border-width)] border-black rounded-xl p-4 sm:p-5 shadow-brutal transition-all cursor-pointer',
                  notif.read
                    ? 'bg-card hover:bg-muted/40'
                    : 'bg-card ring-2 ring-primary/60 hover:bg-primary/5'
                )}
              >
                <div className="flex items-start gap-3.5 sm:gap-4">
                  {/* Category Icon */}
                  <div
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg shadow-brutal-xs',
                      notif.iconBg
                    )}
                  >
                    <Icon className="size-5" strokeWidth={2.5} />
                  </div>

                  {/* Content */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-title font-black text-sm tracking-tight text-foreground">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="inline-flex items-center px-1.5 py-0.2 font-mono text-[9px] font-black uppercase tracking-wider bg-destructive text-destructive-foreground border border-black rounded">
                          Unread
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {notif.description}
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-muted-foreground">
                        <Clock className="size-3" />
                        {notif.time}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground/60">
                        • {notif.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                  {notif.action && (
                    <Button
                      asChild
                      size="sm"
                      className="h-8 border-[length:var(--border-width)] border-black rounded-md bg-primary px-3 font-mono text-xs font-black uppercase text-primary-foreground shadow-brutal-xs brutal-lift hover:bg-primary/90"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link href={notif.action.url} className="gap-1.5">
                        <span>{notif.action.label}</span>
                        <ArrowRight className="size-3.5" strokeWidth={2.5} />
                      </Link>
                    </Button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => deleteNotification(notif.id, e)}
                    title="Delete notification"
                    className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
