'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { FlowButton } from "@/components/ui/flow-button";
import { Logo } from "@/components/logo";

const easeCurve = [0.43, 0.13, 0.23, 0.96] as const;

const containerVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 30
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeCurve,
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeCurve
    }
  }
};

const numberVariants: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction * 40,
    y: 15,
    rotate: direction * 5
  }),
  visible: {
    opacity: 0.7,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: easeCurve
    }
  }
};

const ghostVariants: Variants = {
  hidden: { 
    scale: 0.8,
    opacity: 0,
    y: 15,
    rotate: -5
  },
  visible: { 
    scale: 1,
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: easeCurve
    }
  },
  hover: {
    scale: 1.1,
    y: -10,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut",
      rotate: {
        duration: 2,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  },
  floating: {
    y: [-5, 5],
    transition: {
      y: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  }
};

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 py-12">
      <AnimatePresence mode="wait">
        <motion.div 
          className="text-center flex flex-col items-center max-w-xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Website Logo */}
          <motion.div variants={itemVariants} className="mb-6">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <Logo className="h-8 w-auto" />
            </Link>
          </motion.div>

          <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-10">
            <motion.span 
              className="text-[80px] md:text-[120px] font-bold text-foreground/80 select-none tracking-tighter"
              variants={numberVariants}
              custom={-1}
            >
              4
            </motion.span>
            <motion.div
              variants={ghostVariants}
              whileHover="hover"
              animate={["visible", "floating"]}
            >
              <Image
                src="https://xubohuah.github.io/xubohua.top/Group.png"
                alt="Ghost"
                width={120}
                height={120}
                className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] object-contain select-none border-none outline-none ring-0 shadow-none mix-blend-multiply dark:mix-blend-normal dark:brightness-125"
                draggable="false"
                priority
              />
            </motion.div>
            <motion.span 
              className="text-[80px] md:text-[120px] font-bold text-foreground/80 select-none tracking-tighter"
              variants={numberVariants}
              custom={1}
            >
              4
            </motion.span>
          </div>
          
          <motion.h1 
            className="text-3xl md:text-5xl font-bold text-foreground mb-4 md:mb-6 select-none tracking-tight"
            variants={itemVariants}
          >
            Boo! Page missing!
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-10 select-none max-w-md leading-relaxed"
            variants={itemVariants}
          >
            Whoops! This page must be a ghost &mdash; it&apos;s not here!
          </motion.p>

          <motion.div 
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              transition: {
                duration: 0.3,
                ease: easeCurve
              }
            }}
            className="flex justify-center"
          >
            <Link href="/">
              <FlowButton text="Find shelter" />
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default NotFound;
