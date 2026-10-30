import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  HeartHandshake, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  Send
} from 'lucide-react';
import { Dog, MatingRequest } from '../types';
import { storageService } from '../services/storageService';

interface SendMatingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  senderDog: Dog;
  partnerDog: Dog;
  onSuccess: (request: MatingRequest) => void;
}

export const SendMatingRequestModal: React.FC<SendMatingRequestModalProps> = ({
  isOpen,
  onClose,
  senderDog,
  partnerDog,
  onSuccess,
}) => {
  const [termsProposed, setTermsProposed] = useState('Stud fee: ₦250,000 upon confirmed pregnancy');
  const [healthCertAttached, setHealthCertAttached] = useState(true);
  const [pedigreeAttached, setPedigreeAttached] = useState(true);
  const [note, setNote] = useState('');
  const [ethicsConfirmed, setEthicsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ethicsConfirmed) {
      setError('You must review and agree to the Responsible Breeding Code of Ethics.');
      return;
    }
    if (!termsProposed.trim()) {
      setError('Please specify proposed breeding terms or stud agreement.');
      return;
    }

    const created = storageService.sendMatingRequest({
      fromDog: senderDog,
      toDog: partnerDog,
      termsProposed: termsProposed.trim(),
      healthCertAttached,
      pedigreeAttached,
      note: note.trim() || `Hello ${partnerDog.ownerName}! We are interested in exploring an ethical breeding pairing between ${senderDog.name} and ${partnerDog.name}.`,
    });

    onSuccess(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E8F0E9] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#194B38] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white">
              <HeartHandshake className="w-5 h-5 text-[#E98779]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">Propose Mating Request</h3>
              <p className="text-xs text-white/75">Responsible pedigree pairing inquiry</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pairing Visual Comparison */}
        <div className="bg-[#FAF7F0] border-b border-[#E8F0E9] px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Sender Dog */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-[#E8F0E9] shrink-0">
                <img 
                  src={senderDog.photos[0]} 
                  alt={senderDog.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#536B60]">Your Dog</span>
                <p className="font-serif font-bold text-sm text-[#194B38]">{senderDog.name}</p>
                <p className="text-[11px] text-[#536B60] capitalize">{senderDog.breed} · {senderDog.sex}</p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white border border-[#E8F0E9] flex items-center justify-center text-[#E98779] shadow-2xs font-bold text-xs">
              &amp;
            </div>

            {/* Target Partner Dog */}
            <div className="flex items-center gap-3 text-right">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#536B60]">Partner</span>
                <p className="font-serif font-bold text-sm text-[#194B38]">{partnerDog.name}</p>
                <p className="text-[11px] text-[#536B60] capitalize">{partnerDog.breed} · {partnerDog.sex}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-[#E8F0E9] shrink-0">
                <img 
                  src={partnerDog.photos[0]} 
                  alt={partnerDog.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Partner terms notice */}
          {partnerDog.responsibleBreedingInfo?.studOrDamTerms && (
            <div className="mt-3 p-2.5 bg-white rounded-xl border border-[#E8F0E9] text-[11px] text-[#536B60]">
              <span className="font-semibold text-[#194B38]">Partner's Stated Terms: </span>
              {partnerDog.responsibleBreedingInfo.studOrDamTerms}
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-[#FDF2F0] border border-[#E98779]/40 rounded-xl flex items-center gap-2 text-xs text-[#DC2626]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Proposed Terms */}
          <div>
            <label className="block text-xs font-bold text-[#24352D] mb-1">
              Proposed Breeding Terms <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={termsProposed}
              onChange={(e) => setTermsProposed(e.target.value)}
              placeholder="e.g. Stud fee, pick of litter, co-ownership terms..."
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F0] border border-[#E8F0E9] rounded-xl focus:outline-none focus:border-[#194B38] text-[#24352D]"
              required
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                'Standard stud fee',
                'Pick of the litter',
                'Second pick of litter',
                'Mutual pup share (50/50)'
              ].map((chip) => (
                <button
                  type="button"
                  key={chip}
                  onClick={() => setTermsProposed(chip)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-white border border-[#E8F0E9] hover:border-[#194B38] text-[#536B60] hover:text-[#194B38] cursor-pointer transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Documents Attached */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold text-[#24352D]">
              Included Documentation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E8F0E9] bg-[#FAF7F0] cursor-pointer">
                <input
                  type="checkbox"
                  checked={healthCertAttached}
                  onChange={(e) => setHealthCertAttached(e.target.checked)}
                  className="w-4 h-4 accent-[#194B38]"
                />
                <ShieldCheck className="w-4 h-4 text-[#194B38]" />
                <span className="text-xs text-[#24352D] font-medium">Vet Health Clearances</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E8F0E9] bg-[#FAF7F0] cursor-pointer">
                <input
                  type="checkbox"
                  checked={pedigreeAttached}
                  onChange={(e) => setPedigreeAttached(e.target.checked)}
                  className="w-4 h-4 accent-[#194B38]"
                />
                <FileText className="w-4 h-4 text-[#194B38]" />
                <span className="text-xs text-[#24352D] font-medium">Pedigree Registration</span>
              </label>
            </div>
          </div>

          {/* Note to Owner */}
          <div>
            <label className="block text-xs font-bold text-[#24352D] mb-1">
              Introductory Message
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Introduce your breeding goals, your supervising vet clinic, and when you are planning the pairing..."
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F0] border border-[#E8F0E9] rounded-xl focus:outline-none focus:border-[#194B38] text-[#24352D] resize-none"
            />
          </div>

          {/* Responsible Breeding Code of Ethics Agreement */}
          <div className="p-3 bg-[#E8F0E9]/60 rounded-xl border border-[#194B38]/15 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={ethicsConfirmed}
                onChange={(e) => setEthicsConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#194B38]"
                required
              />
              <span className="text-[11px] text-[#24352D] leading-relaxed">
                <strong>Responsible Breeding Pledge:</strong> I confirm both dogs meet minimum breeding age (18+ months), have up-to-date health screenings, and that any mating will be conducted ethically under qualified veterinary guidance.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E8F0E9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#536B60] hover:text-[#24352D] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#194B38] text-white text-xs font-semibold hover:bg-[#133A2B] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Mating Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
