import React, { useState, useRef, useEffect } from 'react';
import { Opportunity } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  opportunities: Opportunity[];
  renderCard: (opportunity: Opportunity, index: number) => React.ReactNode;
}

export const SwipeableOpportunityCards: React.FC<Props> = ({ opportunities, renderCard }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in pixels) to trigger navigation
  const MIN_SWIPE_DISTANCE = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;

    // Apply resistance at boundaries
    let offset = diff;
    if (currentIndex === 0 && diff > 0) {
      offset = diff * 0.3; // Resistance when swiping right on first card
    } else if (currentIndex === opportunities.length - 1 && diff < 0) {
      offset = diff * 0.3; // Resistance when swiping left on last card
    }

    setDragOffset(offset);
    setTouchEnd(currentTouch);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;

    if (isLeftSwipe && currentIndex < opportunities.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const goToNext = () => {
    if (currentIndex < opportunities.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goToCard = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative">
      {/* Swipe Hint (shows prominently above cards) */}
      {opportunities.length > 1 && (
        <div className="lg:hidden mb-4 sm:mb-8 text-center animate-in fade-in slide-in-from-top-2 duration-500 delay-300 px-2">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 px-3 sm:px-6 py-2 sm:py-3 rounded-full bg-violet-600/20 border border-violet-500/30 shadow-lg shadow-violet-500/10">
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-violet-300 animate-pulse flex-shrink-0" />
            <span className="text-[10px] sm:text-sm font-black text-violet-200 uppercase tracking-wider sm:tracking-widest">
              Swipe for more
            </span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-violet-300 animate-pulse flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Progress Indicators */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 px-1 sm:px-2">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider sm:tracking-widest">
            Signal {currentIndex + 1} of {opportunities.length}
          </span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          {opportunities.map((_, index) => (
            <button
              key={index}
              onClick={() => goToCard(index)}
              className={`h-1 sm:h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-5 sm:w-8 bg-violet-500'
                  : 'w-1 sm:w-1.5 bg-slate-700 hover:bg-slate-600'
              }`}
              aria-label={`Go to opportunity ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Swipeable Card Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform"
          style={{
            transform: isDragging
              ? `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`
              : `translateX(-${currentIndex * 100}%)`,
            transitionDuration: isDragging ? '0ms' : '300ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {opportunities.map((opportunity, index) => (
            <div
              key={opportunity.id}
              className="w-full flex-shrink-0"
              style={{ minWidth: '100%' }}
            >
              {renderCard(opportunity, index)}
            </div>
          ))}
        </div>

        {/* Drag Indicator */}
        {isDragging && Math.abs(dragOffset) > 20 && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div
              className={`w-16 h-16 rounded-full backdrop-blur-xl flex items-center justify-center border-2 transition-all ${
                dragOffset > 0
                  ? 'bg-violet-600/20 border-violet-500/50'
                  : 'bg-indigo-600/20 border-indigo-500/50'
              }`}
            >
              {dragOffset > 0 ? (
                <ChevronLeft className="w-8 h-8 text-white" />
              ) : (
                <ChevronRight className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Navigation Buttons (hidden on mobile) */}
      <div className="hidden lg:flex items-center justify-center space-x-4 mt-6">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10 hover:border-violet-500/30"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <span className="text-sm font-bold text-slate-400">
          {currentIndex + 1} / {opportunities.length}
        </span>
        <button
          onClick={goToNext}
          disabled={currentIndex === opportunities.length - 1}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10 hover:border-violet-500/30"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};
