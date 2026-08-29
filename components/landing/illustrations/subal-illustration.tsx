import React from "react";
import { type IllustrationProps } from "./types";

export function SubalIllustration({ className = "h-full w-full object-contain", ...props }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 240 340"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Subal illustration"
      {...props}
    >
      <defs>
        <clipPath id="subal-clip">
          <rect width="240" height="340" />
        </clipPath>
      </defs>
      <g clipPath="url(#subal-clip)">
        {/* Normal Classic Hair - Back Base */}
        <path
          d="M84 106 C80 58 96 44 120 44 C144 44 160 58 156 106 C152 94 144 80 134 78 C120 76 110 78 102 82 C94 85 88 96 84 106 Z"
          fill="#261C14"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Neck */}
        <path
          d="M104 165 L104 212 Q120 218 136 212 L136 165 Z"
          fill="#FDE4D4"
          stroke="#1F1511"
          strokeWidth="3.5"
        />
        <path
          d="M105 170 Q120 184 135 170 L135 178 Q120 192 105 178 Z"
          fill="#E5B095"
        />

        {/* Hoodie / Shoulders */}
        <path
          d="M56 330 C60 245 78 215 106 208 L134 208 C162 215 180 245 184 330 Z"
          fill="#047857"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Hoodie Lapels */}
        <path
          d="M76 230 L106 208 L102 260 L80 250 Z"
          fill="#10B981"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M164 230 L134 208 L138 260 L160 250 Z"
          fill="#10B981"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Inner Dark T-shirt */}
        <path
          d="M104 210 L136 210 L140 330 L100 330 Z"
          fill="#0F172A"
          stroke="#1F1511"
          strokeWidth="3"
        />

        {/* AI & Model Graphic */}
        <g transform="translate(120, 260)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fill="#34D399"
            fontFamily="monospace"
            fontWeight="900"
            fontSize="13"
            letterSpacing="1"
          >
            &lt;AI /&gt;
          </text>
          <text
            x="0"
            y="14"
            textAnchor="middle"
            fill="#FBBF24"
            fontFamily="monospace"
            fontWeight="800"
            fontSize="9"
            letterSpacing="0.5"
          >
            MODEL
          </text>
        </g>

        {/* Hoodie Drawstrings */}
        <path d="M108 226 L104 272" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="104" cy="274" r="3" fill="#34D399" stroke="#1F1511" strokeWidth="1.5" />

        <path d="M132 226 L136 272" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="136" cy="274" r="3" fill="#34D399" stroke="#1F1511" strokeWidth="1.5" />

        {/* Badges */}
        <circle cx="164" cy="265" r="7" fill="#FBBF24" stroke="#1F1511" strokeWidth="2" />
        <path d="M164 260 L161 265 L164 265 L163 270 L167 264 L164 264 Z" fill="#1F1511" />

        <rect x="68" y="260" width="12" height="12" rx="3" fill="#10B981" stroke="#1F1511" strokeWidth="2" />
        <text x="74" y="269" textAnchor="middle" fill="#FFFFFF" fontFamily="monospace" fontSize="7" fontWeight="900">
          ML
        </text>

        {/* Head / Face Base */}
        <path
          d="M92 112 C90 74 102 64 120 64 C138 64 150 74 148 112 C148 148 142 178 120 178 C98 178 92 148 92 112 Z"
          fill="#FDE4D4"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Ears */}
        <path d="M88 122 C82 122 82 138 88 140" fill="#FDE4D4" stroke="#1F1511" strokeWidth="3" />
        <path d="M86 128 Q83 132 86 135" stroke="#1F1511" strokeWidth="2" strokeLinecap="round" fill="none" />

        <path d="M152 122 C158 122 158 138 152 140" fill="#FDE4D4" stroke="#1F1511" strokeWidth="3" />
        <path d="M154 128 Q157 132 154 135" stroke="#1F1511" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Normal Hair Front & Combed Texture */}
        <path
          d="M86 96 C88 72 102 62 122 62 C140 62 154 70 152 94 C144 86 134 82 120 84 C106 86 96 92 86 96 Z"
          fill="#3A281E"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M104 68 Q116 60 130 64" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M118 70 Q130 64 142 70" stroke="#5C4033" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M94 82 Q106 72 120 76" stroke="#1F1511" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Cheeks Warm Blush */}
        <ellipse cx="98" cy="136" rx="6" ry="3.5" fill="#FCA5A5" fillOpacity="0.6" />
        <ellipse cx="142" cy="136" rx="6" ry="3.5" fill="#FCA5A5" fillOpacity="0.6" />

        {/* Eyebrows */}
        <path
          d="M95 98 C103 94 113 96 116 100"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M124 100 C127 96 137 94 145 98"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Eyes (Emerald with Dual Glints) */}
        <ellipse
          cx="106"
          cy="115"
          rx="9"
          ry="12"
          fill="#FFFFFF"
          stroke="#1F1511"
          strokeWidth="3"
        />
        <ellipse cx="108" cy="115" rx="5.5" ry="6.5" fill="#10B981" />
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
        <ellipse cx="136" cy="115" rx="5.5" ry="6.5" fill="#10B981" />
        <ellipse cx="137" cy="115" rx="3" ry="4" fill="#0F172A" />
        <circle cx="134" cy="111" r="2" fill="#FFFFFF" />
        <circle cx="138" cy="117" r="1" fill="#FFFFFF" />

        {/* Nose */}
        <path
          d="M120 120 C123 127 120 133 116 131"
          stroke="#1F1511"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Bright Charming Smile */}
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

        {/* Smile Dimples */}
        <path d="M100 148 Q98 152 101 155" stroke="#1F1511" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M140 148 Q142 152 139 155" stroke="#1F1511" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Chin Indent */}
        <path d="M117 173 Q120 175 123 173" stroke="#E5B095" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export default SubalIllustration;
