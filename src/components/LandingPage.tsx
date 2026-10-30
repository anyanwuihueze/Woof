import React, { useState } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Briefcase,
  Compass,
  Star,
  Clock
} from 'lucide-react';
import { Dog } from '../types';

interface LandingPageProps {
  onStartDiscovery: () => void;
  onExploreServices: () => void;
  onOpenSafetyModal: () => void;
  previewDogs: Dog[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartDiscovery,
  onExploreServices,
  onOpenSafetyModal,
  previewDogs,
}) => {
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
  const [previewTab, setPreviewTab] = useState<'dog' | 'service'>('dog');
  const activePreviewDog = previewDogs[selectedPreviewIndex] || previewDogs[0];

  // Interactive Live Paw Reaction State in Hero
  const [pawPatsCount, setPawPatsCount] = useState(312);
  const [showPawAnimation, setShowPawAnimation] = useState(false);

  const handleGivePawReaction = () => {
    setPawPatsCount(prev => prev + 1);
    setShowPawAnimation(true);
    setTimeout(() => setShowPawAnimation(false), 900);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#24352D] overflow-hidden">
      
      {/* HERO SECTION WITH SPLIT SHOWCASE */}
      <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 px-4 sm:px-8 border-b border-[#E8F0E9]">
        
        {/* Soft Organic Ambient Glows */}
        <div className="absolute -top-16 left-1/12 w-96 h-96 bg-[#194B38]/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/4 right-5 w-[440px] h-[440px] bg-[#E98779]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-4 left-1/3 w-80 h-80 bg-[#E8F0E9] rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
          
          {/* Left Text Column: Punchy, Clear Copy on Matching + Pet Services */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#194B38] bg-[#E8F0E9] px-3.5 py-1.5 rounded-full border border-[#D1E0D3] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#194B38] animate-pulse"></span>
              <span className="font-serif italic font-medium">Woof Pal</span>
              <span>·</span>
              <span className="tracking-wide">Dog Matching & Verified Pet Services in Lagos</span>
            </div>

            {/* Characterful Fraunces Display Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[4.2rem] font-black tracking-tight text-[#194B38] leading-[1.06]" style={{ textWrap: 'balance' }}>
              Better Matches. <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#E98779] underline decoration-[#E98779]/30 decoration-wavy decoration-2 underline-offset-8">
                Happier Paws.
              </span>
            </h1>

            {/* Tightened, high-impact introductory copy communicating both facets */}
            <p className="text-base sm:text-lg text-[#536B60] max-w-xl leading-relaxed font-normal">
              Discover compatible local dogs for safe park playdates and find certified veterinary clinics, groomers, and trainers across Lagos. Built with honest health verification and welfare-first privacy.
            </p>

            {/* Dual CTAs for companion discovery and services */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onStartDiscovery}
                className="px-7 py-4 rounded-2xl bg-[#194B38] hover:bg-[#133A2B] text-white font-semibold text-sm shadow-md shadow-[#194B38]/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
              >
                <Compass className="w-4 h-4" />
                <span>Find Your Dog's Match</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreServices}
                className="px-6 py-4 rounded-2xl bg-white hover:bg-[#FAF7F0] text-[#194B38] font-semibold text-sm border border-[#D1E0D3] shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-[#E98779]" />
                <span>Browse Pet Services</span>
              </button>
            </div>

            {/* Trust Proof Points */}
            <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-[#536B60]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#194B38]" />
                <span className="font-medium">Clinic-audited vs. owner-reported records</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#194B38]" />
                <span className="font-medium">Strict zero-broker welfare policy</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#194B38]" />
                <span className="font-medium">Approximate neighbourhood privacy</span>
              </div>
            </div>

          </div>

          {/* Right Column: Split Showcase with Dog Photography & Services Quick-Preview */}
          <div className="lg:col-span-5 flex flex-col items-center relative">
            
            {/* Interactive Floating Match Card (Top-Left Offset) */}
            <div className="hidden sm:flex absolute -top-5 -left-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8F0E9] p-3 shadow-xl items-center gap-3 animate-in fade-in duration-300">
              <div className="flex -space-x-2">
                <img
                  src="/src/assets/images/golden_retriever_profile_1792932440339.jpg"
                  alt="Bruno"
                  className="w-9 h-9 rounded-full border-2 border-white object-cover"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="/src/assets/images/french_bulldog_profile_1792932441788.jpg"
                  alt="Luna"
                  className="w-9 h-9 rounded-full border-2 border-white object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left pr-1">
                <p className="text-[11px] font-bold text-[#194B38] leading-tight">Bruno & Luna Matched!</p>
                <p className="text-[10px] text-[#536B60]">🎾 Playdate scheduled · Lekki</p>
              </div>

              {/* Interactive Live Paw Reaction Stamp */}
              <button
                onClick={handleGivePawReaction}
                className="ml-1 px-2.5 py-1 rounded-xl bg-[#E8F0E9] hover:bg-[#D1E0D3] text-[#194B38] text-[11px] font-bold flex items-center gap-1 transition-transform active:scale-90 cursor-pointer shadow-2xs relative"
                title="Send a paw reaction"
              >
                <span>🐾</span>
                <span>{pawPatsCount}</span>
                {showPawAnimation && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm animate-bounce text-[#E98779]">
                    ❤️
                  </span>
                )}
              </button>
            </div>

            {/* Showcase Container with Toggle Tabs */}
            <div className="relative w-full max-w-sm sm:max-w-md">
              
              {/* Dual Toggle Pill */}
              <div className="flex items-center justify-center mb-3">
                <div className="bg-white p-1 rounded-full border border-[#E8F0E9] shadow-2xs inline-flex gap-1">
                  <button
                    onClick={() => setPreviewTab('dog')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      previewTab === 'dog' 
                        ? 'bg-[#194B38] text-white shadow-xs' 
                        : 'text-[#536B60] hover:text-[#194B38]'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Dog Discovery</span>
                  </button>
                  <button
                    onClick={() => setPreviewTab('service')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      previewTab === 'service' 
                        ? 'bg-[#194B38] text-white shadow-xs' 
                        : 'text-[#536B60] hover:text-[#194B38]'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Pet Services</span>
                  </button>
                </div>
              </div>

              {previewTab === 'dog' ? (
                /* Main Dog Preview Card */
                <div className="relative bg-white rounded-3xl shadow-xl border border-[#E8F0E9] overflow-hidden">
                  
                  {/* High-Impact Photographic Container */}
                  <div className="relative h-96 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={activePreviewDog?.photos[0]}
                      alt={activePreviewDog?.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#24352D]/90 via-[#24352D]/25 to-transparent"></div>

                    {/* Top Info Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-xs font-semibold px-3 py-1 bg-white/95 backdrop-blur-md text-[#194B38] rounded-full shadow-2xs">
                        {activePreviewDog?.primaryPurpose === 'playdates' ? '🎾 Seeking Playdates' : 
                         activePreviewDog?.primaryPurpose === 'socialization' ? '🌱 Socialization' : '🧬 Responsible Breeding'}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 bg-black/45 backdrop-blur-md text-white rounded-full">
                        📍 {activePreviewDog?.location.area}
                      </span>
                    </div>

                    {/* Bottom Details on Image */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-serif text-3xl font-bold tracking-tight">{activePreviewDog?.name}</h3>
                        <span className="text-lg font-light text-white/90">
                          {activePreviewDog?.ageYears}y {activePreviewDog?.ageMonths > 0 ? `${activePreviewDog?.ageMonths}m` : ''}
                        </span>
                      </div>
                      <p className="text-sm text-white/95 font-medium mt-0.5">
                        {activePreviewDog?.breed} · {activePreviewDog?.size} ({activePreviewDog?.weightKg}kg)
                      </p>
                      <p className="text-xs text-white/80 mt-1 line-clamp-2">
                        {activePreviewDog?.bio}
                      </p>
                    </div>
                  </div>

                  {/* Card Switcher & CTA Footer */}
                  <div className="p-4 bg-[#FAF7F0] border-t border-[#E8F0E9] flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {previewDogs.slice(0, 4).map((dog, idx) => (
                        <button
                          key={dog.id}
                          onClick={() => setSelectedPreviewIndex(idx)}
                          className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                            selectedPreviewIndex === idx ? 'border-[#194B38] scale-110 shadow-xs ring-2 ring-[#194B38]/20' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                          title={`Preview ${dog.name}`}
                        >
                          <img src={dog.photos[0]} alt={dog.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={onStartDiscovery}
                      className="px-4 py-2.5 bg-[#194B38] hover:bg-[#133A2B] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>Start Swiping</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ) : (
                /* Services Quick Showcase Card */
                <div className="relative bg-white rounded-3xl shadow-xl border border-[#E8F0E9] p-5 space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#194B38] uppercase tracking-wider bg-[#E8F0E9] px-2.5 py-1 rounded-full">
                        Lekki & Island Care
                      </span>
                      <h3 className="font-serif text-xl font-bold text-[#194B38] mt-1.5">
                        Lekki Pet Care & Specialty Hospital
                      </h3>
                      <p className="text-xs text-[#536B60]">Plot 14 Admiralty Way, Lekki Phase 1</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F0E9] text-[#194B38] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6 text-[#194B38]" />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8F0E9]">
                      <span className="font-medium text-[#24352D]">Wellness Exam & Vaccine Review</span>
                      <span className="font-bold text-[#194B38]">₦25,000</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8F0E9]">
                      <span className="font-medium text-[#24352D]">BOAS Airway & Health Check</span>
                      <span className="font-bold text-[#194B38]">₦35,000</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8F0E9]">
                      <span className="font-medium text-[#24352D]">Microchip Implantation</span>
                      <span className="font-bold text-[#194B38]">₦30,000</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-[#536B60] flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-current" />
                      <span><strong>4.9</strong> (142 reviews)</span>
                    </span>
                    <button
                      onClick={onExploreServices}
                      className="px-4 py-2 bg-[#194B38] hover:bg-[#133A2B] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      View All Providers
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* THREE BENEFIT SECTIONS WITH EDITORIAL CHAPTER NUMBERING */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-[#E98779]">Animal Welfare & Community</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#194B38] tracking-tight">
            Designed for Dogs First, <span className="italic font-normal">Owners Second</span>
          </h2>
          <p className="text-sm sm:text-base text-[#536B60]">
            Unlike human dating platforms, canine chemistry depends on temperament, play energy, size compatibility, and supervised introductions.
          </p>
        </div>

        {/* 3 Step / Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-8 border border-[#E8F0E9] shadow-2xs hover:shadow-md transition-shadow space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#194B38]">
                01. Discovery
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#194B38]">Discover Nearby Dogs</h3>
              <p className="text-sm text-[#536B60] leading-relaxed">
                Filter by play style, energy level, size, and approximate distance. Swipe right to express interest or swipe left to pass without awkwardness.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8F0E9] text-xs font-medium text-[#194B38] flex items-center gap-1.5">
              <span>Energy & temperament matched</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-8 border border-[#E8F0E9] shadow-2xs hover:shadow-md transition-shadow space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#E98779]">
                02. Matching
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#194B38]">Meaningful Connections</h3>
              <p className="text-sm text-[#536B60] leading-relaxed">
                When both owners like each other's dog profile, a mutual match is formed. Chat safely in-app to coordinate convenient park meetups.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8F0E9] text-xs font-medium text-[#E98779] flex items-center gap-1.5">
              <span>Private, mutual consent matching</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-8 border border-[#E8F0E9] shadow-2xs hover:shadow-md transition-shadow space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#194B38]">
                03. Verification
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#194B38]">Meet With Confidence</h3>
              <p className="text-sm text-[#536B60] leading-relaxed">
                Clear distinction between self-reported vaccines and verified veterinary clinics. Follow our daylight public park protocol for zero-stress meetings.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8F0E9] text-xs font-medium text-[#194B38] flex items-center gap-1.5">
              <span>Honest health transparency</span>
            </div>
          </div>

        </div>

      </section>

      {/* RESPONSIBLE OWNERSHIP & ANIMAL WELFARE SECTION */}
      <section className="bg-[#194B38] text-white py-16 md:py-20 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#133A2B] rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E98779]">
              <ShieldCheck className="w-4 h-4" />
              <span>Animal Welfare Commitment</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Responsible Ownership & <span className="italic font-normal text-[#E98779]">Trust Principles</span>
            </h2>

            <p className="text-white/85 text-base sm:text-lg leading-relaxed">
              Woof Pal is strictly built for companionship, socialization, and ethical kennel welfare. We enforce strict policies to protect our four-legged friends:
            </p>

            <div className="space-y-3.5 text-sm text-white/90">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#133A2B] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
                <span><strong>Supervised Public Meetings:</strong> Always arrange first playdates in daylight, neutral, fenced public parks or open spaces. Keep leashes attached for initial nose-to-tail greetings.</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#133A2B] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
                <span><strong>No Commercial Puppy Mill Trade:</strong> Woof Pal does NOT facilitate illegal animal broker sales, backyard breeding, or animal exploitation. Accounts promoting inhumane breeding are banned.</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#133A2B] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
                <span><strong>Veterinary Consultation Mandatory:</strong> A mutual match on Woof Pal is never medical or genetic clearance for breeding. Always consult a licensed veterinary surgeon before any pairing.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenSafetyModal}
                className="px-7 py-3.5 rounded-xl bg-white text-[#194B38] font-semibold text-sm hover:bg-[#FAF7F0] transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <span>Read Full Community Guidelines</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#133A2B]/85 p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-3 text-[#E98779]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="font-serif font-bold text-xl text-white">Trust & Safety Notice</h4>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              We clearly distinguish between owner-reported vaccination dates and records validated by licensed veterinary partners. Never send money, deposit payments, or share your home address with unverified parties.
            </p>
            <div className="p-4 bg-[#194B38] rounded-2xl border border-white/10 text-xs text-white/90">
              <span className="font-semibold text-[#E98779] block mb-1">Instant Reporting & Blocking</span>
              Every profile and chat provides 1-tap options to block abusive users and file immediate reports to our trust team.
            </div>
          </div>

        </div>
      </section>

      {/* PET SERVICES MARKETPLACE INTEGRATED TEASER */}
      <section className="py-16 md:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#E8F0E9] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#194B38] bg-[#E8F0E9] px-3.5 py-1 rounded-full">
              <Briefcase className="w-3.5 h-3.5 text-[#194B38]" />
              <span>Woof Pal Pet Services</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#194B38] tracking-tight">
              Need a Vet, Groomer, or Dog Walker in <span className="italic font-normal">Lagos?</span>
            </h2>
            <p className="text-sm sm:text-base text-[#536B60] leading-relaxed">
              Explore our vetted directory of veterinary clinics, luxury grooming salons, boarding suites, and certified dog trainers across Lekki, Victoria Island, Ikoyi, and Ikeja.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-xs text-[#536B60]">
              <span className="px-3.5 py-1.5 bg-[#FAF7F0] rounded-xl border border-[#E8F0E9] font-medium">Veterinary Clinics</span>
              <span className="px-3.5 py-1.5 bg-[#FAF7F0] rounded-xl border border-[#E8F0E9] font-medium">Pet Grooming</span>
              <span className="px-3.5 py-1.5 bg-[#FAF7F0] rounded-xl border border-[#E8F0E9] font-medium">Boarding & Daycare</span>
              <span className="px-3.5 py-1.5 bg-[#FAF7F0] rounded-xl border border-[#E8F0E9] font-medium">Positive Dog Training</span>
              <span className="px-3.5 py-1.5 bg-[#FAF7F0] rounded-xl border border-[#E8F0E9] font-medium">Daily Dog Walking</span>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center items-stretch">
            <button
              onClick={onExploreServices}
              className="px-6 py-4 rounded-2xl bg-[#194B38] hover:bg-[#133A2B] text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse Pet Services Directory</span>
            </button>
            <button
              onClick={onStartDiscovery}
              className="px-6 py-4 rounded-2xl bg-[#FAF7F0] hover:bg-[#E8F0E9] text-[#194B38] font-semibold text-sm border border-[#D1E0D3] shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[#E98779]" />
              <span>Find Dog Companions First</span>
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E8F0E9] bg-white py-12 px-4 sm:px-8 text-xs text-[#536B60]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#194B38] text-white flex items-center justify-center font-serif font-black text-sm">
              W
            </div>
            <span className="font-serif font-bold text-base text-[#194B38]">Woof Pal</span>
            <span className="text-[#D1E0D3]">·</span>
            <span className="font-serif italic text-[#536B60]">Better Matches. Happier Paws.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button onClick={onOpenSafetyModal} className="hover:text-[#194B38] cursor-pointer">Safety Protocol</button>
            <button onClick={onExploreServices} className="hover:text-[#194B38] cursor-pointer">Pet Services</button>
            <button onClick={onStartDiscovery} className="hover:text-[#194B38] cursor-pointer">Discovery Feed</button>
            <span>Lagos & Global Cities</span>
          </div>

          <div>
            <span>© 2026 Woof Pal Platform · Demonstration Prototype</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
