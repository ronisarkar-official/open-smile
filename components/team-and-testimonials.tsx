"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, User } from "lucide-react";

interface Team {
  id: string;
  name: string;
  subject: string;
  rating: string;
  reviewsCount: string;
  avatarBg: string;
  avatarIconColor: string;
  initials: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  avatarBg: string;
  initials: string;
}

const TeamData: Team[] = [
  {
    id: "1",
    name: "Ronald Richards",
    subject: "English",
    rating: "5.0",
    reviewsCount: "(175,00)",
    avatarBg: "bg-[#F7DEB4]",
    avatarIconColor: "text-[#B45309]",
    initials: "RR",
  },
  {
    id: "2",
    name: "Theresa Webb",
    subject: "Web Development",
    rating: "4.9",
    reviewsCount: "(176.89)",
    avatarBg: "bg-[#BAE6FD]",
    avatarIconColor: "text-[#0284C7]",
    initials: "TW",
  },
  {
    id: "3",
    name: "Leslie Alexander",
    subject: "Programming",
    rating: "4.8",
    reviewsCount: "(175.00)",
    avatarBg: "bg-[#FBCFE8]",
    avatarIconColor: "text-[#DB2777]",
    initials: "LA",
  },
  {
    id: "4",
    name: "Darrell Steward",
    subject: "Physics",
    rating: "5.0",
    reviewsCount: "(175.00)",
    avatarBg: "bg-[#FDE68A]",
    avatarIconColor: "text-[#D97706]",
    initials: "DS",
  },
];

const testimonialsData: Testimonial[] = [
  {
    id: "1",
    name: "Winchester Bain",
    role: "Academic Lecturer",
    rating: 5,
    quote:
      "Learning in this way is something that should have begun long ago. The concepts are nothing new because looking for micro interactions.",
    avatarBg: "bg-[#E2E8F0]",
    initials: "WB",
  },
  {
    id: "2",
    name: "Henrieta Sten",
    role: "Top Course Taker",
    rating: 5,
    quote:
      "This course was very interesting & thought provoking. I would definitely recommend for any teacher that is now trying to work with their students.",
    avatarBg: "bg-[#E2E8F0]",
    initials: "HS",
  },
];

function SparkleStar({ className = "size-9 text-neutral-900" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 4-point diamond star outline */}
      <path
        d="M18 4C18 11.5 24.5 18 32 18C24.5 18 18 24.5 18 32C18 24.5 11.5 18 4 18C11.5 18 18 11.5 18 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Radiating accent tick marks */}
      <line x1="18" y1="1" x2="18" y2="3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="32.5" y1="18" x2="35" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="18" y1="32.5" x2="18" y2="35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="1" y1="18" x2="3.5" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function TeamAndTestimonialsSection() {
  const [currentMentorPage, setCurrentMentorPage] = useState(0);
  const [currentTestimonialPage, setCurrentTestimonialPage] = useState(2);
  const totalTestimonialPages = 1200;

  const handlePrevMentor = () => {
    setCurrentMentorPage((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNextMentor = () => {
    setCurrentMentorPage((prev) => prev + 1);
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonialPage((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonialPage((prev) => (prev < totalTestimonialPages ? prev + 1 : prev));
  };

  return (
    <div className="w-full bg-[#FAF7F2] py-16 sm:py-20 lg:py-24 text-neutral-900 font-sans">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* MEET OUR MENTORS SECTION */}
        <section aria-labelledby="mentors-heading">
          <h2
            id="mentors-heading"
            className="text-center text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl"
          >
            Meet Our Team
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {TeamData.map((team) => (
              <div
                key={team.id}
                className="flex flex-col items-center justify-between rounded-[22px] border border-neutral-200/90 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
              >
                {/* Circular Avatar with matching backdrop */}
                <div
                  className={`relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full ${team.avatarBg} overflow-hidden`}
                >
                  <User className={`h-12 w-12 sm:h-14 sm:w-14 ${team.avatarIconColor}`} strokeWidth={1.75} />
                </div>

                {/* Mentor Info */}
                <div className="mt-4 text-center">
                  <h3 className="text-base font-bold text-neutral-900 sm:text-lg">{team.name}</h3>
                  <p className="mt-0.5 text-xs font-medium text-neutral-500 sm:text-sm">{team.subject}</p>
                </div>

                {/* Rating & Review Count */}
                <div className="mt-6 flex w-full items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-1 font-bold text-neutral-900">
                    <span>{team.rating}</span>
                    <Star className="h-3.5 w-3.5 fill-[#EAB308] text-[#EAB308]" />
                  </div>
                  <span className="font-medium text-neutral-400">{team.reviewsCount}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows below Mentors */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handlePrevMentor}
              aria-label="Previous mentors"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition hover:bg-neutral-800 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMentor}
              aria-label="Next mentors"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition hover:bg-neutral-800 active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section aria-labelledby="testimonials-heading" className="mt-16 sm:mt-20 lg:mt-24">
          <h2
            id="testimonials-heading"
            className="text-center text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl"
          >
            Testimonials
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {testimonialsData.map((testimonial) => (
              <div
                key={testimonial.id}
                className="relative flex flex-col sm:flex-row items-stretch rounded-[22px] border border-neutral-300/90 bg-[#FEE564] p-6 sm:p-7 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
              >
                {/* Left Side: Avatar, Sparkle, Author details */}
                <div className="flex flex-col justify-between sm:w-[42%] sm:shrink-0 pr-0 sm:pr-4 pb-4 sm:pb-0">
                  <div>
                    {/* Avatar + Sparkle icon top row */}
                    <div className="flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 border border-black/10 overflow-hidden text-neutral-800 shadow-sm">
                        <User className="h-7 w-7 text-neutral-800" strokeWidth={1.75} />
                      </div>
                      <SparkleStar className="h-8 w-8 text-neutral-900 mt-1 mr-2" />
                    </div>

                    {/* Name & Role */}
                    <div className="mt-3">
                      <h3 className="text-sm sm:text-base font-bold text-neutral-900 leading-tight">
                        {testimonial.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-neutral-700 font-medium">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Rating Stars: "5 ★★★★★" */}
                  <div className="mt-3 flex items-center gap-1">
                    <span className="text-xs font-black text-neutral-900">{testimonial.rating}</span>
                    <div className="flex items-center gap-0.5 text-neutral-800">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-transparent stroke-neutral-900 stroke-[1.75]"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden sm:block w-px bg-neutral-900/15 self-stretch my-1 mx-2" />
                <div className="block sm:hidden h-px w-full bg-neutral-900/15 my-3" />

                {/* Right Side: Quote */}
                <div className="flex items-center pl-0 sm:pl-4">
                  <p className="text-xs sm:text-sm leading-relaxed text-neutral-800 font-normal">
                    {testimonial.quote}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls below Testimonials */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handlePrevTestimonial}
              aria-label="Previous testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition hover:bg-neutral-800 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs sm:text-sm font-medium text-neutral-600 px-1">
              {currentTestimonialPage} of {totalTestimonialPages}
            </span>
            <button
              type="button"
              onClick={handleNextTestimonial}
              aria-label="Next testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition hover:bg-neutral-800 active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
