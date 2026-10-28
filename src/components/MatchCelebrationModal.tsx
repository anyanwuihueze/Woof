import React from 'react';
import { Heart, MessageCircle, X } from 'lucide-react';
import { Dog, Match } from '../types';

interface MatchCelebrationModalProps {
  match: Match | null;
  activeDog: Dog;
  onClose: () => void;
  onStartChat: (match: Match) => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  match,
  activeDog,
  onClose,
  onStartChat,
}) => {
  if (!match) return null;
  const targetDog = match.targetDog;

  return (
    <div className="fixed inset-0 z-50 bg-[#194B38]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in zoom-in-95 duration-250">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-6 border border-white/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-[#FAF7F0] hover:bg-[#E8F0E9] text-[#536B60] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="space-y-2 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0E9] text-[#194B38] text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-[#E98779] text-[#E98779]" />
            <span>Mutual Canine Interest</span>
          </div>
          <h2 className="font-serif text-3xl font-black text-[#194B38] tracking-tight">
            It's a Woof Pal!
          </h2>
          <p className="text-sm text-[#536B60]">
            Both you and <strong>{targetDog.ownerName}</strong> showed mutual interest!
          </p>
        </div>

        {/* Side-by-Side Dogs Avatars with Animated Heart */}
        <div className="relative flex items-center justify-center gap-4 py-2">
          
          {/* Active Dog Avatar */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-24 h-24 rounded-full p-1 bg-white border-2 border-[#194B38] shadow-md overflow-hidden">
              <img
                src={activeDog.photos[0]}
                alt={activeDog.name}
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-serif font-bold text-base text-[#194B38]">{activeDog.name}</span>
          </div>

          {/* Central Heart Connector */}
          <div className="w-12 h-12 rounded-full bg-[#E98779] text-white flex items-center justify-center shadow-lg transform -translate-y-3 animate-pulse">
            <Heart className="w-6 h-6 fill-current" />
          </div>

          {/* Matched Dog Avatar */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-24 h-24 rounded-full p-1 bg-white border-2 border-[#E98779] shadow-md overflow-hidden">
              <img
                src={targetDog.photos[0]}
                alt={targetDog.name}
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-serif font-bold text-base text-[#194B38]">{targetDog.name}</span>
          </div>

        </div>

        {/* Location & Intent Reminder */}
        <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E8F0E9] text-xs text-[#536B60] space-y-1">
          <p className="font-semibold text-[#194B38]">
            🎾 {targetDog.name} is seeking {targetDog.primaryPurpose} in {targetDog.location.area}
          </p>
          <p className="text-[11px] text-[#536B60]">
            Say hi to {targetDog.ownerName} to discuss energy levels and plan an initial leashed park walk.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              onClose();
              onStartChat(match);
            }}
            className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-[#194B38] hover:bg-[#133A2B] text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Say Hello to {targetDog.ownerName}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full min-h-[44px] py-3 px-6 rounded-2xl bg-white hover:bg-[#FAF7F0] text-[#536B60] font-medium text-xs border border-[#E8F0E9] transition-colors cursor-pointer"
          >
            Keep Swiping Dogs
          </button>
        </div>

      </div>

    </div>
  );
};
