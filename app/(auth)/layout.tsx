import { Logo } from "@/components/logo";

export const runtime = "edge";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding / decorative (desktop only) */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] relative overflow-hidden flex-col justify-between p-10 xl:p-12 border-r border-border bg-muted text-foreground">
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Logo/>
        </div>

        {/* Headline */}
        <div className="relative z-10 space-y-5">
          <h1 className="text-[2.5rem] xl:text-5xl font-bold leading-[1.15] tracking-tight">
            Build something amazing today.
          </h1>
          <p className="text-base xl:text-lg text-muted-foreground max-w-sm leading-relaxed">
            Ship your next product faster with authentication and a polished UI out of the box.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
