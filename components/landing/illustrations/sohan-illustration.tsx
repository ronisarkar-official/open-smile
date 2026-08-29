import React from "react";
import { type IllustrationProps } from "./types";

export function SohanIllustration({ className = "h-full w-full object-contain", ...props }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 240 340"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sohan illustration"
      {...props}
    >
      <defs>
        <clipPath id="sohan-clip">
          <rect width="240" height="340" />
        </clipPath>
      </defs>
      <g clipPath="url(#sohan-clip)">
        <path
          d="M84 100 C80 50 96 36 122 36 C148 36 162 52 158 104 C152 90 142 78 128 76 C112 74 102 80 94 88 C88 94 86 100 84 100 Z"
          fill="#352014"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        <path
          d="M104 165 L104 212 Q120 218 136 212 L136 165 Z"
          fill="#EBB89B"
          stroke="#1F1511"
          strokeWidth="3.5"
        />
        <path
          d="M105 170 Q120 184 135 170 L135 178 Q120 192 105 178 Z"
          fill="#DC9F80"
        />
        <path
          d="M106 206 Q120 216 134 206"
          stroke="#94A3B8"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        <path
          d="M56 330 C58 245 76 215 106 208 L134 208 C164 215 182 245 184 330 Z"
          fill="#1E232B"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        <path
          d="M56 330 C58 245 76 215 106 208 L104 250 L84 275 L80 330 Z"
          fill="#2C3440"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M184 330 C182 245 164 215 134 208 L136 250 L156 275 L160 330 Z"
          fill="#2C3440"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        <path
          d="M76 230 L106 208 L102 260 L80 250 Z"
          fill="#3B4656"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M164 230 L134 208 L138 260 L160 250 Z"
          fill="#3B4656"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        <path
          d="M104 210 L136 210 L140 330 L100 330 Z"
          fill="#13171F"
          stroke="#1F1511"
          strokeWidth="2.5"
        />

        <g transform="translate(120, 270)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fill="#38BDF8"
            fontFamily="monospace"
            fontWeight="900"
            fontSize="13"
            letterSpacing="1"
          >
            &lt;SQL /&gt;
          </text>
          <text
            x="0"
            y="15"
            textAnchor="middle"
            fill="#22C55E"
            fontFamily="monospace"
            fontWeight="800"
            fontSize="9"
            letterSpacing="0.5"
          >
            API: 200
          </text>
        </g>

        <rect x="68" y="270" width="12" height="12" rx="3" fill="#10B981" stroke="#1F1511" strokeWidth="2" />
        <text x="74" y="269" textAnchor="middle" fill="#FFFFFF" fontFamily="monospace" fontSize="7" fontWeight="900">
          DB
        </text>

        <circle cx="164" cy="265" r="7" fill="#FBBF24" stroke="#1F1511" strokeWidth="2" />
        <path d="M164 260 L161 265 L164 265 L163 270 L167 264 L164 264 Z" fill="#1F1511" />

        <path
          d="M92 110 C92 72 104 64 120 64 C136 64 148 72 148 110 C148 150 142 180 120 180 C98 180 92 150 92 110 Z"
          fill="#FCDCC8"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        <path
          d="M90 120 C82 120 82 138 90 140"
          fill="#FCDCC8"
          stroke="#1F1511"
          strokeWidth="3.5"
        />
        <path d="M88 126 Q85 130 88 134" stroke="#1F1511" strokeWidth="2" strokeLinecap="round" fill="none" />

        <path
          d="M150 120 C158 120 158 138 150 140"
          fill="#FCDCC8"
          stroke="#1F1511"
          strokeWidth="3.5"
        />
        <path d="M152 126 Q155 130 152 134" stroke="#1F1511" strokeWidth="2" strokeLinecap="round" fill="none" />

        <path
          d="M84 94 C88 60 110 44 134 42 C150 41 160 54 154 84 C144 72 130 70 114 74 C98 78 88 86 84 94 Z"
          fill="#4E2E1B"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M102 54 Q116 42 134 46" stroke="#78472A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M116 58 Q130 48 146 56" stroke="#78472A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M94 72 Q106 58 120 64" stroke="#1F1511" strokeWidth="2" strokeLinecap="round" fill="none" />

        <ellipse cx="98" cy="134" rx="5" ry="3" fill="#FCA5A5" fillOpacity="0.5" />
        <ellipse cx="142" cy="134" rx="5" ry="3" fill="#FCA5A5" fillOpacity="0.5" />

        <path
          d="M120 120 C124 128 120 134 116 132"
          stroke="#1F1511"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        <path
          d="M110 146 Q120 148 130 146 Q130 156 120 158 Q110 156 110 146 Z"
          fill="#FFFFFF"
          stroke="#1F1511"
          strokeWidth="2.2"
        />
        <line x1="120" y1="147" x2="120" y2="157" stroke="#CBD5E1" strokeWidth="1.5" />

        <path
          d="M96 142 C108 136 116 144 120 146 C124 144 132 136 144 142 C140 151 130 153 120 149 C110 153 100 151 96 142 Z"
          fill="#4E2E1B"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        <path
          d="M117 156 L123 156 L121 164 L119 164 Z"
          fill="#352014"
          stroke="#1F1511"
          strokeWidth="1.5"
        />

        <path
          d="M106 168 C108 184 114 202 120 206 C126 202 132 184 134 168 C128 172 112 172 106 168 Z"
          fill="#4E2E1B"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M115 180 Q120 195 120 202 Q120 195 125 180"
          stroke="#352014"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        <rect
          x="93"
          y="108"
          width="26"
          height="24"
          rx="5"
          fill="#FFFFFF"
          stroke="#1F1511"
          strokeWidth="3.5"
        />
        <rect
          x="121"
          y="108"
          width="26"
          height="24"
          rx="5"
          fill="#FFFFFF"
          stroke="#1F1511"
          strokeWidth="3.5"
        />
        <line x1="119" y1="116" x2="121" y2="116" stroke="#1F1511" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="93" y1="115" x2="88" y2="119" stroke="#1F1511" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="147" y1="115" x2="152" y2="119" stroke="#1F1511" strokeWidth="3.5" strokeLinecap="round" />

        <ellipse cx="106" cy="120" rx="6.5" ry="7.5" fill="#2563EB" />
        <ellipse cx="106.5" cy="120" rx="3.5" ry="4.5" fill="#0F172A" />
        <circle cx="104" cy="116.5" r="2" fill="#FFFFFF" />
        <circle cx="108" cy="122" r="1" fill="#FFFFFF" />

        <ellipse cx="134" cy="120" rx="6.5" ry="7.5" fill="#2563EB" />
        <ellipse cx="134.5" cy="120" rx="3.5" ry="4.5" fill="#0F172A" />
        <circle cx="132" cy="116.5" r="2" fill="#FFFFFF" />
        <circle cx="136" cy="122" r="1" fill="#FFFFFF" />

        <path
          d="M94 100 C102 95 114 97 118 102"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M122 102 C126 97 138 95 146 100"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export default SohanIllustration;
