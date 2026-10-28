import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  ShieldCheck, 
  Dna, 
  Sparkles, 
  MapPin, 
  Info,
  Check
} from 'lucide-react';
import { 
  Dog, 
  DogSex, 
  DogSize, 
  EnergyLevel, 
  DogPurpose, 
  VaccinationStatus 
} from '../types';

interface AddEditDogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dogData: any) => void;
  initialDog?: Dog | null;
}

export const AddEditDogModal: React.FC<AddEditDogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDog,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(initialDog);

  const [name, setName] = useState(initialDog?.name || '');
  const [breed, setBreed] = useState(initialDog?.breed || '');
  const [isMixedBreed, setIsMixedBreed] = useState(initialDog?.isMixedBreed || false);
  const [ageYears, setAgeYears] = useState(initialDog?.ageYears ?? 2);
  const [ageMonths, setAgeMonths] = useState(initialDog?.ageMonths ?? 0);
  const [sex, setSex] = useState<DogSex>(initialDog?.sex || 'male');
  const [size, setSize] = useState<DogSize>(initialDog?.size || 'Medium');
  const [weightKg, setWeightKg] = useState<number | undefined>(initialDog?.weightKg || 18);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(initialDog?.energyLevel || 'Moderate');
  const [primaryPurpose, setPrimaryPurpose] = useState<DogPurpose>(initialDog?.primaryPurpose || 'playdates');
  const [bio, setBio] = useState(initialDog?.bio || '');
  const [area, setArea] = useState(initialDog?.location.area || 'Lekki Phase 1');
  const [photoUrl, setPhotoUrl] = useState(
    initialDog?.photos[0] || '/images/golden_retriever_profile_1792932440339.jpg'
  );

  // Temperament tags
  const [temperamentList, setTemperamentList] = useState<string[]>(
    initialDog?.temperament || ['Friendly', 'Playful', 'Gentle']
  );
  const [newTagInput, setNewTagInput] = useState('');

  // Health & Vaccinations
  const [vaccinationStatus, setVaccinationStatus] = useState<VaccinationStatus>(
    initialDog?.vaccinationStatus || 'owner_reported_up_to_date'
  );
  const [rabiesVaccinated, setRabiesVaccinated] = useState(initialDog?.healthScreening.rabiesVaccinated ?? true);
  const [dhppVaccinated, setDhppVaccinated] = useState(initialDog?.healthScreening.dhppVaccinated ?? true);
  const [dewormedRecently, setDewormedRecently] = useState(initialDog?.healthScreening.dewormedRecently ?? true);
  const [spayedOrNeutered, setSpayedOrNeutered] = useState(initialDog?.healthScreening.spayedOrNeutered ?? false);
  const [microchipped, setMicrochipped] = useState(initialDog?.healthScreening.microchipped ?? true);
  const [vetName, setVetName] = useState(initialDog?.healthScreening.vetName || 'Lekki Pet Care Clinic');

  // Responsible Breeding
  const [pedigreeRegistered, setPedigreeRegistered] = useState(initialDog?.responsibleBreedingInfo?.pedigreeRegistered ?? false);
  const [pedigreeClubName, setPedigreeClubName] = useState(initialDog?.responsibleBreedingInfo?.pedigreeClubName || '');
  const [registrationNumber, setRegistrationNumber] = useState(initialDog?.responsibleBreedingInfo?.registrationNumber || '');
  const [dnaScreeningConducted, setDnaScreeningConducted] = useState(initialDog?.responsibleBreedingInfo?.dnaScreeningConducted ?? false);
  const [hipElbowScoreAvailable, setHipElbowScoreAvailable] = useState(initialDog?.responsibleBreedingInfo?.hipElbowScoreAvailable ?? false);
  const [vetBreedingClearance, setVetBreedingClearance] = useState(initialDog?.responsibleBreedingInfo?.vetBreedingClearance ?? false);
  const [ethicalAgreementAccepted, setEthicalAgreementAccepted] = useState(
    initialDog?.responsibleBreedingInfo?.ethicalBreedingAgreementAccepted ?? false
  );
  const [studOrDamTerms, setStudOrDamTerms] = useState(initialDog?.responsibleBreedingInfo?.studOrDamTerms || '');

  const photoPresets = [
    { label: 'Golden Retriever', url: '/images/golden_retriever_profile_1792932440339.jpg' },
    { label: 'French Bulldog', url: '/images/french_bulldog_profile_1792932441788.jpg' },
    { label: 'German Shepherd', url: '/images/german_shepherd_profile_1792932441892.jpg' },
    { label: 'Cavapoo / Poodle', url: '/images/poodle_maltese_profile_1792932441976.jpg' },
    { label: 'Park Play Buddies', url: '/images/pawmatch_hero_dog_1792932440583.jpg' }
  ];

  const handleAddTemperament = () => {
    if (newTagInput.trim() && !temperamentList.includes(newTagInput.trim())) {
      setTemperamentList([...temperamentList, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTemperament = (tag: string) => {
    setTemperamentList(temperamentList.filter(t => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter your dog’s name');
    if (!breed.trim()) return alert('Please specify the breed');

    if (primaryPurpose === 'breeding' && !ethicalAgreementAccepted) {
      return alert('You must read and accept the Ethical Breeding Declaration before listing for breeding.');
    }

    const payload = {
      name: name.trim(),
      breed: breed.trim(),
      isMixedBreed,
      ageYears: Number(ageYears),
      ageMonths: Number(ageMonths),
      sex,
      size,
      weightKg: weightKg ? Number(weightKg) : undefined,
      temperament: temperamentList,
      energyLevel,
      favoriteActivities: initialDog?.favoriteActivities || ['Fetch', 'Park walks', 'Tug toys'],
      photos: [photoUrl],
      bio: bio.trim() || `${name} is a friendly ${breed} who loves social play and meeting other dogs.`,
      primaryPurpose,
      location: {
        city: 'Lagos',
        area: area.trim(),
        approximateDistanceKm: initialDog?.location.approximateDistanceKm || 0,
      },
      vaccinationStatus,
      healthScreening: {
        rabiesVaccinated,
        dhppVaccinated,
        dewormedRecently,
        spayedOrNeutered,
        microchipped,
        vetName,
      },
      ...(primaryPurpose === 'breeding' ? {
        responsibleBreedingInfo: {
          pedigreeRegistered,
          pedigreeClubName,
          registrationNumber,
          dnaScreeningConducted,
          hipElbowScoreAvailable,
          eyeCertificationAvailable: false,
          vetBreedingClearance,
          breedingExperience: 'First time' as const,
          ethicalBreedingAgreementAccepted: ethicalAgreementAccepted,
          studOrDamTerms,
        }
      } : {})
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E5E0D8] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E5E0D8] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <h3 className="text-lg font-bold text-[#1B4332]">
              {isEditing ? `Edit ${initialDog?.name}'s Profile` : 'Add a New Dog Profile'}
            </h3>
            <p className="text-xs text-[#6B7280]">
              Create an honest, attractive profile for canine discovery.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#F0ECE1] text-[#4B5563] flex items-center justify-center transition-colors cursor-pointer border border-[#E5E0D8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-[#1A202C]">
          
          {/* Basic Identity */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">1. Dog Identity</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Dog Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bruno, Simba, Coco"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Breed *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Golden Retriever, Beagle, Boerboel"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isMixed"
                checked={isMixedBreed}
                onChange={(e) => setIsMixedBreed(e.target.checked)}
                className="w-4 h-4 accent-[#1B4332] cursor-pointer"
              />
              <label htmlFor="isMixed" className="text-xs text-[#4B5563] cursor-pointer">
                This is a crossbreed or mixed breed dog
              </label>
            </div>

            {/* Age, Sex, Size */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Age (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={ageYears}
                  onChange={(e) => setAgeYears(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Age (Months)</label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Sex</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as DogSex)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Size Category</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as DogSize)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
                >
                  <option value="Toy">Toy (&lt;5kg)</option>
                  <option value="Small">Small (5-12kg)</option>
                  <option value="Medium">Medium (12-25kg)</option>
                  <option value="Large">Large (25-45kg)</option>
                  <option value="Giant">Giant (&gt;45kg)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Energy Level</label>
                <select
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(e.target.value as EnergyLevel)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
                >
                  <option value="Low">Low (Calm couch buddy)</option>
                  <option value="Moderate">Moderate (Daily brisk walk)</option>
                  <option value="High">High (Energetic runner)</option>
                  <option value="Very High">Very High (Boundless sports drive)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">General Area (Lagos)</label>
                <input
                  type="text"
                  placeholder="e.g. Lekki Phase 1, Victoria Island, Ikeja GRA"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
                />
              </div>
            </div>

          </div>

          {/* Profile Photo Selection */}
          <div className="space-y-3 pt-4 border-t border-[#F0ECE1]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">2. Dog Photograph</h4>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-[#1B4332] shrink-0">
                <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-xs text-[#6B7280]">Select from high-fidelity photo presets or paste an image URL:</p>
                <div className="flex flex-wrap gap-1.5">
                  {photoPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(preset.url)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] border cursor-pointer transition-colors ${
                        photoUrl === preset.url ? 'bg-[#1B4332] text-white border-[#1B4332]' : 'bg-white text-[#4B5563] border-[#E5E0D8]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Temperament & Bio */}
          <div className="space-y-3 pt-4 border-t border-[#F0ECE1]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">3. Temperament & Bio</h4>
            
            <div className="flex flex-wrap gap-1.5">
              {temperamentList.map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-[#E8EFEA] text-[#1B4332] text-xs flex items-center gap-1.5">
                  <span>{tag}</span>
                  <button type="button" onClick={() => handleRemoveTemperament(tag)} className="hover:text-red-600 cursor-pointer">×</button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add trait (e.g. Cuddle bug, Ball obsessed, Gentle)..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTemperament();
                  }
                }}
                className="flex-1 p-2 rounded-xl border border-[#E5E0D8] text-xs bg-[#FAF8F5]"
              />
              <button
                type="button"
                onClick={handleAddTemperament}
                className="px-3 py-2 bg-[#FAF8F5] border border-[#D9D3C7] rounded-xl text-xs font-semibold text-[#1B4332] hover:bg-[#F0ECE1] cursor-pointer"
              >
                Add
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1B4332] block mb-1">Personality Bio</label>
              <textarea
                rows={3}
                placeholder="Describe your dog's play style, habits, and who they get along best with..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E5E0D8] text-xs focus:outline-none focus:border-[#1B4332] bg-[#FAF8F5]"
              />
            </div>
          </div>

          {/* Primary Purpose */}
          <div className="space-y-3 pt-4 border-t border-[#F0ECE1]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">4. Primary Purpose on Woof Pal</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'playdates', title: '🎾 Playdates', desc: 'Find exercise buddies and park playmates.' },
                { id: 'socialization', title: '🌱 Socialization', desc: 'Positive exposure to other well-mannered dogs.' },
                { id: 'breeding', title: '🧬 Responsible Breeding', desc: 'Ethical pedigree pairing with health clearances.' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPrimaryPurpose(opt.id as DogPurpose)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    primaryPurpose === opt.id 
                      ? 'bg-[#E8EFEA] border-[#1B4332] ring-1 ring-[#1B4332]' 
                      : 'bg-white border-[#E5E0D8] hover:border-[#D9D3C7]'
                  }`}
                >
                  <p className="font-bold text-xs text-[#1B4332]">{opt.title}</p>
                  <p className="text-[11px] text-[#6B7280] mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Health & Vaccination Status */}
          <div className="space-y-3 pt-4 border-t border-[#F0ECE1]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">5. Health & Vaccines</h4>
            </div>

            <p className="text-[11px] text-[#6B7280]">
              All profiles clearly indicate owner-reported status until audited by a licensed veterinary clinic.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rabiesVaccinated}
                  onChange={(e) => setRabiesVaccinated(e.target.checked)}
                  className="w-4 h-4 accent-[#1B4332]"
                />
                <span>Rabies Up-to-Date</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={dhppVaccinated}
                  onChange={(e) => setDhppVaccinated(e.target.checked)}
                  className="w-4 h-4 accent-[#1B4332]"
                />
                <span>DHPP Core Vaccines</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={dewormedRecently}
                  onChange={(e) => setDewormedRecently(e.target.checked)}
                  className="w-4 h-4 accent-[#1B4332]"
                />
                <span>Recent Deworming</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={spayedOrNeutered}
                  onChange={(e) => setSpayedOrNeutered(e.target.checked)}
                  className="w-4 h-4 accent-[#1B4332]"
                />
                <span>Spayed / Neutered</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={microchipped}
                  onChange={(e) => setMicrochipped(e.target.checked)}
                  className="w-4 h-4 accent-[#1B4332]"
                />
                <span>Microchipped</span>
              </label>
            </div>
          </div>

          {/* Responsible Breeding Mode Form */}
          {primaryPurpose === 'breeding' && (
            <div className="space-y-4 pt-4 border-t-2 border-[#1B4332] bg-[#F7FAF8] p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-[#1B4332]">
                <Dna className="w-5 h-5 text-[#2D6A4F]" />
                <h4 className="text-sm font-bold">Responsible Breeding Disclosures</h4>
              </div>

              <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#991B1B] leading-relaxed">
                Woof Pal does not provide medical clearances or certify breeding suitability through automated scoring. Both owners must consult qualified veterinarians and review physical documentation.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Pedigree Club Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kennel Club of West Africa"
                    value={pedigreeClubName}
                    onChange={(e) => setPedigreeClubName(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#D1E2D7] bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Registration / Studbook Number</label>
                  <input
                    type="text"
                    placeholder="e.g. KCWA-GSD-2023-XXXX"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#D1E2D7] bg-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dnaScreeningConducted}
                    onChange={(e) => setDnaScreeningConducted(e.target.checked)}
                    className="w-4 h-4 accent-[#1B4332]"
                  />
                  <span>DNA panel completed (breed-specific genetic markers)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hipElbowScoreAvailable}
                    onChange={(e) => setHipElbowScoreAvailable(e.target.checked)}
                    className="w-4 h-4 accent-[#1B4332]"
                  />
                  <span>Hips & Elbows certified by recognized registry (OFA / BVA / SABBS)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vetBreedingClearance}
                    onChange={(e) => setVetBreedingClearance(e.target.checked)}
                    className="w-4 h-4 accent-[#1B4332]"
                  />
                  <span>Recent physical examination cleared dog for breeding</span>
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B4332] block mb-1">Breeding Requirements & Terms</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Stud service strictly to health-screened registered dams with veterinary contract..."
                  value={studOrDamTerms}
                  onChange={(e) => setStudOrDamTerms(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#D1E2D7] bg-white text-xs"
                />
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#D1E2D7] flex items-start gap-2">
                <input
                  type="checkbox"
                  id="ethicalAgree"
                  checked={ethicalAgreementAccepted}
                  onChange={(e) => setEthicalAgreementAccepted(e.target.checked)}
                  className="w-4 h-4 accent-[#1B4332] mt-0.5 cursor-pointer"
                />
                <label htmlFor="ethicalAgree" className="text-xs text-[#374151] cursor-pointer">
                  <strong>Ethical Breeding Commitment:</strong> I confirm I am not operating an illegal animal mill or unauthorized commercial broker operation. I will adhere to animal welfare guidelines and veterinary supervision.
                </label>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#E5E0D8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs font-semibold text-[#4B5563] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {isEditing ? 'Save Dog Changes' : 'Create Dog Profile'}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
