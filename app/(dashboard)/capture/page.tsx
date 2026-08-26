import type { Metadata } from "next";
import { CaptureFlow } from "@/components/capture/capture-flow";

export const metadata: Metadata = {
  title: "Capture",
  description: "Open your camera, smile, and earn coins with AI-powered smile detection.",
};

export default function CapturePage() {
  return <CaptureFlow />;
}
