import { Logo } from "@/components/logo";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center space-y-4">
        <Logo className="h-9 w-auto animate-pulse" />
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
