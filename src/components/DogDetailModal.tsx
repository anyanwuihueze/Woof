import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  Activity, 
  Dna, 
  Flag, 
  Slash,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Dog } from '../types';

interface DogDetailModalProps {
  dog: Dog | null;
  onClose: () => void;
  onLike?: (dog: Dog) => void;
  onPass?: (dog: Dog) => void;
  onReport: (dog: Dog) => void;
  onBlock: (ownerId: string, ownerName: string) => void;
}

export const DogDetailModal: React.FC<DogDetailModalProps> = ({
  dog,
  onClose,
  onLike,
  onPass,
  onReport,
  onBlock,
}) => {
  if (!dog) return null;

  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8F0E9] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Sticky Close Header */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center cursor-pointer transition-colors backdrop-blur-md shadow-md"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          
          {/* Photo Gallery Carousel */}
          <div className="relative h-80 sm:h-96 w-full bg-slate-900 overflow-hidden">
            <img
              src={dog.photos[activePhoto] || dog.photos[0]}
              alt={dog.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#24352D]/85 via-transparent to-black/30 pointer-events-none"></div>

            {/* Photo Indicators */}
            {dog.photos.length > 1 && (
              <div className="absolute top-4 inset-x-4 flex gap-1.5 z-10 pointer-events-none">
                {dog.photos.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 flex-1 rounded-full ${
                      idx === activePhoto ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Carousel Navigation Arrows */}
            {dog.photos.length > 1 && (
              <>
                <button
                  onClick={() => setActivePhoto(prev => Math.max(0, prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActivePhoto(prev => Math.min(dog.photos.length - 1, prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Photo Bottom Headline */}
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <div className="flex items-baseline gap-2">
                <h2 className="font-serif text-3xl font-extrabold">{dog.name}</h2>
                <span className="text-xl text-white/90">
                  {dog.ageYears}y {dog.ageMonths > 0 ? `${dog.ageMonths}m` : ''}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md ml-2 capitalize">
                  {dog.sex}
                </span>
              </div>
              <p className="text-sm text-white/90 font-medium mt-0.5">
                {dog.breed} {dog.isMixedBreed && '(Mixed)'} · {dog.size} ({dog.weightKg} kg)
              </p>
              <p className="text-xs text-white/75 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#E98779]" />
                <span>Approx. {dog.location.approximateDistanceKm} km away in {dog.location.area}, {dog.location.city}</span>
              </p>
            </div>
          </div>

          {/* Body Sections */}
          <div className="p-6 space-y-6 text-[#24352D]">
            
            {/* Primary Purpose Banner */}
            <div className="p-4 rounded-2xl bg-[#E8F0E9] border border-[#D1E0D3] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#194B38] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#194B38]">
                  Primary Intent: {dog.primaryPurpose === 'playdates' ? 'Playdates & Companionship' : 
                                   dog.primaryPurpose === 'socialization' ? 'Socialization & Habituation' : 'Responsible Pedigree Breeding'}
                </h4>
                <p className="text-xs text-[#536B60] mt-0.5">
                  {dog.primaryPurpose === 'playdates' 
                    ? 'Owner is seeking compatible playmates for weekend park sessions, beach strolls, and friendly burn-off runs.'
                    : dog.primaryPurpose === 'socialization'
                    ? 'Owner is helping this dog learn calm greeting etiquette, gentle boundaries, and positive exposure to other canine peers.'
                    : 'Owner is exploring responsible, health-tested ethical breeding pairings with verified genetic documentation.'}
                </p>
              </div>
            </div>

            {/* About / Bio */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B60] mb-2">About {dog.name}</h4>
              <p className="text-sm text-[#24352D] leading-relaxed whitespace-pre-line bg-[#FAF7F0] p-4 rounded-2xl border border-[#E8F0E9]">
                {dog.bio}
              </p>
            </div>

            {/* Temperament & Characteristics */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B60] mb-2">Temperament & Traits</h4>
              <div className="flex flex-wrap gap-2">
                {dog.temperament.map((trait, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-white border border-[#D1E0D3] text-xs font-medium text-[#194B38]">
                    {trait}
                  </span>
                ))}
                <span className="px-3 py-1.5 rounded-xl bg-[#E8F0E9] text-xs font-semibold text-[#194B38]">
                  Energy: {dog.energyLevel}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] border border-[#E8F0E9] text-xs font-medium text-[#536B60]">
                  Size: {dog.size}
                </span>
              </div>
            </div>

            {/* Favorite Activities */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B60] mb-2">Favorite Play Activities</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#24352D]">
                {dog.favoriteActivities.map((act, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8F0E9]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#194B38]"></span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner Profile Snippet */}
            <div className="p-4 rounded-2xl bg-white border border-[#E8F0E9] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-[#E8F0E9] shrink-0">
                  <img
                    src={dog.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={dog.ownerName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#194B38]">{dog.ownerName}</h4>
                  <p className="text-xs text-[#536B60]">Dog Owner in {dog.location.area}</p>
                </div>
              </div>
              <span className="text-[11px] text-[#536B60] bg-[#FAF7F0] px-2.5 py-1 rounded-full border border-[#E8F0E9]">
                Approx. {dog.location.approximateDistanceKm} km
              </span>
            </div>

            {/* HEALTH & VACCINATION VERIFICATION STATUS SECTION */}
            <div className="border border-[#E8F0E9] rounded-2xl p-5 bg-[#FAF7F0] space-y-4">
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#194B38]" />
                    <h4 className="font-serif text-sm font-bold text-[#194B38]">Health & Vaccination Information</h4>
                  </div>
                  <p className="text-xs text-[#536B60] mt-0.5">
                    Clear distinction between self-reported records and authorized clinic audits.
                  </p>
                </div>

                {/* Status Badge */}
                {dog.vaccinationStatus === 'verified_by_vet' ? (
                  <span className="px-3 py-1 rounded-full bg-[#E8F0E9] text-[#194B38] text-xs font-bold border border-[#D1E0D3] shrink-0">
                    Verified by Partner Clinic
                  </span>
                ) : dog.vaccinationStatus === 'under_vet_review' ? (
                  <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold border border-[#FDE68A] shrink-0">
                    Documents Under Review
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-white text-[#536B60] text-xs font-semibold border border-[#E8F0E9] shrink-0">
                    Owner Self-Reported
                  </span>
                )}
              </div>

              {/* Informational Caveat */}
              <div className="text-[11px] text-[#536B60] bg-white p-3 rounded-xl border border-[#E8F0E9] leading-relaxed">
                {dog.vaccinationStatus === 'verified_by_vet' ? (
                  <p className="text-[#194B38] font-medium">
                    ✓ This dog's vaccination cards and clinical record were checked directly with an authorized partner veterinary hospital.
                  </p>
                ) : (
                  <p>
                    ⚠️ <strong>Notice:</strong> This health information has been declared by the dog owner. It has not yet been audited by a certified veterinary hospital. We encourage owners to exchange veterinary records prior to meeting.
                  </p>
                )}
              </div>

              {/* Health Checklist Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-[#E8F0E9]">
                  <span className="text-[#536B60] block text-[10px]">Rabies Vaccination</span>
                  <span className="font-semibold text-[#194B38]">
                    {dog.healthScreening.rabiesVaccinated ? '✓ Up to Date' : 'Not Declared'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-[#E8F0E9]">
                  <span className="text-[#536B60] block text-[10px]">DHPP Core Vaccines</span>
                  <span className="font-semibold text-[#194B38]">
                    {dog.healthScreening.dhppVaccinated ? '✓ Up to Date' : 'Not Declared'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-[#E8F0E9]">
                  <span className="text-[#536B60] block text-[10px]">Deworming Protocol</span>
                  <span className="font-semibold text-[#194B38]">
                    {dog.healthScreening.dewormedRecently ? '✓ Recent (3 mos)' : 'Pending'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-[#E8F0E9]">
                  <span className="text-[#536B60] block text-[10px]">Spayed / Neutered</span>
                  <span className="font-semibold text-[#194B38]">
                    {dog.healthScreening.spayedOrNeutered ? 'Yes' : 'Intact'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-[#E8F0E9]">
                  <span className="text-[#536B60] block text-[10px]">Microchipped</span>
                  <span className="font-semibold text-[#194B38]">
                    {dog.healthScreening.microchipped ? '✓ Registered Chip' : 'No'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-[#E8F0E9]">
                  <span className="text-[#536B60] block text-[10px]">Last Vet Checkup</span>
                  <span className="font-semibold text-[#194B38]">
                    {dog.healthScreening.lastCheckupDate || 'Recorded'}
                  </span>
                </div>
              </div>

              {dog.healthScreening.notes && (
                <p className="text-xs text-[#536B60] italic">
                  Vet notes: {dog.healthScreening.notes}
                </p>
              )}
            </div>

            {/* RESPONSIBLE BREEDING SECTION */}
            {dog.primaryPurpose === 'breeding' && dog.responsibleBreedingInfo && (
              <div className="border-2 border-[#194B38] rounded-2xl p-5 bg-[#FAF7F0] space-y-4">
                
                <div className="flex items-center gap-2 text-[#194B38]">
                  <Dna className="w-5 h-5 text-[#194B38]" />
                  <h4 className="font-serif text-base font-bold">Responsible Breeding Disclosures</h4>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#991B1B] leading-relaxed">
                  <strong>Ethical Breeding Policy:</strong> A profile match on Woof Pal is <em>never</em> proof or certification that breeding is medically, genetically, or ethically appropriate. Woof Pal does not provide automated breeding scores. Both owners must consult qualified veterinary surgeons and perform official OFA/DNA testing before any pairing.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-[#D1E0D3]">
                    <span className="text-[#536B60] block text-[10px]">Pedigree Registration</span>
                    <span className="font-semibold text-[#194B38]">
                      {dog.responsibleBreedingInfo.pedigreeRegistered 
                        ? `${dog.responsibleBreedingInfo.pedigreeClubName} (${dog.responsibleBreedingInfo.registrationNumber})`
                        : 'Unregistered'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#D1E0D3]">
                    <span className="text-[#536B60] block text-[10px]">DNA Genetic Screening</span>
                    <span className="font-semibold text-[#194B38]">
                      {dog.responsibleBreedingInfo.dnaScreeningConducted ? '✓ Panel Completed' : 'Not Conducted'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#D1E0D3]">
                    <span className="text-[#536B60] block text-[10px]">Hips & Elbows Scored</span>
                    <span className="font-semibold text-[#194B38]">
                      {dog.responsibleBreedingInfo.hipElbowScoreAvailable ? '✓ Official Scores Available' : 'Pending'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#D1E0D3]">
                    <span className="text-[#536B60] block text-[10px]">Veterinary Clearance</span>
                    <span className="font-semibold text-[#194B38]">
                      {dog.responsibleBreedingInfo.vetBreedingClearance ? '✓ Cleared for Breeding' : 'No'}
                    </span>
                  </div>
                </div>

                {dog.responsibleBreedingInfo.studOrDamTerms && (
                  <div className="p-3 rounded-xl bg-white border border-[#D1E0D3] text-xs text-[#24352D]">
                    <span className="font-semibold block text-[#194B38] mb-1">Breeding Terms & Requirements:</span>
                    <p>{dog.responsibleBreedingInfo.studOrDamTerms}</p>
                  </div>
                )}
              </div>
            )}

            {/* TRUST & SAFETY REPORTING / BLOCKING BUTTONS */}
            <div className="pt-4 border-t border-[#E8F0E9] flex items-center justify-between text-xs text-[#536B60]">
              <button
                onClick={() => onReport(dog)}
                className="flex items-center gap-1.5 text-[#536B60] hover:text-[#DC2626] transition-colors cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                <span>Report Profile</span>
              </button>

              <button
                onClick={() => onBlock(dog.ownerId, dog.ownerName)}
                className="flex items-center gap-1.5 text-[#536B60] hover:text-[#DC2626] transition-colors cursor-pointer"
              >
                <Slash className="w-4 h-4" />
                <span>Block Owner</span>
              </button>
            </div>

          </div>

        </div>

        {/* Modal Sticky Bottom Actions */}
        <div className="p-4 bg-[#FAF7F0] border-t border-[#E8F0E9] flex items-center justify-between gap-4">
          <button
            onClick={() => {
              onClose();
              if (onPass) onPass(dog);
            }}
            className="min-h-[44px] flex-1 py-3 px-4 rounded-xl bg-white border border-[#D1E0D3] text-xs font-semibold text-[#E98779] hover:bg-[#FDF2F0] transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Pass</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onLike) onLike(dog);
            }}
            className="min-h-[44px] flex-1 py-3 px-4 rounded-xl bg-[#194B38] hover:bg-[#133A2B] text-xs font-semibold text-white shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Like {dog.name}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
