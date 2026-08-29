"use client";

import React from "react";
import {
  SohanIllustration,
  AyushiIllustration,
  RoniIllustration,
  AkashIllustration,
  SubalIllustration,
} from "./illustrations";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bgColor: string;
  avatar: React.ReactNode;
}

export const defaultTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sohan",
    role: "Database",
    bgColor: "bg-[#F9D0A8]",
    avatar: <SohanIllustration />,
  },
  {
    id: "2",
    name: "Ayushi",
    role: "Cloud",
    bgColor: "bg-[#E5D4F8]",
    avatar: <AyushiIllustration />,
  },
  {
    id: "3",
    name: "Roni",
    role: "Frontend",
    bgColor: "bg-[#BEE4F8]",
    avatar: <RoniIllustration />,
  },
  {
    id: "4",
    name: "Akash",
    role: "Backend",
    bgColor: "bg-[#FEEAA2]",
    avatar: <AkashIllustration />,
  },
  {
    id: "5",
    name: "Subal",
    role: "AI/ML",
    bgColor: "bg-[#C6EED5]",
    avatar: <SubalIllustration />,
  },
];

export interface MyTeamProps {
  id?: string;
  title?: string;
  members?: TeamMember[];
  className?: string;
}

export function MyTeam({
  id = "team",
  title = "MEET THE TEAM",
  members = defaultTeamMembers,
  className = "",
}: MyTeamProps) {
  return (
    <section
      id={id}
      aria-label="Meet the team"
      className={`relative w-full overflow-hidden border-y-[length:var(--border-width)] border-black bg-[#F6CCD6] py-14 sm:py-18 lg:py-24 dark:bg-[#261E23] ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Dark Header Badge */}
        <div className="flex justify-center">
          <div className="shadow-brutal-md hover:shadow-brutal-lg inline-flex items-center justify-center border-[length:var(--border-width)] border-black rounded-xl bg-[#181829] px-7 py-3 transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 sm:px-12 sm:py-4 dark:border-white">
            <h2 className="font-display text-xl font-black tracking-wider text-white uppercase sm:text-2xl lg:text-3xl">
              {title}
            </h2>
          </div>
        </div>

        {/* 5 Cards Row */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-6 lg:gap-5 xl:gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="shadow-brutal-lg hover:shadow-brutal-xl group relative flex flex-col justify-between overflow-hidden border-[length:var(--border-width)] border-black rounded-2xl bg-card p-2.5 transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 dark:border-white dark:bg-card"
            >
              {/* Inner Pastel Character Box */}
              <div
                className={`relative flex h-[360px] w-full flex-col justify-end overflow-hidden border-[length:var(--border-width)] border-black rounded-xl ${member.bgColor} p-3 pt-6 transition-colors duration-200 sm:h-[400px] lg:h-[370px] xl:h-[410px] dark:border-black`}
              >
                {/* Character Illustration SVG */}
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  {member.avatar}
                </div>

                {/* Bottom Floating Badge */}
                <div className="shadow-brutal-sm relative z-10 w-full overflow-hidden border-[length:var(--border-width)] border-black rounded-lg bg-[#181829] text-center transition-transform duration-200 group-hover:scale-[1.02] dark:border-black">
                  {/* Name Section */}
                  <div className="px-3 py-1.5 sm:py-2">
                    <h3 className="font-sans text-base font-extrabold tracking-tight text-white sm:text-lg">
                      {member.name}
                    </h3>
                  </div>

                  {/* Role Section */}
                  <div className="border-t-[length:var(--border-width)] border-black bg-card px-3 py-1 dark:bg-white">
                    <p className="font-sans text-[11px] font-extrabold tracking-wider text-card-foreground uppercase sm:text-xs dark:text-black">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MyTeam;
