import React from "react";
import { type IllustrationProps } from "./types";

export function AkashIllustration({ className = "h-full w-full object-contain", ...props }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 240 340"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Akash illustration"
      {...props}
    >
      <defs>
        <clipPath id="akash-clip">
          <rect width="240" height="340" />
        </clipPath>
      </defs>
      <g clipPath="url(#akash-clip)">
        {/* Shoulders & Jacket */}
        <path
          d="M55 330 C58 245 76 215 106 208 L134 208 C164 215 182 245 185 330 Z"
          fill="#3B82F6"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner T-shirt (Striped) */}
        <path
          d="M104 210 L136 210 L142 330 L98 330 Z"
          fill="#FFFFFF"
          stroke="#1F1511"
          strokeWidth="3"
        />
        {/* Horizontal Stripes on Tee */}
        <line x1="102" y1="235" x2="138" y2="235" stroke="#1F1511" strokeWidth="2.5" />
        <line x1="100" y1="255" x2="140" y2="255" stroke="#1F1511" strokeWidth="2.5" />
        <line x1="99" y1="275" x2="141" y2="275" stroke="#1F1511" strokeWidth="2.5" />
        <line x1="98" y1="295" x2="142" y2="295" stroke="#1F1511" strokeWidth="2.5" />
        <line x1="98" y1="315" x2="142" y2="315" stroke="#1F1511" strokeWidth="2.5" />

        {/* Jacket Lapels / Collar */}
        <path
          d="M75 228 L104 210 L108 260 L80 252 Z"
          fill="#2563EB"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M165 228 L136 210 L132 260 L160 252 Z"
          fill="#2563EB"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Jacket Pocket detail */}
        <path
          d="M68 275 L86 275 L86 298 L68 298 Z"
          fill="#2563EB"
          stroke="#1F1511"
          strokeWidth="2.5"
        />

        {/* Neck */}
        <path
          d="M104 170 L104 212 Q120 218 136 212 L136 170 Z"
          fill="#F5C4A8"
          stroke="#1F1511"
          strokeWidth="3.5"
        />

        {/* Head / Jaw (Male) */}
        <path
          d="M92 115 C90 80 102 68 120 68 C138 68 150 80 148 115 C146 150 140 180 120 180 C100 180 94 150 92 115 Z"
          fill="#FDE4D4"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Ears */}
        <path
          d="M90 124 C83 124 83 140 90 142"
          fill="#FDE4D4"
          stroke="#1F1511"
          strokeWidth="3.5"
        />
        <path
          d="M150 124 C157 124 157 140 150 142"
          fill="#FDE4D4"
          stroke="#1F1511"
          strokeWidth="3.5"
        />

        {/* Glasses Frame (Modern Square/Rounded Thick Glasses) */}
        {/* Left Rim */}
        <rect
          x="92"
          y="110"
          width="26"
          height="24"
          rx="6"
          fill="#FFFFFF"
          fillOpacity="0.85"
          stroke="#1F1511"
          strokeWidth="3.5"
        />
        {/* Right Rim */}
        <rect
          x="122"
          y="110"
          width="26"
          height="24"
          rx="6"
          fill="#FFFFFF"
          fillOpacity="0.85"
          stroke="#1F1511"
          strokeWidth="3.5"
        />
        {/* Glasses Bridge */}
        <path
          d="M118 118 L122 118"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Glasses Temples (Arms) */}
        <line x1="92" y1="116" x2="88" y2="120" stroke="#1F1511" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="148" y1="116" x2="152" y2="120" stroke="#1F1511" strokeWidth="3.5" strokeLinecap="round" />

        {/* Eyes inside glasses */}
        <ellipse cx="105" cy="122" rx="7" ry="8" fill="#3B82F6" />
        <ellipse cx="106" cy="122" rx="4" ry="5" fill="#182026" />
        <circle cx="103" cy="118" r="2" fill="#FFFFFF" />

        <ellipse cx="135" cy="122" rx="7" ry="8" fill="#3B82F6" />
        <ellipse cx="136" cy="122" rx="4" ry="5" fill="#182026" />
        <circle cx="133" cy="118" r="2" fill="#FFFFFF" />

        {/* Eyebrows */}
        <path
          d="M94 100 C102 96 114 98 117 102"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M123 102 C126 98 138 96 146 100"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Nose */}
        <path
          d="M120 128 C124 135 120 142 115 140"
          stroke="#1F1511"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Confident Friendly Smile with Teeth */}
        <path
          d="M106 154 Q120 154 134 154 Q137 168 120 170 Q103 168 106 154 Z"
          fill="#FFFFFF"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <line x1="113" y1="154" x2="113" y2="168" stroke="#1F1511" strokeWidth="1.5" />
        <line x1="120" y1="154" x2="120" y2="169" stroke="#1F1511" strokeWidth="1.5" />
        <line x1="127" y1="154" x2="127" y2="168" stroke="#1F1511" strokeWidth="1.5" />

        {/* Stylish Men's Haircut (Modern Quiff / Textured Fringe) */}
        <path
          d="M86 102 C84 62 102 44 125 44 C148 44 162 58 158 98 C155 100 150 96 148 88 C144 76 135 74 122 74 C106 74 98 84 94 98 C90 102 88 102 86 102 Z"
          fill="#4A3428"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Hair Texture Tufts */}
        <path
          d="M110 50 Q118 64 126 52"
          stroke="#1F1511"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M130 54 Q138 68 146 58"
          stroke="#1F1511"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M96 70 Q106 58 116 66"
          stroke="#684A39"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export default AkashIllustration;
