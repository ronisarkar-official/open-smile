import React from "react";
import { type IllustrationProps } from "./types";

export function RoniIllustration({ className = "h-full w-full object-contain", ...props }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 240 340"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Roni illustration"
      {...props}
    >
      <defs>
        <clipPath id="roni-clip">
          <rect width="240" height="340" />
        </clipPath>
      </defs>
      <g clipPath="url(#roni-clip)">
        <path
          d="M74 125 C70 38 170 38 166 125"
          stroke="#181829"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M96 50 C110 44 130 44 144 50"
          stroke="#38BDF8"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M84 100 C80 58 98 42 120 42 C142 42 160 58 156 100 C152 92 144 80 135 78 C120 76 110 80 102 83 C94 86 88 94 84 100 Z"
          fill="#452817"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        <path
          d="M104 165 L104 212 Q120 218 136 212 L136 165 Z"
          fill="#F5C4A8"
          stroke="#1F1511"
          strokeWidth="3.5"
        />
        <path
          d="M105 170 Q120 184 135 170 L135 178 Q120 192 105 178 Z"
          fill="#E5B095"
        />

        <path
          d="M90 112 C90 76 102 68 120 68 C138 68 150 76 150 112 C150 148 144 178 120 178 C96 178 90 148 90 112 Z"
          fill="#FDE4D4"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        <path d="M88 122 C82 122 82 138 88 140" fill="#FDE4D4" stroke="#1F1511" strokeWidth="3" />
        <path d="M152 122 C158 122 158 138 152 140" fill="#FDE4D4" stroke="#1F1511" strokeWidth="3" />

        <rect x="73" y="104" width="8" height="12" rx="3" fill="#64748B" stroke="#1F1511" strokeWidth="2.5" />
        <rect
          x="68"
          y="110"
          width="18"
          height="36"
          rx="9"
          fill="#181829"
          stroke="#1F1511"
          strokeWidth="3.5"
        />
        <rect x="78" y="115" width="6" height="26" rx="3" fill="#334155" />
        <line x1="74" y1="120" x2="74" y2="136" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />

        <rect x="159" y="104" width="8" height="12" rx="3" fill="#64748B" stroke="#1F1511" strokeWidth="2.5" />
        <rect
          x="154"
          y="110"
          width="18"
          height="36"
          rx="9"
          fill="#181829"
          stroke="#1F1511"
          strokeWidth="3.5"
        />
        <rect x="156" y="115" width="6" height="26" rx="3" fill="#334155" />
        <line x1="166" y1="120" x2="166" y2="136" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />

        <path
          d="M86 94 C92 72 108 62 128 64 C142 65 152 75 150 92 C142 86 130 84 116 88 C104 91 96 95 86 94 Z"
          fill="#52321D"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M102 68 Q110 56 122 62" stroke="#1F1511" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M125 60 Q138 52 144 64" stroke="#1F1511" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M92 84 Q98 76 108 80" stroke="#78472A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        <ellipse cx="98" cy="136" rx="6" ry="3.5" fill="#FCA5A5" fillOpacity="0.6" />
        <ellipse cx="142" cy="136" rx="6" ry="3.5" fill="#FCA5A5" fillOpacity="0.6" />

        <path
          d="M96 98 C103 94 113 96 116 100"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M124 100 C127 96 137 94 144 98"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        <ellipse
          cx="106"
          cy="115"
          rx="9"
          ry="12"
          fill="#FFFFFF"
          stroke="#1F1511"
          strokeWidth="3"
        />
        <ellipse cx="108" cy="115" rx="5.5" ry="6.5" fill="#0EA5E9" />
        <ellipse cx="109" cy="115" rx="3" ry="4" fill="#0F172A" />
        <circle cx="106" cy="111" r="2" fill="#FFFFFF" />
        <circle cx="110" cy="117" r="1" fill="#FFFFFF" />

        <ellipse
          cx="134"
          cy="115"
          rx="9"
          ry="12"
          fill="#FFFFFF"
          stroke="#1F1511"
          strokeWidth="3"
        />
        <ellipse cx="136" cy="115" rx="5.5" ry="6.5" fill="#0EA5E9" />
        <ellipse cx="137" cy="115" rx="3" ry="4" fill="#0F172A" />
        <circle cx="134" cy="111" r="2" fill="#FFFFFF" />
        <circle cx="138" cy="117" r="1" fill="#FFFFFF" />

        <path
          d="M120 120 C123 127 120 133 116 131"
          stroke="#1F1511"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        <path
          d="M104 146 Q120 144 136 146 Q140 165 120 168 Q100 165 104 146 Z"
          fill="#FFFFFF"
          stroke="#1F1511"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        <path
          d="M106 152 Q120 151 134 152"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />
        <line x1="114" y1="146" x2="114" y2="164" stroke="#1F1511" strokeWidth="1.5" />
        <line x1="120" y1="145" x2="120" y2="167" stroke="#1F1511" strokeWidth="1.5" />
        <line x1="126" y1="146" x2="126" y2="164" stroke="#1F1511" strokeWidth="1.5" />

        <path d="M100 148 Q98 152 101 155" stroke="#1F1511" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M140 148 Q142 152 139 155" stroke="#1F1511" strokeWidth="2" strokeLinecap="round" fill="none" />

        <path
          d="M58 330 C60 245 78 215 106 208 L134 208 C162 215 180 245 182 330 Z"
          fill="#1E293B"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        <path
          d="M78 232 L106 208 L114 245 L86 250 Z"
          fill="#334155"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M162 232 L134 208 L126 245 L154 250 Z"
          fill="#334155"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        <path
          d="M104 210 L136 210 L140 330 L100 330 Z"
          fill="#0F172A"
          stroke="#1F1511"
          strokeWidth="3"
        />

        <g transform="translate(120, 260)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fill="#38BDF8"
            fontFamily="monospace"
            fontWeight="900"
            fontSize="14"
            letterSpacing="1"
          >
            &lt; / &gt;
          </text>
          <text
            x="0"
            y="14"
            textAnchor="middle"
            fill="#F59E0B"
            fontFamily="monospace"
            fontWeight="800"
            fontSize="9"
            letterSpacing="0.5"
          >
            DEV
          </text>
        </g>

        <path d="M102 236 L98 280" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="98" cy="282" r="3" fill="#38BDF8" stroke="#1F1511" strokeWidth="1.5" />

        <path d="M138 236 L142 280" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="142" cy="282" r="3" fill="#38BDF8" stroke="#1F1511" strokeWidth="1.5" />

        <circle cx="162" cy="265" r="7" fill="#FBBF24" stroke="#1F1511" strokeWidth="2" />
        <circle cx="160" cy="263" r="1" fill="#1F1511" />
        <circle cx="164" cy="263" r="1" fill="#1F1511" />
        <path d="M159 267 Q162 270 165 267" stroke="#1F1511" strokeWidth="1.2" fill="none" strokeLinecap="round" />

        <rect x="70" y="260" width="12" height="12" rx="3" fill="#0284C7" stroke="#1F1511" strokeWidth="2" />
        <text x="76" y="269" textAnchor="middle" fill="#FFFFFF" fontFamily="monospace" fontSize="7" fontWeight="900">
          JS
        </text>
      </g>
    </svg>
  );
}

export default RoniIllustration;
