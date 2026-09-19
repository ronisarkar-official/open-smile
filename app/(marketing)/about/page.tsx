import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer, SmoothScroll } from "@/components/landing";
import {
  AboutHero,
  AboutStory,
  AboutPillars,
  AboutTechDeepDive,
  AboutTeam,
  AboutManifesto,
  AboutCta,
} from "@/components/about";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL ||
  "https://open-smile.vercel.app";
const baseUrl = rawBaseUrl.replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "About Us · Open Smile — On-Device Facial AI & Team",
  description:
    "Meet the team behind Open Smile, our mission to turn smiles into real rewards, and how our on-device MediaPipe AI scores facial geometry with 100% privacy.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us · Open Smile — On-Device Facial AI & Team",
    description:
      "Meet the team behind Open Smile, our mission to turn smiles into real rewards, and how our on-device MediaPipe AI scores facial geometry with 100% privacy.",
    url: `${baseUrl}/about`,
    images: [
      {
        url: "/open-smile_default-image.webp",
        width: 1424,
        height: 810,
        alt: "About Open Smile — Smile More, Win More",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us · Open Smile — On-Device Facial AI & Team",
    description:
      "Meet the team behind Open Smile, our mission to turn smiles into real rewards, and how our on-device MediaPipe AI scores facial geometry with 100% privacy.",
    images: [
      {
        url: "/open-smile_default-image.webp",
        width: 1424,
        height: 810,
        alt: "About Open Smile — Smile More, Win More",
      },
    ],
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${baseUrl}/about#webpage`,
      url: `${baseUrl}/about`,
      name: "About Us · Open Smile",
      description:
        "Meet the team behind Open Smile, our mission to turn smiles into real rewards, and how our on-device MediaPipe AI scores facial geometry with 100% privacy.",
      publisher: {
        "@type": "Organization",
        name: "Open Smile",
        url: baseUrl,
        logo: `${baseUrl}/icons/icon-512x512.png`,
      },
      about: {
        "@type": "Organization",
        name: "Open Smile",
        description:
          "A gamified, on-device AI-powered smile rewards platform where everyday genuine smiles earn real gift vouchers.",
        member: [
          {
            "@type": "Person",
            name: "Sohan",
            jobTitle: "Database Architect",
          },
          {
            "@type": "Person",
            name: "Ayushi",
            jobTitle: "Cloud & Infra",
          },
          {
            "@type": "Person",
            name: "Roni",
            jobTitle: "Frontend & UI/UX Lead",
          },
          {
            "@type": "Person",
            name: "Akash",
            jobTitle: "Backend & Game Engine",
          },
          {
            "@type": "Person",
            name: "Subal",
            jobTitle: "AI & Computer Vision",
          },
        ],
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About Us",
          item: `${baseUrl}/about`,
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <SmoothScroll />
      <Navbar />
      <main id="main-content" className="flex-1 overflow-x-clip">
        <AboutHero />
        <AboutStory />
        <AboutPillars />
        <AboutTechDeepDive />
        <AboutTeam />
        <AboutManifesto />
        <AboutCta />
      </main>
      <Footer />
    </div>
  );
}
