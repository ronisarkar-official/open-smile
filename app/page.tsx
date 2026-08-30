import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/backend/auth";
import { Navbar } from "@/components/navbar";
import {
  Hero,
  HowItWorks,
  WhyItsDifferentBento,
  TrustPrivacy,
  FinalCta,
  Footer,
} from "@/components/landing";
import { ActivityMarquee } from "@/components/marquee/activity-marquee";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 overflow-hidden">
        <Hero />
        <ActivityMarquee />
        <HowItWorks />
        <WhyItsDifferentBento />
        <TrustPrivacy />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

