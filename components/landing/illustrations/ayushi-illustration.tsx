import React from "react";
import { type IllustrationProps } from "./types";

export function AyushiIllustration({ className = "h-full w-full object-contain", ...props }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 240 340"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Ayushi illustration"
      {...props}
    >
      <defs>
        <clipPath id="ayushi-clip">
          <rect width="240" height="340" />
        </clipPath>
      </defs>
      <g clipPath="url(#ayushi-clip)">
        {/* Back Long Hair (Smooth elegant long hair flowing down behind shoulders) */}
        <path
          d="M74 68 C58 95 54 150 56 220 C58 265 62 300 68 335 L172 335 C178 300 182 265 184 220 C186 150 182 95 166 68 C152 48 136 46 120 46 C104 46 88 48 74 68 Z"
          fill="#8E381A"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Back Hair Texture Strands */}
        <path d="M68 180 Q64 250 72 320" stroke="#752C12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M172 180 Q176 250 168 320" stroke="#752C12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M80 200 Q76 260 82 330" stroke="#752C12" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M160 200 Q164 260 158 330" stroke="#752C12" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Neck */}
        <path
          d="M107 172 L107 205 Q120 209 133 205 L133 172 Z"
          fill="#F5C4A8"
          stroke="#1F1511"
          strokeWidth="3"
        />
        {/* Chin Shadow on Neck */}
        <path
          d="M107 185 Q120 195 133 185 L133 191 Q120 201 107 191 Z"
          fill="#E5B095"
        />

        {/* Shoulders & Striped Top Base */}
        <path
          d="M56 330 C58 245 76 210 104 200 L136 200 C164 210 182 245 184 330 Z"
          fill="#FFFFFF"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner Shirt Collar Line */}
        <path d="M104 200 Q120 207 136 200" stroke="#1F1511" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Shirt Stripes on Sleeves */}
        <path
          d="M62 250 L86 242 L87 250 L60 258 Z"
          fill="#0284C7"
          stroke="#1F1511"
          strokeWidth="1.5"
        />
        <path
          d="M59 272 L88 264 L89 272 L58 280 Z"
          fill="#0284C7"
          stroke="#1F1511"
          strokeWidth="1.5"
        />
        <path
          d="M57 294 L90 286 L91 294 L56 302 Z"
          fill="#0284C7"
          stroke="#1F1511"
          strokeWidth="1.5"
        />

        <path
          d="M178 250 L154 242 L153 250 L180 258 Z"
          fill="#0284C7"
          stroke="#1F1511"
          strokeWidth="1.5"
        />
        <path
          d="M181 272 L152 264 L151 272 L182 280 Z"
          fill="#0284C7"
          stroke="#1F1511"
          strokeWidth="1.5"
        />
        <path
          d="M183 294 L150 286 L149 294 L184 302 Z"
          fill="#0284C7"
          stroke="#1F1511"
          strokeWidth="1.5"
        />

        {/* Pinafore Dress Straps */}
        <path
          d="M86 206 L90 330 L106 330 L102 206 Z"
          fill="#1E293B"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M154 206 L150 330 L134 330 L138 206 Z"
          fill="#1E293B"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Pinafore Bib Center */}
        <path
          d="M92 248 L148 248 L150 330 L90 330 Z"
          fill="#1E293B"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Strap Buckles */}
        <rect x="87" y="242" width="17" height="8" rx="2" fill="#CBD5E1" stroke="#1F1511" strokeWidth="2" />
        <circle cx="95.5" cy="246" r="1.8" fill="#1F1511" />
        <rect x="136" y="242" width="17" height="8" rx="2" fill="#CBD5E1" stroke="#1F1511" strokeWidth="2" />
        <circle cx="144.5" cy="246" r="1.8" fill="#1F1511" />

        {/* Bib Pocket */}
        <path
          d="M104 268 L136 268 L133 298 L107 298 Z"
          fill="#334155"
          stroke="#1F1511"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Cloud Badge on Pocket */}
        <g transform="translate(120, 278)">
          <path
            d="M-8 3 C-11 3 -13 1 -13 -1.5 C-13 -3.5 -11 -5 -8.5 -5 C-8 -7 -6 -8.5 -3.5 -8.5 C-1.5 -8.5 0.5 -7.5 1.5 -6 C2.5 -7 4 -7.5 6 -6.5 C8 -5.5 8.5 -4 8 -2.5 C10 -2.5 12 -1 12 1.5 C12 3.5 10.5 5 8 5 L-8 5 Z"
            fill="#38BDF8"
            stroke="#1F1511"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
        <text
          x="120"
          y="293"
          textAnchor="middle"
          fill="#94A3B8"
          fontFamily="monospace"
          fontWeight="900"
          fontSize="6.5"
        >
          CLOUD
        </text>

        {/* Head / Face */}
        <path
          d="M90 120 C85 85 100 65 120 65 C145 65 155 85 150 120 C148 155 138 190 120 190 C102 190 92 155 90 120 Z"
          fill="#FDE4D4"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Ears */}
        <path
          d="M89 135 C83 135 83 150 89 152"
          fill="#FDE4D4"
          stroke="#1F1511"
          strokeWidth="3.5"
        />
        <path
          d="M151 135 C157 135 157 150 151 152"
          fill="#FDE4D4"
          stroke="#1F1511"
          strokeWidth="3.5"
        />

        {/* Freckles */}
        <circle cx="100" cy="152" r="1.5" fill="#C77852" />
        <circle cx="105" cy="156" r="1.5" fill="#C77852" />
        <circle cx="108" cy="150" r="1.5" fill="#C77852" />
        <circle cx="132" cy="150" r="1.5" fill="#C77852" />
        <circle cx="135" cy="156" r="1.5" fill="#C77852" />
        <circle cx="140" cy="152" r="1.5" fill="#C77852" />

        {/* Eyes */}
        {/* Left Eye */}
        <ellipse
          cx="108"
          cy="128"
          rx="12"
          ry="15"
          fill="#FFFFFF"
          stroke="#1F1511"
          strokeWidth="3"
        />
        <ellipse cx="110" cy="128" rx="7" ry="8" fill="#75B6D4" />
        <ellipse cx="111" cy="128" rx="4.5" ry="5.5" fill="#182026" />
        <circle cx="108" cy="123" r="2.5" fill="#FFFFFF" />

        {/* Right Eye */}
        <ellipse
          cx="136"
          cy="126"
          rx="12"
          ry="15"
          fill="#FFFFFF"
          stroke="#1F1511"
          strokeWidth="3"
        />
        <ellipse cx="138" cy="126" rx="7" ry="8" fill="#75B6D4" />
        <ellipse cx="139" cy="126" rx="4.5" ry="5.5" fill="#182026" />
        <circle cx="136" cy="121" r="2.5" fill="#FFFFFF" />

        {/* Eyebrows */}
        <path
          d="M98 108 C105 104 116 107 119 111"
          stroke="#1F1511"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M129 107 C133 103 144 104 148 108"
          stroke="#1F1511"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Nose */}
        <path
          d="M121 136 C124 141 121 146 117 146"
          stroke="#1F1511"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Big Grin with Teeth */}
        <path
          d="M106 160 Q121 160 137 158 Q140 172 121 174 Q103 172 106 160 Z"
          fill="#FFFFFF"
          stroke="#1F1511"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Teeth separator lines */}
        <line x1="114" y1="160" x2="114" y2="173" stroke="#1F1511" strokeWidth="1.8" />
        <line x1="122" y1="160" x2="122" y2="174" stroke="#1F1511" strokeWidth="1.8" />
        <line x1="130" y1="159" x2="130" y2="173" stroke="#1F1511" strokeWidth="1.8" />

        {/* Front Hair (Sleek, beautiful crown + side-swept bangs & framing locks) */}
        {/* Crown Base */}
        <path
          d="M84 102 C80 62 98 48 120 48 C142 48 160 62 156 102 C152 92 144 82 132 80 C118 78 110 82 100 86 C92 90 88 96 84 102 Z"
          fill="#B84B1F"
          stroke="#1F1511"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Side-swept Front Bangs */}
        <path
          d="M86 92 C92 70 108 60 126 62 C140 64 150 74 148 88 C140 82 130 80 118 84 C104 88 94 92 86 92 Z"
          fill="#D15F28"
          stroke="#1F1511"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />

        {/* Hair Sheen Highlights */}
        <path d="M100 60 Q116 50 134 54" stroke="#FFA478" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M96 72 Q106 62 118 66" stroke="#FFA478" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Left Side Framing Strand (Sleek & tapered down past cheek) */}
        <path
          d="M85 96 C80 115 78 140 82 175 C85 188 90 188 89 175 C87 145 87 120 90 100 Z"
          fill="#B84B1F"
          stroke="#1F1511"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path d="M82 120 Q80 145 84 170" stroke="#752C12" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Right Side Framing Strand (Sleek & tapered down past cheek) */}
        <path
          d="M155 96 C160 115 162 140 158 175 C155 188 150 188 151 175 C153 145 153 120 150 100 Z"
          fill="#B84B1F"
          stroke="#1F1511"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path d="M158 120 Q160 145 156 170" stroke="#752C12" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export default AyushiIllustration;


