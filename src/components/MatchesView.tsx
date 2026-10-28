import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  UserX, 
  Calendar, 
  Compass
} from 'lucide-react';
import { Match, Dog } from '../types';
import { storageService } from '../services/storageService';

interface MatchesViewProps {
  matches: Match[];
  onOpenChat: (match: Match) => void;
  onOpenDogDetail: (dog: Dog) => void;
  onStartDiscovery: () => void;
  onRefreshMatches: () => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  onOpenChat,
  onOpenDogDetail,
  onStartDiscovery,
  onRefreshMatches,
}) => {
  const [selectedMatchToUnmatch, setSelectedMatchToUnmatch] = useState<Match | null>(null);

  const handleConfirmUnmatch = () => {
    if (!selectedMatchToUnmatch) return;
    storageService.unmatch(selectedMatchToUnmatch.id);
    setSelectedMatchToUnmatch(null);
    onRefreshMatches();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      
      {/* Page Title & Count Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#194B38] tracking-tight">Your Canine Matches</h2>
          <p className="text-xs text-[#536B60] mt-0.5">
            Mutual playmate connections ready for friendly park chats and meetups.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-white border border-[#E8F0E9] text-xs font-semibold text-[#194B38] shadow-2xs">
          {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
        </div>
      </div>

      {/* Matches Content: Grid or Empty State */}
      {matches.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8F0E9] p-10 text-center space-y-4 max-w-md mx-auto shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F0] text-[#E98779] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-[#194B38]">No matches yet</h3>
            <p className="text-xs text-[#536B60] leading-relaxed">
              Keep exploring the discovery feed! When you like another dog and their owner likes yours back, they'll appear here.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={onStartDiscovery}
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#194B38] hover:bg-[#133A2B] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 mx-auto transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Dog Profiles</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map(match => {
            const dog = match.targetDog;
            const matchDate = new Date(match.matchedAt).toLocaleDateString(undefined, { 
              month: 'short', 
              day: 'numeric' 
            });

            return (
              <div
                key={match.id}
                className="bg-white rounded-3xl border border-[#E8F0E9] p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                {/* Dog & Owner Info */}
                <div className="flex items-start gap-4">
                  
                  {/* Clickable Dog Photo */}
                  <button
                    onClick={() => onOpenDogDetail(dog)}
                    className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-[#E8F0E9] shrink-0 relative group-hover:opacity-95 transition-opacity cursor-pointer"
                    title={`View ${dog.name}'s profile`}
                  >
                    <img
                      src={dog.photos[0]}
                      alt={dog.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>

                  {/* Text details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => onOpenDogDetail(dog)}
                        className="text-left font-serif font-bold text-base text-[#194B38] hover:underline truncate cursor-pointer"
                      >
                        {dog.name}
                      </button>
                      
                      <button
                        onClick={() => setSelectedMatchToUnmatch(match)}
                        className="p-1 text-[#536B60] hover:text-[#DC2626] rounded-md transition-colors cursor-pointer"
                        title="Unmatch"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-[#536B60] truncate">
                      {dog.breed} · {dog.size}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#536B60] mt-1">
                      <span>Owner: <strong>{dog.ownerName}</strong></span>
                      <span>·</span>
                      <span className="truncate">{dog.location.area}</span>
                    </div>

                    {match.lastMessage && (
                      <p className="text-xs text-[#24352D] bg-[#FAF7F0] p-2 rounded-xl border border-[#E8F0E9] mt-2 line-clamp-1 italic">
                        "{match.lastMessage}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Match Bottom Bar & Action */}
                <div className="pt-3 border-t border-[#E8F0E9] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[#536B60] text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Matched {matchDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDogDetail(dog)}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#536B60] hover:bg-[#FAF7F0] transition-colors cursor-pointer"
                    >
                      Profile
                    </button>
                    
                    <button
                      onClick={() => onOpenChat(match)}
                      className="min-h-[40px] px-4 py-1.5 rounded-xl bg-[#194B38] hover:bg-[#133A2B] text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Unmatch Confirmation Dialog */}
      {selectedMatchToUnmatch && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-[#E8F0E9]">
            <h4 className="font-serif text-lg font-bold text-[#194B38]">
              Unmatch with {selectedMatchToUnmatch.targetDog.name}?
            </h4>
            <p className="text-xs text-[#536B60] leading-relaxed">
              This will remove {selectedMatchToUnmatch.targetDog.name} and {selectedMatchToUnmatch.targetDog.ownerName} from your matches. They won't be notified, but you won't be able to message each other.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedMatchToUnmatch(null)}
                className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold text-[#536B60] hover:bg-[#FAF7F0] transition-colors cursor-pointer"
              >
                Keep Match
              </button>
              <button
                onClick={handleConfirmUnmatch}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#DC2626] text-white text-xs font-semibold hover:bg-[#B91C1C] transition-colors cursor-pointer"
              >
                Unmatch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
