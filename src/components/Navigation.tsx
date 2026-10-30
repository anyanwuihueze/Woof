import React, { useState } from 'react';
import { 
  Heart, 
  Briefcase, 
  ShieldCheck, 
  User, 
  ChevronDown, 
  Compass,
  Plus,
  Download,
  HeartHandshake
} from 'lucide-react';
import { Dog, OwnerProfile } from '../types';

interface NavigationProps {
  activeTab: 'landing' | 'discovery' | 'find-mate' | 'matches' | 'services' | 'profile';
  setActiveTab: (tab: 'landing' | 'discovery' | 'find-mate' | 'matches' | 'services' | 'profile') => void;
  matchesCount: number;
  pendingMatingRequestsCount?: number;
  currentUser: OwnerProfile;
  activeDog: Dog;
  userDogs: Dog[];
  onSelectActiveDog: (dogId: string) => void;
  onOpenNewDogModal: () => void;
  onOpenSafetyModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  matchesCount,
  pendingMatingRequestsCount = 0,
  currentUser,
  activeDog,
  userDogs,
  onSelectActiveDog,
  onOpenNewDogModal,
  onOpenSafetyModal,
}) => {
  const [dogDropdownOpen, setDogDropdownOpen] = useState(false);

  return (
    <>
      {/* Top Banner: Compact Demonstration Notice */}
      <aside aria-label="Demonstration Notice" className="bg-[#194B38] text-white/90 text-xs py-1.5 px-4 text-center border-b border-[#24352D]/20 flex items-center justify-center gap-2">
        <span className="font-bold text-[#E98779] uppercase tracking-wider text-[10px]">Demo Prototype</span>
        <span className="text-white/40">·</span>
        <span className="text-white/85 text-[11px]">Showcase data for Lagos & adaptable cities. All profiles and clinic listings are fictional.</span>
        <span className="text-white/40">·</span>
        <button 
          onClick={onOpenSafetyModal}
          className="underline hover:text-white transition-colors cursor-pointer text-white/90 font-medium text-[11px]"
        >
          Safety Guidelines
        </button>
      </aside>

      {/* Top Bar: Strict 3-zone contract */}
      <header className="sticky top-0 z-30 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E8F0E9] px-3 sm:px-6 lg:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#194B38] text-white flex items-center justify-center shadow-xs group-hover:bg-[#133A2B] transition-colors shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C10.9 2 10 2.9 10 4C10 5.1 10.9 6 12 6C13.1 6 14 4C14 2.9 13.1 2 12 2M6 6C4.9 6 4 6.9 4 8C4 9.1 4.9 10 6 10C7.1 10 8 9.1 8 8C8 6.9 7.1 6 6 6M18 6C16.9 6 16 6.9 16 8C16 9.1 16.9 10 18 10C19.1 10 20 9.1 20 8C20 6.9 19.1 6 18 6M8.5 11C7.1 11 6 12.1 6 13.5C6 14.9 7.1 16 8.5 16C9.9 16 11 14.9 11 13.5C11 12.1 9.9 11 8.5 11M15.5 11C14.1 11 13 12.1 13 13.5C13 14.9 14.1 16 15.5 16C16.9 16 18 14.9 18 13.5C18 12.1 16.9 11 15.5 11M12 14.5C9.2 14.5 7 16.7 7 19.5C7 20.9 8.1 22 9.5 22C10.9 22 11.5 21 12 21C12.5 21 13.1 22 14.5 22C15.9 22 17 20.9 17 19.5C17 16.7 14.8 14.5 12 14.5Z" />
                </svg>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-black tracking-tight text-[#194B38] whitespace-nowrap block leading-tight">
                  Woof Pal
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-wider text-[#536B60] font-medium uppercase block">
                  Lagos & Global
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Concise Single-line Nav Links (responsive gap and labels) */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6 text-xs lg:text-sm font-medium text-[#536B60] shrink min-w-0">
            <button
              onClick={() => setActiveTab('discovery')}
              className={`hover:text-[#194B38] transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1 cursor-pointer ${
                activeTab === 'discovery' ? 'text-[#194B38] font-semibold border-b-2 border-[#194B38]' : ''
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Discover<span className="hidden xl:inline"> Dogs</span></span>
            </button>

            <button
              onClick={() => setActiveTab('find-mate')}
              className={`hover:text-[#194B38] transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1 cursor-pointer relative ${
                activeTab === 'find-mate' ? 'text-[#194B38] font-semibold border-b-2 border-[#194B38]' : ''
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-[#E98779]" />
              <span>Find a Mate</span>
              {pendingMatingRequestsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-[#E98779] text-white text-[10px] font-bold rounded-full animate-pulse">
                  {pendingMatingRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('matches')}
              className={`hover:text-[#194B38] transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1 cursor-pointer relative ${
                activeTab === 'matches' ? 'text-[#194B38] font-semibold border-b-2 border-[#194B38]' : ''
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Matches</span>
              {matchesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-[#E98779] text-white text-[10px] font-bold rounded-full">
                  {matchesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`hover:text-[#194B38] transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1 cursor-pointer ${
                activeTab === 'services' ? 'text-[#194B38] font-semibold border-b-2 border-[#194B38]' : ''
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span><span className="hidden xl:inline">Pet </span>Services</span>
            </button>

            <button
              onClick={onOpenSafetyModal}
              className="hover:text-[#194B38] transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1 cursor-pointer text-[#536B60]"
            >
              <ShieldCheck className="w-4 h-4 text-[#194B38]" />
              <span>Safety<span className="hidden xl:inline"> & Trust</span></span>
            </button>
          </nav>

          {/* Zone 3: Active Profile / Switcher CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Active Dog Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDogDropdownOpen(!dogDropdownOpen)}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-full bg-white border border-[#E8F0E9] hover:border-[#194B38] text-sm text-[#24352D] shadow-2xs cursor-pointer transition-colors"
                title="Switch active dog profile"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-[#FAF7F0] border border-[#E8F0E9] shrink-0">
                  <img
                    src={activeDog.photos[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80'}
                    alt={activeDog.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <span className="font-semibold text-xs text-[#194B38] block leading-tight">{activeDog.name}</span>
                  <span className="text-[10px] text-[#536B60] block truncate max-w-[70px] xl:max-w-[90px]">{currentUser.area}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#536B60]" />
              </button>

              {/* Dropdown Menu */}
              {dogDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E8F0E9] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setDogDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#E8F0E9]">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#536B60]">Your Dogs ({userDogs.length})</p>
                  </div>
                  <div className="max-h-52 overflow-y-auto py-1">
                    {userDogs.map(dog => (
                      <button
                        key={dog.id}
                        onClick={() => {
                          onSelectActiveDog(dog.id);
                          setDogDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-[#FAF7F0] transition-colors cursor-pointer ${
                          dog.id === activeDog.id ? 'bg-[#E8F0E9] font-semibold text-[#194B38]' : 'text-[#24352D]'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 shrink-0">
                          <img
                            src={dog.photos[0]}
                            alt={dog.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{dog.name}</p>
                          <p className="text-xs text-[#536B60] truncate">{dog.breed} · {dog.primaryPurpose}</p>
                        </div>
                        {dog.id === activeDog.id && (
                          <span className="text-[10px] font-bold text-[#194B38] bg-white px-2 py-0.5 rounded-full shadow-2xs">
                            Active
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-[#E8F0E9] space-y-1">
                    <button
                      onClick={() => {
                        setDogDropdownOpen(false);
                        onOpenNewDogModal();
                      }}
                      className="w-full px-3 py-2 text-xs font-medium text-[#194B38] hover:bg-[#FAF7F0] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Another Dog</span>
                    </button>
                    <button
                      onClick={() => {
                        setDogDropdownOpen(false);
                        setActiveTab('profile');
                      }}
                      className="w-full px-3 py-2 text-xs font-medium text-[#536B60] hover:bg-[#FAF7F0] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Owner Profile & Settings</span>
                    </button>
                    <a
                      href="/wolfpal-project.zip"
                      download="wolfpal-project.zip"
                      className="w-full px-3 py-2 text-xs font-medium text-[#194B38] bg-[#E8F0E9]/60 hover:bg-[#E8F0E9] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Project ZIP</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Trigger */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-1.5 sm:p-2 rounded-xl text-[#536B60] hover:text-[#194B38] hover:bg-white transition-colors cursor-pointer ${
                activeTab === 'profile' ? 'bg-white text-[#194B38] shadow-2xs' : ''
              }`}
              title="View Owner Profile"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Direct 1-Click Code Download (responsive: compact icon on mid screens, full label on xl, safely accessible on mobile via dropdown) */}
            <a
              href="/wolfpal-project.zip"
              download="wolfpal-project.zip"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#194B38] text-white text-xs font-semibold hover:bg-[#133A2B] transition-colors shadow-2xs shrink-0 cursor-pointer"
              title="Download project ZIP for GitHub & Vercel deployment"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Download ZIP</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Ergonomic Bottom Tab Bar (fixed bottom-0, touch target >= 44px) */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8F0E9] px-1 py-1 shadow-lg">
        <div className="grid grid-cols-5 items-center h-16">
          
          <button
            onClick={() => setActiveTab('discovery')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'discovery' ? 'text-[#194B38] font-bold' : 'text-[#536B60]'
            }`}
          >
            <Compass className={`w-5 h-5 ${activeTab === 'discovery' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] tracking-tight mt-1">Discover</span>
          </button>

          <button
            onClick={() => setActiveTab('find-mate')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer relative transition-colors ${
              activeTab === 'find-mate' ? 'text-[#194B38] font-bold' : 'text-[#536B60]'
            }`}
          >
            <div className="relative">
              <HeartHandshake className={`w-5 h-5 ${activeTab === 'find-mate' ? 'text-[#194B38] stroke-[2.5]' : 'text-[#536B60] stroke-[1.8]'}`} />
              {(pendingMatingRequestsCount ?? 0) > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1.2 py-0.2 bg-[#E98779] text-white text-[8px] font-bold rounded-full animate-pulse">
                  {pendingMatingRequestsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1">Find Mate</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer relative transition-colors ${
              activeTab === 'matches' ? 'text-[#194B38] font-bold' : 'text-[#536B60]'
            }`}
          >
            <div className="relative">
              <Heart className={`w-5 h-5 ${activeTab === 'matches' ? 'fill-[#194B38] stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {matchesCount > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-[#E98779] text-white text-[8px] font-bold rounded-full">
                  {matchesCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1">Matches</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'services' ? 'text-[#194B38] font-bold' : 'text-[#536B60]'
            }`}
          >
            <Briefcase className={`w-5 h-5 ${activeTab === 'services' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] tracking-tight mt-1">Services</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'profile' ? 'text-[#194B38] font-bold' : 'text-[#536B60]'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] tracking-tight mt-1">Profile</span>
          </button>

        </div>
      </nav>
    </>
  );
};
