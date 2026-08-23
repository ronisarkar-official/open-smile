import Link from "next/link";
import { Camera, Coins, ScanFace } from "lucide-react";
import { Logo } from "@/components/logo";

export const runtime = "edge";

const highlights = [
  { label: "Smile checks", icon: Camera, color: "bg-primary" },
  { label: "On-device score", icon: ScanFace, color: "bg-accent" },
  { label: "Real rewards", icon: Coins, color: "bg-secondary" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[100dvh] bg-background lg:h-[100dvh] lg:overflow-hidden lg:grid-cols-[minmax(22rem,0.85fr)_minmax(0,1.15fr)]">
      <aside className="relative hidden overflow-hidden border-r-[3px] border-black bg-primary p-8 lg:flex lg:flex-col xl:p-10">
        <Link href="/" className="relative z-10 w-fit focus-visible:outline-3 focus-visible:outline-offset-4">
          <Logo className="h-9 w-auto" />
        </Link>
        <div className="relative z-10 my-auto max-w-md">
          <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">A brighter daily ritual</p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] xl:text-6xl xl:leading-[0.9]">
            Your smile can do more.
          </h1>
          <p className="mt-6 max-w-sm text-lg leading-8 text-black/75">
            Join the beta for private smile checks, small wins, and rewards that make showing up feel good.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-3">
          {highlights.map(({ label, icon: Icon, color }) => (
            <div key={label} className={`${color} border-[3px] border-black p-3`}>
              <Icon className="size-6" strokeWidth={2.5} />
              <p className="mt-8 text-xs font-black leading-4">{label}</p>
            </div>
          ))}
        </div>
        <div className="absolute bottom-[-2rem] right-[-2rem] size-40 border-[3px] border-black bg-secondary" />
        <div className="absolute right-12 top-24 size-12 border-[3px] border-black bg-accent" />
      </aside>

      <div className="flex min-h-[100dvh] items-center justify-center p-4 sm:p-6 lg:min-h-0 lg:p-6 xl:p-8">
        <div className="brutal-surface w-full max-w-[28rem] bg-card p-5 sm:p-6 lg:max-h-[calc(100dvh-3rem)]">
          <Link href="/" className="mb-6 inline-block lg:hidden focus-visible:outline-3 focus-visible:outline-offset-4">
            <Logo className="h-8 w-auto" />
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
