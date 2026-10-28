import React, { useState } from 'react';
import { X, Flag, Slash, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Dog } from '../types';
import { storageService } from '../services/storageService';

interface ReportBlockModalProps {
  mode: 'report' | 'block';
  targetDog?: Dog | null;
  targetOwnerId?: string | null;
  targetOwnerName?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReportBlockModal: React.FC<ReportBlockModalProps> = ({
  mode,
  targetDog,
  targetOwnerId,
  targetOwnerName,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('illegal_commercial_sale');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const ownerId = targetDog ? targetDog.ownerId : targetOwnerId || '';
  const ownerName = targetDog ? targetDog.ownerName : targetOwnerName || 'this owner';
  const targetTitle = targetDog ? `${targetDog.name} (${ownerName})` : ownerName;

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    storageService.reportTarget({
      targetType: targetDog ? 'dog' : 'owner',
      targetId: targetDog ? targetDog.id : ownerId,
      targetName: targetTitle,
      reason,
      details: details.trim(),
    });

    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1500);
  };

  const handleBlock = () => {
    setIsSubmitting(true);
    storageService.blockOwner(ownerId);
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E5E0D8] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E5E0D8] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {mode === 'report' ? (
              <Flag className="w-5 h-5 text-[#DC2626]" />
            ) : (
              <Slash className="w-5 h-5 text-[#DC2626]" />
            )}
            <h3 className="text-base font-bold text-[#1B4332]">
              {mode === 'report' ? `Report ${targetTitle}` : `Block ${ownerName}`}
            </h3>
          </div>

          <button onClick={onClose} className="text-[#6B7280] hover:text-[#1A202C] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#E8EFEA] text-[#1B4332] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#1B4332]">
              {mode === 'report' ? 'Report Received' : 'User Blocked'}
            </h4>
            <p className="text-xs text-[#4B5563]">
              {mode === 'report'
                ? 'Thank you for keeping Woof Pal safe. Our trust & safety team will review this report within 24 hours.'
                : `${ownerName} has been blocked and will no longer appear in your discovery feed or matches.`}
            </p>
          </div>
        ) : mode === 'report' ? (
          <form onSubmit={handleReport} className="p-6 space-y-4 text-xs text-[#1A202C]">
            <div>
              <label className="font-semibold text-[#1B4332] block mb-1">Reason for Report *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#1B4332]"
              >
                <option value="illegal_commercial_sale">Illegal Puppy Sale / Animal Broker</option>
                <option value="false_vaccine_claims">False Vaccination or Health Claims</option>
                <option value="aggressive_dog">Aggressive or Dangerous Canine Behavior</option>
                <option value="harassment">Harassment or Inappropriate Messages</option>
                <option value="animal_welfare">Suspected Animal Neglect or Abuse</option>
                <option value="other">Other Violation of Guidelines</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#1B4332] block mb-1">Additional Context / Details</label>
              <textarea
                rows={3}
                required
                placeholder="Provide details about what you observed..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#1B4332]"
              />
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8] text-[11px] text-[#6B7280]">
              Reports are treated confidentially. The reported account will not know who filed this report.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4B5563] hover:bg-[#FAF8F5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Submit Report
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4 text-xs text-[#1A202C]">
            <p className="leading-relaxed text-[#374151]">
              Are you sure you want to block <strong>{ownerName}</strong>?
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#4B5563]">
              <li>Their dogs will immediately disappear from your discovery feed.</li>
              <li>Any existing mutual matches or messages will be permanently severed.</li>
              <li>They will not be able to view your profile or message you.</li>
            </ul>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4B5563] hover:bg-[#FAF8F5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlock}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Yes, Block Owner
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
