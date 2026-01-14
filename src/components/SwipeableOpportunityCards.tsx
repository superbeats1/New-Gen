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

  // Hide hint after interaction
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (currentIndex > 0) setHasInteracted(true);
  }, [currentIndex]);

  const handleInteraction = () => {
    if (!hasInteracted) setHasInteracted(true);
  };

  const internalHandleTouchStart = (e: React.TouchEvent) => {
    handleInteraction();
    handleTouchStart(e);
  };

  return (
    <div className="relative group">
      {/* Swipe Hint (shows prominently above cards, fades out after interaction) */}
      {opportunities.length > 1 && !hasInteracted && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 px-6 py-4 rounded-3xl shadow-2xl">
            <div className="flex items-center space-x-4 mb-2">
              <ChevronLeft className="w-5 h-5 text-violet-400 animate-pulse" />
              <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border border-violet-500/50 animate-ping"></div>
                <div className="w-2 h-2 rounded-full bg-violet-400"></div>
              </div>
              <ChevronRight className="w-5 h-5 text-violet-400 animate-pulse" />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Swipe to Explore</span>
          </div>
        </div>
      )}

      {/* Progress Indicators */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
            Signal {currentIndex + 1} / {opportunities.length}
          </span>
        </div>
        <div className="flex items-center space-x-1.5">
          {opportunities.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                handleInteraction();
                goToCard(index);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'w-8 bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                  : 'w-1.5 bg-white/10 hover:bg-white/20'
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
        onTouchStart={internalHandleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform"
          style={{
            transform: isDragging
              ? `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`
              : `translateX(-${currentIndex * 100}%)`,
            transitionDuration: isDragging ? '0ms' : '500ms',
            transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)', // Smooth spring-like ease
          }}
        >
          {opportunities.map((opportunity, index) => (
            <div
              key={opportunity.id}
              className="w-full flex-shrink-0 px-1" // Added slight px to separate cards visually during swipe if peeking (though full width mainly)
              style={{ minWidth: '100%' }}
            >
              <div className={`transition-all duration-500 ${index === currentIndex ? 'scale-100 opacity-100 blur-0' : 'scale-[0.98] opacity-50 blur-sm'}`}>
                {renderCard(opportunity, index)}
              </div>
            </div>
          ))}
        </div>

        {/* Drag Indicator */}
        {isDragging && Math.abs(dragOffset) > 20 && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
            <div
              className={`w-20 h-20 rounded-full backdrop-blur-xl flex items-center justify-center border-2 transition-all shadow-2xl ${dragOffset > 0
                  ? 'bg-violet-600/20 border-violet-500/50 scale-110'
                  : 'bg-indigo-600/20 border-indigo-500/50 scale-110'
                }`}
            >
              {dragOffset > 0 ? (
                <ChevronLeft className="w-10 h-10 text-white" />
              ) : (
                <ChevronRight className="w-10 h-10 text-white" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Buttons */}
      {opportunities.length > 1 && (
        <div className="lg:hidden flex items-center justify-center space-x-4 mt-6">
          <button
            onClick={() => { handleInteraction(); goToPrevious(); }}
            disabled={currentIndex === 0}
            className="w-12 h-12 rounded-full bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10 active:scale-95 flex items-center justify-center hover:bg-white/10 hover:border-violet-500/30"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Scan {currentIndex + 1} / {opportunities.length}
          </span>

          <button
            onClick={() => { handleInteraction(); goToNext(); }}
            disabled={currentIndex === opportunities.length - 1}
            className="w-12 h-12 rounded-full bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10 active:scale-95 flex items-center justify-center hover:bg-white/10 hover:border-violet-500/30"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Desktop Navigation Buttons (hidden on mobile) */}
      <div className="hidden lg:flex items-center justify-center space-x-4 mt-6">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10 hover:border-violet-500/30 group"
        >
          <ChevronLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <span className="text-sm font-bold text-slate-400">
          {currentIndex + 1} / {opportunities.length}
        </span>
        <button
          onClick={goToNext}
          disabled={currentIndex === opportunities.length - 1}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10 hover:border-violet-500/30 group"
        >
          <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
