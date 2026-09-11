import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import {
  Hero,
  HowItWorks,
  WhyItsDifferentBento,
  TrustPrivacy,
  Faq,
  FinalCta,
  Footer,
  SmoothScroll,
} from "@/components/landing";
import { ActivityMarquee } from "@/components/marquee/activity-marquee";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does Open Smile recognize smiles?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Open Smile uses on-device computer vision to evaluate facial landmarks directly in your browser. Raw camera frames never leave your device.",
      },
    },
    {
      "@type": "Question",
      name: "How do smile points turn into rewards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every valid smile score earns coins added to your coin ledger. Accumulated coins can be redeemed for Amazon gift vouchers and partner rewards.",
      },
    },
    {
      "@type": "Question",
      name: "Are my photos stored or sold?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Photos are processed locally on your device and are never sold. Public explore posts are strictly opt-in and auto-delete after 24 hours.",
      },
    },
    {
      "@type": "Question",
      name: "What is a smile streak?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Smiling daily builds your consecutive streak, unlocking coin multipliers, special badges, and higher leaderboard rankings.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to download an app or extension?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No downloads required. Open Smile works directly in any standard mobile or desktop web browser with camera access enabled.",
      },
    },
    {
      "@type": "Question",
      name: "How does anti-cheat protect the reward pool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our system uses client-side liveness detection, capture cooldowns, and perceptual image hashing to reject repeat or spoofed captures, keeping the reward economy fair for everyone.",
      },
    },
  ],
};

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SmoothScroll />
      <Navbar />
      <main id="main-content" className="flex-1 overflow-x-clip">
        <Hero />
        <ActivityMarquee />
        <HowItWorks />
        <WhyItsDifferentBento />
        <TrustPrivacy />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

