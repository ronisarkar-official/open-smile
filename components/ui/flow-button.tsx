"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export interface FlowButtonProps extends React.ComponentProps<typeof Button> {
  text?: string;
}

export const FlowButton: React.FC<FlowButtonProps> = ({
  text = "Continue",
  className = "",
  ...props
}) => {
  return (
    <Button
      size="lg"
      className={`relative overflow-hidden px-8 text-base font-semibold ${className}`}
      {...props}
    >
      <span className="relative z-10">{text}</span>
    </Button>
  );
};
