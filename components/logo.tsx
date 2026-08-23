import React from "react";

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = "h-9 w-auto text-foreground",
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 212 40"
      fill="none"
      className={className}
      role="img"
      aria-label="Open Smile"
      {...props}
    >
      <title>Open Smile</title>
      <rect x="1.5" y="1.5" width="37" height="37" fill="#FFD23F" stroke="currentColor" strokeWidth="3" />
      <circle cx="13" cy="16" r="2.5" fill="currentColor" />
      <circle cx="27" cy="16" r="2.5" fill="currentColor" />
      <path d="M11 23.5C14.5 30 25.5 30 29 23.5" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      <text
        x="50"
        y="28"
        fill="currentColor"
        fontFamily="var(--font-title), ui-sans-serif, system-ui, sans-serif"
        fontSize="23"
        fontWeight="800"
        letterSpacing="-1"
      >
        OPEN SMILE
      </text>
    </svg>
  );
};
