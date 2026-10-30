import React from 'react';
import { 
  X, 
  HeartHandshake, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  FileText,
  MessageSquare
} from 'lucide-react';
import { MatingRequest, Dog } from '../types';

interface MatingConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: MatingRequest | null;
  onOpenChat?: (partnerDog: Dog, partnerOwnerName: string) => void;
}

export const MatingConnectionModal: React.FC<MatingConnectionModalProps> = ({
  isOpen,
  onClose,
  request,
  onOpenChat,
}) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E8F0E9] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#194B38] text-white px-6 py-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-full bg-white/15 mx-auto flex items-center justify-center mb-3">
            <HeartHandshake className="w-9 h-9 text-[#E98779]" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0] bg-white/10 px-3 py-1 rounded-full">
            Connection Confirmed
          </span>
          <h3 className="font-serif text-2xl font-bold mt-2">Mating Request Accepted!</h3>
          <p className="text-xs text-white/80 max-w-sm mx-auto mt-1">
            Both owners have agreed to explore this planned pairing under responsible breeding guidelines.
          </p>
        </div>

        {/* Pairing Summary */}
        <div className="p-6 bg-[#FAF7F0] border-b border-[#E8F0E9]">
          <div className="flex items-center justify-around gap-2 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border-2 border-[#194B38] shadow-xs mb-1.5">
                <img 
                  src={request.fromDog.photos[0]} 
                  alt={request.fromDog.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-serif font-bold text-sm text-[#194B38]">{request.fromDog.name}</p>
              <p className="text-[11px] text-[#536B60]">{request.fromDog.breed}</p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="text-xl">🧬</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#194B38] mt-1">Paired</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border-2 border-[#194B38] shadow-xs mb-1.5">
                <img 
                  src={request.toDog.photos[0]} 
                  alt={request.toDog.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-serif font-bold text-sm text-[#194B38]">{request.toDog.name}</p>
              <p className="text-[11px] text-[#536B60]">{request.toDog.breed}</p>
            </div>
          </div>

          {/* Agreed Terms Strip */}
          <div className="mt-4 p-3 bg-white rounded-xl border border-[#E8F0E9] space-y-1 text-xs">
            <span className="font-semibold text-[#194B38]">Agreed Terms:</span>
            <p className="text-[#24352D]">{request.termsProposed}</p>
          </div>
        </div>

        {/* Contact & Next Steps Body */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-serif text-sm font-bold text-[#194B38] mb-2">Direct Partner Contact Details</h4>
            <div className="bg-[#FAF7F0] rounded-2xl border border-[#E8F0E9] p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#536B60]">Owner:</span>
                <span className="font-bold text-[#24352D]">{request.toOwnerName}</span>
              </div>
              {request.toOwnerPhone && (
                <div className="flex items-center justify-between">
                  <span className="text-[#536B60] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#194B38]" />
                    <span>Phone:</span>
                  </span>
                  <a href={`tel:${request.toOwnerPhone}`} className="font-semibold text-[#194B38] hover:underline">
                    {request.toOwnerPhone}
                  </a>
                </div>
              )}
              {request.toOwnerEmail && (
                <div className="flex items-center justify-between">
                  <span className="text-[#536B60] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#194B38]" />
                    <span>Email:</span>
                  </span>
                  <a href={`mailto:${request.toOwnerEmail}`} className="font-semibold text-[#194B38] hover:underline">
                    {request.toOwnerEmail}
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[#536B60] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#194B38]" />
                  <span>Area:</span>
                </span>
                <span className="font-medium text-[#24352D]">{request.toDog.location.area}, {request.toDog.location.city}</span>
              </div>
            </div>
          </div>

          {/* Responsible Breeding Steps Checklist */}
          <div className="space-y-2">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#536B60]">
              Next Steps for Ethical Breeding
            </h4>
            <div className="space-y-1.5 text-xs text-[#24352D]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#194B38] shrink-0 mt-0.5" />
                <span>Schedule a joint pre-breeding health exam with a licensed veterinary clinic.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#194B38] shrink-0 mt-0.5" />
                <span>Exchange official kennel club registration documents and DNA testing records.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#194B38] shrink-0 mt-0.5" />
                <span>Sign a written breeding agreement outlining stud fee or puppy allocations in advance.</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E8F0E9]">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#536B60] hover:text-[#24352D] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                if (onOpenChat) {
                  onOpenChat(request.toDog, request.toOwnerName);
                }
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#194B38] text-white text-xs font-semibold hover:bg-[#133A2B] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message Owner</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
