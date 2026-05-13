"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    tempId: 0,
    testimonial: "The most serene experience on the Ganges. The attention to detail is unmatched.",
    by: "Alex, Luxury Travel Blogger",
    imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    tempId: 1,
    testimonial: "Varanasi from the river at dawn is something I'll never forget. Highly recommend the cinematic cruise.",
    by: "Dan, Professional Photographer",
    imgSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    tempId: 2,
    testimonial: "Quiet luxury at its finest. The heritage suites are breathtaking.",
    by: "Stephanie, Interior Designer",
    imgSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    tempId: 3,
    testimonial: "An absolute masterclass in hospitality. The GangaCruise team knows how to pamper their guests.",
    by: "Marie, Concierge Specialist",
    imgSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    tempId: 4,
    testimonial: "If you're visiting Varanasi, this is the only way to truly experience the spiritual essence of the river.",
    by: "Andre, Cultural Historian",
    imgSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    tempId: 5,
    testimonial: "The food, the music, and the view—everything was perfect. A spiritual journey in total comfort.",
    by: "Jeremy, Executive Chef",
    imgSrc: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    tempId: 6,
    testimonial: "Transcendent. The evening Aarti from the deck was a life-changing experience.",
    by: "Pam, Yoga & Wellness Coach",
    imgSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    tempId: 7,
    testimonial: "The level of privacy and exclusivity is what sets GangaCruise apart from any other service.",
    by: "Daniel, Luxury Advisor",
    imgSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&auto=format&fit=crop"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border p-10 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
        "hover:z-[100] hover:scale-[1.18] hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.4)]",
        isCenter 
          ? "z-20 bg-[#1c1917] text-white border-white/10 shadow-[0_45px_100px_-20px_rgba(0,0,0,0.6)] opacity-100" 
          : "z-10 bg-white text-stone-900 border-stone-200 shadow-[0_15px_45px_-10px_rgba(0,0,0,0.12)] scale-90 opacity-95"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(0% 0%, 85% 0%, 100% 15%, 100% 100%, 0% 100%)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize * 0.58) * position}px)
          translateY(${isCenter ? -80 : position % 2 ? -35 : -65}px)
          rotate(${isCenter ? 0 : position * 3}deg)
        `,
      }}
    >
      <div className={cn(
        "relative mb-8 h-14 w-12 transition-all duration-700 overflow-hidden rounded-lg",
        isCenter ? "grayscale-0" : "grayscale opacity-90"
      )}>
        <Image
          src={testimonial.imgSrc}
          alt={testimonial.by}
          fill
          className="object-cover object-top"
          style={{
            boxShadow: isCenter ? "6px 6px 0px rgba(255,255,255,0.08)" : "6px 6px 0px rgba(0,0,0,0.04)"
          }}
        />
      </div>
      <h3 className={cn(
        "text-xl sm:text-2xl font-medium leading-[1.4] tracking-tight",
        isCenter ? "text-white" : "text-stone-800"
      )}>
        &quot;{testimonial.testimonial}&quot;
      </h3>
      <p className={cn(
        "absolute bottom-12 left-12 right-12 mt-6 text-[0.68rem] font-bold uppercase tracking-[0.22em]",
        isCenter ? "text-stone-400" : "text-stone-500"
      )}>
        — {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(420);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 420 : 320);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 620 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = index - Math.floor(testimonialsList.length / 2);
        
        // Show 5 cards for a richer look
        if (Math.abs(position) > 2) return null;

        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      
      {/* Navigation Buttons */}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-4">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "group flex h-16 w-16 items-center justify-center border border-stone-200 bg-white transition-all duration-500 shadow-sm",
            "hover:bg-cyan-600 hover:border-cyan-600 hover:text-white",
            "active:scale-90"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "group flex h-16 w-16 items-center justify-center border border-stone-200 bg-white transition-all duration-500 shadow-sm",
            "hover:bg-cyan-600 hover:border-cyan-600 hover:text-white",
            "active:scale-90"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
