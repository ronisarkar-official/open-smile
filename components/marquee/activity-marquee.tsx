'use client';

import * as React from "react";

const PLACEHOLDER_ACTIVITY = [
  { text: "Someone just scored 94! 🔥" },
  { text: "A user earned 12 coins" },
  { text: "Someone hit a 7-day streak! 🔥" },
  { text: "A user just redeemed an Amazon voucher" },
  { text: "Someone just scored 88! 😁" },
  { text: "A user earned 8 coins" },
  { text: "Someone hit a 3-day streak!" },
  { text: "A user just redeemed a Flipkart voucher" },
];

export function ActivityMarquee() {
  const [items, setItems] = React.useState(PLACEHOLDER_ACTIVITY);

  React.useEffect(() => {
    async function loadActivity() {
      try {
        const res = await fetch("/api/v1/activity/recent");
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.items) && json.items.length > 0) {
            setItems(json.items.map((i: { text: string }) => ({ text: i.text })));
          }
        }
      } catch {}
    }
    loadActivity();
  }, []);

  return (
    <section
      aria-label="Recent activity ticker"
      className="group relative flex w-full overflow-hidden border-y-[length:var(--border-width)] border-black bg-accent/20 py-2.5 select-none dark:bg-[#221f28]"
    >
      <div className="flex shrink-0 items-center gap-3 pr-3 animate-marquee group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused] motion-reduce:animate-none">
        {items.map((item, index) => (
          <div
            key={`act-a-${index}`}
            className="inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-full bg-card px-3.5 py-1 text-xs font-bold text-card-foreground shadow-none sm:text-sm whitespace-nowrap"
          >
            <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
      <div
        className="flex shrink-0 items-center gap-3 pr-3 animate-marquee group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused] motion-reduce:hidden"
        aria-hidden="true"
      >
        {items.map((item, index) => (
          <div
            key={`act-b-${index}`}
            className="inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-full bg-card px-3.5 py-1 text-xs font-bold text-card-foreground shadow-none sm:text-sm whitespace-nowrap"
          >
            <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ActivityMarquee;
