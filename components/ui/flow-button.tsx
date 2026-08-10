"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export interface FlowButtonProps extends React.ComponentProps<typeof Button> {
  text?: string;
}

export const FlowButton: React.FC<FlowButtonProps> = ({
  text = "Find shelter",
  className = "",
  ...props
}) => {
  return (
    <Button
      size="lg"
      className={`relative overflow-hidden rounded-full px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md ${className}`}
      {...props}
    >
      <span className="relative z-10">{text}</span>
    </Button>
  );
};
