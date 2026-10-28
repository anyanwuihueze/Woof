import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  MapPin, 
  RotateCcw,
  Lock,
  Download,
  ExternalLink
} from 'lucide-react';
import { OwnerProfile, Dog } from '../types';
import { storageService } from '../services/storageService';

interface OwnerProfileViewProps {
  currentUser: OwnerProfile;
  userDogs: Dog[];
  activeDog: Dog;
  onSelectActiveDog: (dogId: string) => void;
  onOpenAddDog: () => void;
  onOpenEditDog: (dog: Dog) => void;
  onUpdateUser: (profile: Partial<OwnerProfile>) => void;
  onOpenSafetyModal: () => void;
  onStartDiscovery: () => void;
}

export const OwnerProfileView: React.FC<OwnerProfileViewProps> = ({
  currentUser,
  userDogs,
  activeDog,
  onSelectActiveDog,
  onOpenAddDog,
  onOpenEditDog,
  onUpdateUser,
  onOpenSafetyModal,
  onStartDiscovery,
}) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedName, setEditedName] = useState(currentUser.displayName);
  const [editedBio, setEditedBio] = useState(currentUser.bio);
  const [editedArea, setEditedArea] = useState(currentUser.area);

  const handleSaveProfile = () => {
    onUpdateUser({
      displayName: editedName,
      bio: editedBio,
      area: editedArea,
    });
    setIsEditingBio(false);
  };

  const handleTogglePrivacy = (key: keyof OwnerProfile['privacySettings']) => {
    onUpdateUser({
      privacySettings: {
        ...currentUser.privacySettings,
        [key]: !currentUser.privacySettings[key],
      }
    });
  };

  const handleDeleteDog = (dogId: string, dogName: string) => {
    if (userDogs.length <= 1) {
      alert("You need at least one dog profile on PawMatch.");
      return;
    }
    if (window.confirm(`Are you sure you want to remove ${dogName}'s profile?`)) {
      storageService.deleteUserDog(dogId);
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-7">
      
      {/* Owner Header Card */}
      <div className="bg-white rounded-3xl border border-[#E8F0E9] p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-[#194B38] shadow-xs shrink-0">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={currentUser.displayName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-black text-[#194B38]">{currentUser.displayName}</h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E8F0E9] text-[#194B38]">
                  Dog Guardian
                </span>
              </div>
              <p className="text-xs text-[#536B60] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E98779]" />
                <span>{currentUser.area}, {currentUser.city}</span>
                <span>·</span>
                <span>Member since {currentUser.joinedDate}</span>
              </p>
              <p className="text-xs text-[#536B60]">
                {currentUser.email} {currentUser.phone && `· ${currentUser.phone}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingBio(!isEditingBio)}
            className="min-h-[40px] px-4 py-2 rounded-xl border border-[#D1E0D3] text-xs font-semibold text-[#194B38] hover:bg-[#FAF7F0] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingBio ? 'Cancel' : 'Edit Profile'}</span>
          </button>

        </div>

        {/* Bio Edit Form or Display */}
        {isEditingBio ? (
          <div className="mt-6 pt-6 border-t border-[#E8F0E9] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#194B38] block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8F0E9] text-xs focus:outline-none focus:border-[#194B38] bg-[#FAF7F0] text-[#24352D]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#194B38] block mb-1">Neighborhood / District</label>
                <input
                  type="text"
                  value={editedArea}
                  onChange={(e) => setEditedArea(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8F0E9] text-xs focus:outline-none focus:border-[#194B38] bg-[#FAF7F0] text-[#24352D]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#194B38] block mb-1">Introduction</label>
              <textarea
                rows={3}
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8F0E9] text-xs focus:outline-none focus:border-[#194B38] bg-[#FAF7F0] text-[#24352D]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditingBio(false)}
                className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-medium text-[#536B60] hover:bg-[#FAF7F0] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="min-h-[40px] px-5 py-2 rounded-xl bg-[#194B38] text-white text-xs font-semibold hover:bg-[#133A2B] transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t border-[#E8F0E9]">
            <p className="text-sm text-[#24352D] leading-relaxed">
              {currentUser.bio}
            </p>
          </div>
        )}
      </div>

      {/* Dog Management Section */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#194B38]">My Dog Profiles ({userDogs.length})</h3>
            <p className="text-xs text-[#536B60]">
              Select which dog you are currently swiping and matching with.
            </p>
          </div>

          <button
            onClick={onOpenAddDog}
            className="min-h-[40px] px-4 py-2 bg-[#194B38] hover:bg-[#133A2B] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Dog</span>
          </button>
        </div>

        {/* Dogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userDogs.map(dog => {
            const isActive = dog.id === activeDog.id;

            return (
              <div
                key={dog.id}
                className={`rounded-3xl border p-5 transition-all flex flex-col justify-between ${
                  isActive 
                    ? 'bg-white border-[#194B38] shadow-md ring-2 ring-[#194B38]/20' 
                    : 'bg-white border-[#E8F0E9] shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-[#E8F0E9] shrink-0">
                    <img
                      src={dog.photos[0]}
                      alt={dog.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-base text-[#194B38] truncate">{dog.name}</h4>
                      {isActive ? (
                        <span className="text-[10px] font-bold text-[#194B38] bg-[#E8F0E9] px-2.5 py-0.5 rounded-full">
                          Currently Active
                        </span>
                      ) : (
                        <button
                          onClick={() => onSelectActiveDog(dog.id)}
                          className="text-xs font-semibold text-[#194B38] hover:underline cursor-pointer"
                        >
                          Make Active
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-[#536B60] truncate">
                      {dog.breed} · {dog.ageYears}y {dog.ageMonths > 0 ? `${dog.ageMonths}m` : ''} · {dog.sex}
                    </p>

                    <p className="text-[11px] text-[#536B60] mt-1 capitalize">
                      Purpose: {dog.primaryPurpose} · {dog.size} ({dog.energyLevel} energy)
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-[#E8F0E9] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#194B38]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{dog.vaccinationStatus.replace(/_/g, ' ')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenEditDog(dog)}
                      className="min-h-[36px] px-3 py-1.5 rounded-xl border border-[#D1E0D3] text-[#194B38] hover:bg-[#FAF7F0] transition-colors cursor-pointer"
                    >
                      Edit Dog
                    </button>

                    {userDogs.length > 1 && (
                      <button
                        onClick={() => handleDeleteDog(dog.id, dog.name)}
                        className="p-1.5 text-[#536B60] hover:text-[#DC2626] transition-colors cursor-pointer"
                        title="Delete dog"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Privacy and Trust Controls */}
      <div className="bg-white rounded-3xl border border-[#E8F0E9] p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#194B38]" />
          <h3 className="font-serif text-base font-bold text-[#194B38]">Privacy & Discovery Controls</h3>
        </div>

        <div className="space-y-3 divide-y divide-[#E8F0E9]">
          
          <div className="pt-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#24352D]">Show Approximate Neighbourhood</p>
              <p className="text-[11px] text-[#536B60]">Displays area like '{currentUser.area}' instead of coordinates.</p>
            </div>
            <input
              type="checkbox"
              checked={currentUser.privacySettings.showExactArea}
              onChange={() => handleTogglePrivacy('showExactArea')}
              className="w-4 h-4 accent-[#194B38] cursor-pointer"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#24352D]">Show Contact Info to Mutual Matches Only</p>
              <p className="text-[11px] text-[#536B60]">Prevents non-matched profiles from seeing your phone or full name.</p>
            </div>
            <input
              type="checkbox"
              checked={currentUser.privacySettings.showPhoneToMatchesOnly}
              onChange={() => handleTogglePrivacy('showPhoneToMatchesOnly')}
              className="w-4 h-4 accent-[#194B38] cursor-pointer"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#24352D]">Allow Responsible Breeding Inquiries</p>
              <p className="text-[11px] text-[#536B60]">Permits verified members to send pedigree/breeding messages.</p>
            </div>
            <input
              type="checkbox"
              checked={currentUser.privacySettings.allowBreedingInquiries}
              onChange={() => handleTogglePrivacy('allowBreedingInquiries')}
              className="w-4 h-4 accent-[#194B38] cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* Export & Deploy to GitHub / Vercel Card */}
      <div className="bg-white rounded-3xl border border-[#E8F0E9] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8F0E9] pb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#194B38]">Export & Deploy to Vercel</h3>
            <p className="text-xs text-[#536B60]">Download your complete codebase or push it to your GitHub repository.</p>
          </div>
          <a
            href="/pawmatch-project.zip"
            download="pawmatch-project.zip"
            className="px-4 py-2.5 rounded-xl bg-[#194B38] text-white text-xs font-semibold hover:bg-[#133A2B] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Project ZIP</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E8F0E9] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#194B38]">Target GitHub Repo:</span>
              <a
                href="https://github.com/anyanwuihueze/Woof"
                target="_blank"
                rel="noreferrer"
                className="text-[#194B38] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>anyanwuihueze/Woof</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-[#536B60] leading-relaxed">
              Unzip the downloaded file, open your repo, and drag-and-drop the files into GitHub using the "uploading an existing file" link.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E8F0E9] space-y-1.5">
            <span className="font-bold text-[#194B38]">Vercel Deployment:</span>
            <p className="text-[11px] text-[#536B60] leading-relaxed">
              Configured with <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#E8F0E9]">vercel.json</code> SPA rewrites so page refreshes and direct links never 404.
            </p>
          </div>
        </div>
      </div>

      {/* Safety & Demonstration Reset Footer */}
      <div className="bg-[#FAF7F0] rounded-3xl border border-[#E8F0E9] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif text-xs font-bold text-[#194B38] uppercase tracking-wider">Demonstration Management</h4>
          <p className="text-xs text-[#536B60] mt-0.5">
            Reset candidate deck, mock likes, passes, and conversations to test a fresh onboarding walkthrough.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm("Reset all test swipes, matches, and custom dogs back to pristine demo state?")) {
              storageService.resetAllDemoData();
            }
          }}
          className="min-h-[40px] px-4 py-2.5 rounded-xl bg-white border border-[#D1E0D3] text-xs font-semibold text-[#DC2626] hover:bg-[#FDF2F2] transition-colors cursor-pointer flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demonstration Data</span>
        </button>
      </div>

    </div>
  );
};
