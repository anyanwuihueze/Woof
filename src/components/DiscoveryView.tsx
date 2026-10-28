import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  X, 
  Info, 
  Sparkles, 
  SlidersHorizontal, 
  MapPin, 
  ShieldCheck, 
  Activity, 
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Dog, FilterPreferences, Match } from '../types';
import { storageService } from '../services/storageService';

interface DiscoveryViewProps {
  activeDog: Dog;
  onOpenDogDetail: (dog: Dog) => void;
  onMatchCreated: (match: Match) => void;
  onOpenFilters: () => void;
  filterPreferences: FilterPreferences;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  activeDog,
  onOpenDogDetail,
  onMatchCreated,
  onOpenFilters,
  filterPreferences,
}) => {
  const [candidates, setCandidates] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Drag & Exit Physics State
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exitAnimation, setExitAnimation] = useState<{
    direction: 'left' | 'right';
  } | null>(null);

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const loadCandidates = () => {
    setLoading(true);
    const dogs = storageService.getDiscoveryCandidates(filterPreferences);
    setCandidates(dogs);
    setActivePhotoIndex(0);
    setDragOffset({ x: 0, y: 0 });
    setExitAnimation(null);
    setLoading(false);
  };

  useEffect(() => {
    loadCandidates();
  }, [filterPreferences, activeDog.id]);

  const currentDog = candidates[0];

  // Fluid swipe handler with physics-based fling trajectory
  const handleSwipe = (action: 'like' | 'pass') => {
    if (!currentDog || exitAnimation) return;

    setIsDragging(false);
    setExitAnimation({ direction: action === 'like' ? 'right' : 'left' });

    // Allow the card to fling completely off-screen before committing candidate slice
    setTimeout(() => {
      const result = storageService.recordSwipe(currentDog, action);

      if (action === 'like' && result.isMatch && result.match) {
        onMatchCreated(result.match);
      }

      setCandidates(prev => prev.slice(1));
      setExitAnimation(null);
      setDragOffset({ x: 0, y: 0 });
      setActivePhotoIndex(0);
    }, 300);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (candidates.length === 0 || exitAnimation) return;

      if (e.key === 'ArrowLeft') {
        handleSwipe('pass');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('like');
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        onOpenDogDetail(candidates[0]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [candidates, exitAnimation]);

  // Touch and pointer drag handling with Pointer Capture
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (exitAnimation || !currentDog) return;

    // Ignore drags that originate from buttons, links, or specific controls
    if ((e.target as HTMLElement).closest('button, a, [data-interactive="true"]')) {
      return;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Graceful fallback for environments where pointer capture isn't supported
    }

    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || exitAnimation) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    // Swipe commit threshold: 85px
    if (dragOffset.x > 85) {
      handleSwipe('like');
    } else if (dragOffset.x < -85) {
      handleSwipe('pass');
    } else {
      // Smooth spring back to center
      setDragOffset({ x: 0, y: 0 });
    }
    dragStartRef.current = null;
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
    setDragOffset({ x: 0, y: 0 });
    dragStartRef.current = null;
  };

  const handleResetSwipes = () => {
    localStorage.removeItem('pawmatch_passes');
    loadCandidates();
  };

  // Stack depth interpolation values
  const dragRatio = Math.min(1, Math.abs(dragOffset.x) / 160);
  const effectiveRatio = exitAnimation ? 1 : (isDragging ? dragRatio : 0);
  const backgroundScale = 0.94 + (effectiveRatio * 0.06);
  const backgroundOpacity = 0.55 + (effectiveRatio * 0.45);
  const backgroundTranslateY = (1 - effectiveRatio) * -8;
  const backgroundBlur = (1 - effectiveRatio) * 3;

  // Active card transform calculation
  const getCardTransform = () => {
    if (exitAnimation) {
      const exitDistance = typeof window !== 'undefined' ? window.innerWidth * 1.35 : 650;
      const targetX = exitAnimation.direction === 'right' ? exitDistance : -exitDistance;
      const targetRotate = exitAnimation.direction === 'right' ? 24 : -24;
      return `translate3d(${targetX}px, ${dragOffset.y * 0.4}px, 0) rotate(${targetRotate}deg)`;
    }
    return `translate3d(${dragOffset.x}px, ${dragOffset.y * 0.35}px, 0) rotate(${dragOffset.x * 0.05}deg)`;
  };

  const getCardTransition = () => {
    if (isDragging) return 'none';
    if (exitAnimation) return 'transform 0.30s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.25s ease-in';
    return 'transform 0.35s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.2s ease-out';
  };

  // Stamp opacity calculation
  const likeStampOpacity = exitAnimation?.direction === 'right' 
    ? 1 
    : Math.min(1, Math.max(0, (dragOffset.x - 25) / 60));
  const passStampOpacity = exitAnimation?.direction === 'left' 
    ? 1 
    : Math.min(1, Math.max(0, (-dragOffset.x - 25) / 60));

  return (
    <div className="max-w-md mx-auto px-4 py-4 md:py-6 flex flex-col items-center">
      
      {/* Top Controls Bar: Active Dog Context & Filter Trigger */}
      <div className="w-full flex items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2 text-xs text-[#536B60] bg-white border border-[#E8F0E9] px-3.5 py-1.5 rounded-full shadow-2xs">
          <span className="font-semibold text-[#194B38]">Swiping for:</span>
          <span className="font-bold text-[#24352D]">{activeDog.name}</span>
          <span className="text-[#D1E0D3]">·</span>
          <span className="capitalize">{activeDog.primaryPurpose}</span>
        </div>

        <button
          onClick={onOpenFilters}
          className="min-h-[40px] px-3.5 py-1.5 bg-white border border-[#E8F0E9] hover:border-[#194B38] rounded-full text-xs font-semibold text-[#194B38] flex items-center gap-2 shadow-2xs cursor-pointer transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {filterPreferences.purpose !== 'all' || filterPreferences.breedSearch ? (
            <span className="w-2 h-2 rounded-full bg-[#E98779]"></span>
          ) : null}
        </button>
      </div>

      {/* Discovery Card Stack Area */}
      {loading ? (
        <div className="w-full h-[520px] rounded-3xl bg-white border border-[#E8F0E9] flex flex-col items-center justify-center p-8 space-y-4 shadow-sm animate-pulse">
          <div className="w-16 h-16 rounded-full bg-[#E8F0E9] flex items-center justify-center text-[#194B38]">
            <Heart className="w-8 h-8 animate-bounce" />
          </div>
          <p className="text-sm font-semibold text-[#194B38]">Finding compatible dogs nearby...</p>
        </div>
      ) : candidates.length === 0 ? (
        /* Empty State */
        <div className="w-full h-[520px] rounded-3xl bg-white border border-[#E8F0E9] flex flex-col items-center justify-center p-8 text-center space-y-5 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-[#FAF7F0] flex items-center justify-center text-[#194B38]">
            <Sparkles className="w-10 h-10 text-[#E98779]" />
          </div>
          <div className="space-y-2 max-w-sm">
            <h3 className="font-serif text-2xl font-bold text-[#194B38]">You're all caught up!</h3>
            <p className="text-xs text-[#536B60] leading-relaxed">
              No more dogs match your current filters in {activeDog.location.city}. Broaden your search distance or reset passed profiles to explore again.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onOpenFilters}
              className="px-5 py-2.5 bg-[#194B38] text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-[#133A2B] transition-colors cursor-pointer"
            >
              Adjust Discovery Filters
            </button>
            <button
              onClick={handleResetSwipes}
              className="px-5 py-2.5 bg-white border border-[#D1E0D3] text-[#194B38] rounded-xl text-xs font-semibold hover:bg-[#FAF7F0] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Review Passed Profiles</span>
            </button>
          </div>
        </div>
      ) : (
        /* Full-Bleed Photographic Discovery Card Stack */
        <div className="relative w-full select-none touch-none h-[520px] sm:h-[560px]">
          
          {/* Reactive Next Card in Background */}
          {candidates[1] && (
            <div 
              style={{
                transform: `translate3d(0, ${backgroundTranslateY}px, 0) scale(${backgroundScale})`,
                opacity: backgroundOpacity,
                filter: `blur(${backgroundBlur}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out, filter 0.3s ease-out',
              }}
              className="absolute inset-0 bg-[#24352D] rounded-3xl border border-[#E8F0E9] shadow-md pointer-events-none overflow-hidden will-change-transform"
            >
              <img
                src={candidates[1].photos[0]}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24352D]/90 via-[#24352D]/30 to-transparent"></div>
              
              {/* Peek preview info on background card */}
              <div className="absolute bottom-5 left-5 right-5 text-white/80 flex items-baseline justify-between">
                <div>
                  <span className="font-serif text-2xl font-bold">{candidates[1].name}</span>
                  <span className="ml-2 text-sm">{candidates[1].breed}</span>
                </div>
              </div>
            </div>
          )}

          {/* Foreground Interactive Card (Dedicated Key prevents image swapping desync) */}
          <div
            key={currentDog.id}
            ref={cardRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            style={{
              transform: getCardTransform(),
              transition: getCardTransition(),
              opacity: exitAnimation ? 0 : 1,
            }}
            className="absolute inset-0 w-full h-full rounded-3xl border border-[#E8F0E9] shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing bg-[#24352D] will-change-transform z-10"
          >
            {/* Visual LIKE / PASS Reactive Stamps */}
            <div 
              style={{ opacity: likeStampOpacity }}
              className="absolute top-6 left-6 z-30 px-4 py-2 border-3 border-[#194B38] text-[#194B38] font-serif font-black text-xl rounded-2xl transform -rotate-12 bg-white/95 backdrop-blur-md shadow-lg pointer-events-none transition-opacity"
            >
              LIKE 🎾
            </div>

            <div 
              style={{ opacity: passStampOpacity }}
              className="absolute top-6 right-6 z-30 px-4 py-2 border-3 border-[#E98779] text-[#E98779] font-serif font-black text-xl rounded-2xl transform rotate-12 bg-white/95 backdrop-blur-md shadow-lg pointer-events-none transition-opacity"
            >
              PASS
            </div>

            {/* Edge-to-Edge Full-Bleed Image (Keyed to prevent mid-exit replacement) */}
            <img
              key={`${currentDog.id}-${activePhotoIndex}`}
              src={currentDog.photos[activePhotoIndex] || currentDog.photos[0]}
              alt={currentDog.name}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              referrerPolicy="no-referrer"
            />

            {/* Scrim Overlay Ensuring Readable Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#24352D]/95 via-[#24352D]/40 via-60% to-transparent pointer-events-none"></div>

            {/* Photo Dots Bar */}
            {currentDog.photos.length > 1 && (
              <div className="absolute top-3.5 inset-x-4 flex gap-1.5 z-20 pointer-events-none">
                {currentDog.photos.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      idx === activePhotoIndex ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Tap Left / Right Photo Arrows (Stops pointer event propagation) */}
            {currentDog.photos.length > 1 && (
              <>
                <button
                  type="button"
                  data-interactive="true"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIndex(prev => Math.max(0, prev - 1));
                  }}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  data-interactive="true"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIndex(prev => Math.min(currentDog.photos.length - 1, prev + 1));
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Top Badges Floating Over Image */}
            <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
              <span className="text-[11px] font-semibold px-3 py-1 bg-white/95 backdrop-blur-md text-[#194B38] rounded-full shadow-2xs">
                {currentDog.primaryPurpose === 'playdates' ? '🎾 Seeking Playdates' : 
                 currentDog.primaryPurpose === 'socialization' ? '🌱 Puppy Socialization' : '🧬 Responsible Breeding'}
              </span>
              
              <span className="text-[11px] font-medium px-2.5 py-1 bg-black/45 backdrop-blur-md text-white rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#E98779]" />
                <span>~{currentDog.location.approximateDistanceKm} km · {currentDog.location.area}</span>
              </span>
            </div>

            {/* Bottom Content Scrim & Details */}
            <div className="absolute bottom-4 left-4 right-4 text-white z-20 space-y-2 pointer-events-none">
              
              {/* Dog Headline & Info Trigger */}
              <div className="flex items-baseline justify-between pointer-events-auto">
                <div className="flex items-baseline gap-2">
                  <h2 className="font-serif text-3xl font-bold tracking-tight text-white">{currentDog.name}</h2>
                  <span className="text-xl font-light text-white/90">
                    {currentDog.ageYears}y {currentDog.ageMonths > 0 ? `${currentDog.ageMonths}m` : ''}
                  </span>
                </div>

                <button
                  type="button"
                  data-interactive="true"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDogDetail(currentDog);
                  }}
                  className="w-9 h-9 rounded-full bg-white/25 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center cursor-pointer transition-colors"
                  title="View Full Profile Details"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>

              {/* Unboxed Metadata Line with Interpuncts */}
              <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium">
                <span>{currentDog.breed}</span>
                <span aria-hidden="true">·</span>
                <span>{currentDog.size}</span>
                <span aria-hidden="true">·</span>
                <span>{currentDog.weightKg} kg</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{currentDog.sex}</span>
              </div>

              {/* Personality Traits Badges */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {currentDog.temperament.slice(0, 3).map((trait, idx) => (
                  <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-white/20 backdrop-blur-md text-white font-medium">
                    {trait}
                  </span>
                ))}
                <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-[#E8F0E9] text-[#194B38] font-bold">
                  ⚡ {currentDog.energyLevel} Energy
                </span>
              </div>

              {/* Short Bio */}
              <p className="text-xs text-white/80 line-clamp-2 leading-relaxed pt-0.5">
                {currentDog.bio}
              </p>

              {/* Health Transparency Status Strip */}
              <div className="pt-1.5 flex items-center justify-between text-[11px] text-white/85 border-t border-white/15">
                {currentDog.vaccinationStatus === 'verified_by_vet' ? (
                  <span className="text-[#A7F3D0] flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Clinic-Audited Records</span>
                  </span>
                ) : currentDog.vaccinationStatus === 'under_vet_review' ? (
                  <span className="text-[#FDE68A] flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Records Under Review</span>
                  </span>
                ) : (
                  <span className="text-white/70 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-white/50" />
                    <span>Owner-Reported Vaccines</span>
                  </span>
                )}

                <span className="text-white/60">Tap info for details</span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Bottom Ergonomic Action Controls: Pass, Full Profile, Like */}
      {!loading && candidates.length > 0 && (
        <div className="w-full mt-4 flex items-center justify-center gap-6">
          
          {/* Pass Button (Hitbox >= 48px) */}
          <button
            type="button"
            disabled={Boolean(exitAnimation)}
            onClick={() => handleSwipe('pass')}
            className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-white border border-[#E8F0E9] text-[#E98779] hover:bg-[#FDF2F0] hover:scale-105 active:scale-95 shadow-md flex items-center justify-center cursor-pointer transition-all disabled:opacity-50"
            title="Pass (Left Arrow)"
            aria-label="Pass"
          >
            <X className="w-7 h-7 stroke-[2.5]" />
          </button>

          {/* View Full Profile CTA */}
          <button
            type="button"
            onClick={() => onOpenDogDetail(currentDog)}
            className="min-h-[48px] px-5 py-2.5 rounded-full bg-white border border-[#E8F0E9] hover:border-[#194B38] text-xs font-semibold text-[#194B38] hover:bg-[#FAF7F0] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Info className="w-4 h-4" />
            <span>Full Profile</span>
          </button>

          {/* Like Button (Hitbox >= 48px) */}
          <button
            type="button"
            disabled={Boolean(exitAnimation)}
            onClick={() => handleSwipe('like')}
            className="w-16 h-16 min-w-[64px] min-h-[64px] rounded-full bg-[#194B38] text-white hover:bg-[#133A2B] hover:scale-105 active:scale-95 shadow-lg shadow-[#194B38]/25 flex items-center justify-center cursor-pointer transition-all disabled:opacity-50"
            title="Express Interest / Like (Right Arrow)"
            aria-label="Like"
          >
            <Heart className="w-8 h-8 fill-current" />
          </button>

        </div>
      )}

      {/* Desktop Keyboard Tip */}
      {!loading && candidates.length > 0 && (
        <p className="hidden md:block text-center text-[11px] text-[#536B60] mt-3">
          Tip: Press <strong>← Left Arrow</strong> to pass, <strong>→ Right Arrow</strong> to like, <strong>Space</strong> for full profile
        </p>
      )}

    </div>
  );
};
