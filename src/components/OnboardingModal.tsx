import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Heart,
  Dna
} from 'lucide-react';
import { DogPurpose, DogSize, EnergyLevel, DogSex } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);

  // Step 1: Owner Profile
  const [ownerName, setOwnerName] = useState('Adaeze Okonjo');
  const [ownerBio, setOwnerBio] = useState('Passionate dog lover in Lekki. Bruno is our gentle family retriever!');
  const [ownerPhone, setOwnerPhone] = useState('+234 803 555 0192');

  // Step 2: Dog Basic Info
  const [dogName, setDogName] = useState('Bruno');
  const [dogBreed, setDogBreed] = useState('Golden Retriever');
  const [dogAgeYears, setDogAgeYears] = useState(2);
  const [dogSex, setDogSex] = useState<DogSex>('male');

  // Step 3: Dog Photo
  const [selectedPhoto, setSelectedPhoto] = useState('/images/golden_retriever_profile_1792932440339.jpg');

  // Step 4: Dog Characteristics
  const [dogSize, setDogSize] = useState<DogSize>('Large');
  const [dogEnergy, setDogEnergy] = useState<EnergyLevel>('High');
  const [temperament, setTemperament] = useState<string[]>(['Friendly', 'Gentle', 'Playful']);

  // Step 5: Dog Purpose
  const [primaryPurpose, setPrimaryPurpose] = useState<DogPurpose>('playdates');

  // Step 6: Location & Discovery Preferences
  const [city, setCity] = useState('Lagos');
  const [area, setArea] = useState('Lekki Phase 1');
  const [maxDistance, setMaxDistance] = useState(15);

  const samplePhotos = [
    { label: 'Golden Retriever', url: '/images/golden_retriever_profile_1792932440339.jpg' },
    { label: 'French Bulldog', url: '/images/french_bulldog_profile_1792932441788.jpg' },
    { label: 'German Shepherd', url: '/images/german_shepherd_profile_1792932441892.jpg' },
    { label: 'Cavapoo / Poodle', url: '/images/poodle_maltese_profile_1792932441976.jpg' },
  ];

  const handleFinish = () => {
    onComplete({
      owner: {
        displayName: ownerName,
        bio: ownerBio,
        phone: ownerPhone,
        city,
        area,
      },
      dog: {
        name: dogName,
        breed: dogBreed,
        isMixedBreed: false,
        ageYears: Number(dogAgeYears),
        ageMonths: 4,
        sex: dogSex,
        size: dogSize,
        weightKg: dogSize === 'Large' ? 30 : dogSize === 'Small' ? 10 : 20,
        temperament,
        energyLevel: dogEnergy,
        favoriteActivities: ['Park fetch', 'Leashed nature walk', 'Tug of war'],
        photos: [selectedPhoto],
        bio: `${dogName} is a wonderful ${dogBreed} looking for ${primaryPurpose} in ${area}.`,
        primaryPurpose,
        location: {
          city,
          area,
          approximateDistanceKm: 0,
        },
        vaccinationStatus: 'owner_reported_up_to_date' as const,
        healthScreening: {
          rabiesVaccinated: true,
          dhppVaccinated: true,
          dewormedRecently: true,
          spayedOrNeutered: true,
          microchipped: true,
          vetName: 'Lekki Pet Care Clinic',
        }
      },
      preferences: {
        maxDistanceKm: maxDistance,
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E5E0D8] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Step Progress Bar */}
        <div className="p-4 bg-[#FAF8F5] border-b border-[#E5E0D8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1B4332] text-white text-xs font-bold flex items-center justify-center">
              {step}
            </span>
            <span className="text-xs font-semibold text-[#1B4332]">Step {step} of 6</span>
          </div>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-all ${
                  i <= step ? 'bg-[#1B4332]' : 'bg-[#E5E0D8]'
                }`}
              />
            ))}
          </div>

          <button onClick={onClose} className="text-[#6B7280] hover:text-[#1A202C] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-sm text-[#1A202C]">
          
          {/* STEP 1: Owner Profile */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-[#1B4332]">Create Your Owner Profile</h3>
                <p className="text-xs text-[#4A5568]">
                  Introduce yourself to fellow dog parents in your neighborhood.
                </p>
              </div>

              {/* Privacy Explanation Callout */}
              <div className="p-3 bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl text-[11px] text-[#4B5563] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                <span>
                  <strong>Why we ask:</strong> Other owners like to know who is on the other end of the leash. Your exact address is never displayed; only your general neighborhood (e.g. Lekki Phase 1).
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Your Display Name *</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
                  placeholder="e.g. Adaeze Okonjo"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Short Owner Bio</label>
                <textarea
                  rows={3}
                  value={ownerBio}
                  onChange={(e) => setOwnerBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
                  placeholder="Share a little about yourself and your canine routine..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
                  placeholder="+234..."
                />
                <span className="text-[10px] text-[#6B7280]">Shown strictly to mutual matches who agree to chat.</span>
              </div>
            </div>
          )}

          {/* STEP 2: Add First Dog */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-[#1B4332]">Add Your First Dog</h3>
                <p className="text-xs text-[#4A5568]">
                  Tell the Woof Pal community about your furry best friend.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Dog's Name *</label>
                <input
                  type="text"
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
                  placeholder="e.g. Bruno"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Breed *</label>
                <input
                  type="text"
                  value={dogBreed}
                  onChange={(e) => setDogBreed(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
                  placeholder="e.g. Golden Retriever, French Bulldog"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#1B4332] block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={dogAgeYears}
                    onChange={(e) => setDogAgeYears(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1B4332] block mb-1">Sex</label>
                  <select
                    value={dogSex}
                    onChange={(e) => setDogSex(e.target.value as DogSex)}
                    className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Dog Photo */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-[#1B4332]">Dog Photograph</h3>
                <p className="text-xs text-[#4A5568]">
                  A clear photograph helps owners assess size, breed appearance, and friendliness.
                </p>
              </div>

              <div className="flex justify-center py-2">
                <div className="w-36 h-36 rounded-3xl overflow-hidden border-2 border-[#1B4332] shadow-md">
                  <img src={selectedPhoto} alt="Selected dog" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1B4332] block">Select Demonstration Photo Preset</label>
                <div className="grid grid-cols-2 gap-2">
                  {samplePhotos.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhoto(preset.url)}
                      className={`p-2.5 rounded-xl text-xs border text-left flex items-center gap-2 cursor-pointer transition-colors ${
                        selectedPhoto === preset.url 
                          ? 'border-[#1B4332] bg-[#E8EFEA] font-semibold text-[#1B4332]' 
                          : 'border-[#E5E0D8] bg-white text-[#4B5563] hover:border-[#D9D3C7]'
                      }`}
                    >
                      <img src={preset.url} alt="" className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <span className="truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Dog Characteristics */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-[#1B4332]">Dog Characteristics</h3>
                <p className="text-xs text-[#4A5568]">
                  Matching by energy and play style prevents mismatched play sessions.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Size Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Small', 'Medium', 'Large'] as const).map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setDogSize(sz)}
                      className={`p-2.5 rounded-xl text-xs text-center border cursor-pointer ${
                        dogSize === sz ? 'bg-[#1B4332] text-white border-[#1B4332]' : 'bg-white border-[#E5E0D8] text-[#4B5563]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Energy Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Low', 'Moderate', 'High', 'Very High'] as const).map(en => (
                    <button
                      key={en}
                      type="button"
                      onClick={() => setDogEnergy(en)}
                      className={`p-2.5 rounded-xl text-xs text-center border cursor-pointer ${
                        dogEnergy === en ? 'bg-[#1B4332] text-white border-[#1B4332]' : 'bg-white border-[#E5E0D8] text-[#4B5563]'
                      }`}
                    >
                      {en}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Temperament Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Friendly', 'Gentle', 'Playful', 'Calm', 'Curious', 'Athletic', 'Biddable'].map(tag => {
                    const selected = temperament.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (selected) {
                            setTemperament(temperament.filter(t => t !== tag));
                          } else {
                            setTemperament([...temperament, tag]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs border cursor-pointer ${
                          selected ? 'bg-[#E8EFEA] border-[#1B4332] text-[#1B4332] font-semibold' : 'bg-white border-[#E5E0D8] text-[#6B7280]'
                        }`}
                      >
                        {tag} {selected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Dog Purpose */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-[#1B4332]">Select Primary Purpose</h3>
                <p className="text-xs text-[#4A5568]">
                  What are you primarily hoping to accomplish with this dog on Woof Pal?
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { 
                    id: 'playdates', 
                    title: '🎾 Playdates & Companionship', 
                    desc: 'Meet compatible neighborhood dogs for fetch, walks, and fun exercise.' 
                  },
                  { 
                    id: 'socialization', 
                    title: '🌱 Dog Socialization', 
                    desc: 'Help puppies or shy dogs build confidence through calm, structured exposure.' 
                  },
                  { 
                    id: 'breeding', 
                    title: '🧬 Responsible Pedigree Breeding', 
                    desc: 'Connect with verified breed guardians for health-screened pairing discussions.' 
                  },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPrimaryPurpose(opt.id as DogPurpose)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      primaryPurpose === opt.id 
                        ? 'bg-[#E8EFEA] border-[#1B4332] ring-2 ring-[#1B4332]/20' 
                        : 'bg-white border-[#E5E0D8] hover:border-[#D9D3C7]'
                    }`}
                  >
                    <p className="font-bold text-sm text-[#1B4332]">{opt.title}</p>
                    <p className="text-xs text-[#4A5568] mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Location & Preferences */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-[#1B4332]">Location & Discovery Radius</h3>
                <p className="text-xs text-[#4A5568]">
                  Set where you are located and how far you are willing to travel for a park playdate.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#1B4332] block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1B4332] block mb-1">Neighborhood Area</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#1B4332]">Discovery Radius:</span>
                  <span className="font-bold text-[#E07A5F]">{maxDistance} km</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="2"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-full h-2 bg-[#E5E0D8] rounded-lg appearance-none cursor-pointer accent-[#1B4332]"
                />
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl text-[11px] text-[#4B5563]">
                🐾 You can always adjust filters, add more dogs, or update your profile at any time in the app.
              </div>
            </div>
          )}

        </div>

        {/* Modal Wizard Navigation Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E5E0D8] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#4B5563] hover:bg-[#F0ECE1] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complete Onboarding</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
