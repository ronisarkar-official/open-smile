import type { Metadata } from "next";
import { Inter, Space_Grotesk, Space_Mono, Syne } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";
import { ToastProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "Open Smile: smile more, win more",
    template: "%s · Open Smile",
  },
  description:
    "A playful smile-recognition rewards platform where everyday smiles earn real rewards.",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
  weight: ["400", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('app-theme') || 'light';
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${syne.variable} h-full font-sans antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-500 bg-primary px-4 py-2 font-bold text-primary-foreground focus:not-sr-only focus:brutal-surface"
        >
          Skip to content
        </a>
        <ThemeProvider defaultTheme="light" storageKey="app-theme">
          <SessionProvider>
            <ToastProvider>
              {children}
              <Toaster />
            </ToastProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
