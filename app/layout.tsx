import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Space_Mono, Sora } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";
import { ToastProvider } from "@/hooks/use-toast";
import { SystemSettingsProvider } from "@/hooks/use-system-settings";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { PwaProvider } from "@/components/pwa/pwa-provider";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#121014" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const rawBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL ||
  "https://open-smile.vercel.app";
const baseUrl = rawBaseUrl.replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Open Smile: smile more, win more",
    template: "%s · Open Smile",
  },
  description:
    "A playful smile-recognition rewards platform where everyday smiles earn real rewards.",
  applicationName: "Open Smile",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Open Smile",
    title: "Open Smile: smile more, win more",
    description:
      "A playful smile-recognition rewards platform where everyday smiles earn real rewards.",
    images: [
      {
        url: "/open-smile_default-image.webp",
        width: 1424,
        height: 810,
        alt: "Open Smile — Smile More, Win More",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Smile: smile more, win more",
    description:
      "A playful smile-recognition rewards platform where everyday smiles earn real rewards.",
    images: [
      {
        url: "/open-smile_default-image.webp",
        width: 1424,
        height: 810,
        alt: "Open Smile — Smile More, Win More",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Open Smile",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  verification: {
    google: "h-sOGh3RDTQVIFlEQzlnvqZ7OOPT0bxEQxFnY9W_L5s",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
  weight: ["400", "700"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
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

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${baseUrl}/#webapp`,
      name: "Open Smile",
      url: baseUrl,
      image: `${baseUrl}/open-smile_default-image.webp`,
      applicationCategory: "GameApplication, LifestyleApplication",
      operatingSystem: "Web, iOS, Android",
      description:
        "A playful smile-recognition rewards platform where everyday smiles earn real rewards.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "On-device AI smile detection",
        "Gamified streak counter",
        "Daily voucher rewards",
        "Leaderboards and badges",
      ],
    },
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "Open Smile",
      url: baseUrl,
      logo: `${baseUrl}/icons/icon-512x512.png`,
      image: `${baseUrl}/open-smile_default-image.webp`,
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "Open Smile",
      url: baseUrl,
      publisher: {
        "@id": `${baseUrl}/#organization`,
      },
    },
  ],
};

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
      className={`${inter.variable} ${outfit.variable} ${spaceMono.variable} ${sora.variable} h-full font-sans antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <NavigationProgress />
        <ThemeProvider defaultTheme="light" storageKey="app-theme">
          <SessionProvider>
            <ToastProvider>
              <SystemSettingsProvider>
                <PwaProvider>
                  {children}
                  <Toaster />
                </PwaProvider>
              </SystemSettingsProvider>
            </ToastProvider>
          </SessionProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
