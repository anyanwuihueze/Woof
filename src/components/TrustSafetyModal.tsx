import React from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';

interface TrustSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrustSafetyModal: React.FC<TrustSafetyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8F0E9] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E8F0E9] bg-[#FAF7F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#194B38]" />
            <div>
              <h3 className="font-serif text-lg font-bold text-[#194B38]">Trust & Safety Protocol</h3>
              <p className="text-xs text-[#536B60]">Woof Pal Community Guidelines & Welfare Standards</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white hover:bg-[#FAF7F0] text-[#536B60] flex items-center justify-center transition-colors cursor-pointer border border-[#E8F0E9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#24352D] flex-1">
          
          {/* Critical Disclaimer Callout */}
          <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-xs text-[#991B1B] uppercase tracking-wider">
                Safety & Medical Notice
              </h4>
              <p className="text-xs text-[#7F1D1D] leading-relaxed">
                Woof Pal does not and cannot guarantee animal temperament, behavior, or absolute safety. Dog owners are solely responsible for supervising their pets, confirming health documentation, and exercising prudent judgment during all in-person interactions.
              </p>
            </div>
          </div>

          {/* Section 1: Safe Meetup Recommendations */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#194B38] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F0E9] text-[#194B38] flex items-center justify-center text-xs font-bold font-sans">1</span>
              <span>Safe-Meeting Recommendations for Dog Owners</span>
            </h4>
            
            <div className="space-y-2.5 text-xs text-[#24352D]">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF7F0] border border-[#E8F0E9]">
                <CheckCircle2 className="w-4 h-4 text-[#194B38] shrink-0 mt-0.5" />
                <span><strong>Always Meet in Daylight Public Spaces:</strong> Arrange initial playdates in daylight at public dog-friendly parks, open fields, or secure canine daycare facilities. Never invite unknown parties directly into private residences.</span>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF7F0] border border-[#E8F0E9]">
                <CheckCircle2 className="w-4 h-4 text-[#194B38] shrink-0 mt-0.5" />
                <span><strong>Parallel Walking on Leash:</strong> Before letting dogs interact freely, take a 5–10 minute parallel walk side-by-side with a 2-meter buffer. This allows both dogs to acclimatize to scents without defensive posturing.</span>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF7F0] border border-[#E8F0E9]">
                <CheckCircle2 className="w-4 h-4 text-[#194B38] shrink-0 mt-0.5" />
                <span><strong>Observe Canine Body Language:</strong> Watch for signs of stress or over-arousal (stiff tails, whale eye, lip licking, hackles raised). Separate calmly if either dog displays discomfort.</span>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF7F0] border border-[#E8F0E9]">
                <CheckCircle2 className="w-4 h-4 text-[#194B38] shrink-0 mt-0.5" />
                <span><strong>Confirm Vaccinations:</strong> Verify that both dogs have up-to-date rabies and core DHPP vaccinations before allowing nose-to-nose contact.</span>
              </div>
            </div>
          </div>

          {/* Section 2: Prohibited Conduct & Animal Welfare */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#194B38] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F0E9] text-[#E98779] flex items-center justify-center text-xs font-bold font-sans">2</span>
              <span>Strict Prohibition Against Animal Abuse & Illegal Sales</span>
            </h4>

            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8F0E9] space-y-2 text-xs text-[#536B60]">
              <p>Woof Pal strictly prohibits the following activities under penalty of permanent account termination and referral to law enforcement:</p>
              <ul className="list-disc pl-5 space-y-1 text-[#24352D]">
                <li>Using Woof Pal to sell puppies, dogs, or exotic animals for commercial profit.</li>
                <li>Arranging dog fighting, baiting, or aggressive provocation.</li>
                <li>Backyard or substandard puppy mill breeding without certified veterinary supervision.</li>
                <li>Falsifying veterinary vaccination certificates or health screening test results.</li>
                <li>Harassment, threats, or unsolicited commercial spam directed at other owners.</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Responsible Breeding Policy */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#194B38] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F0E9] text-[#194B38] flex items-center justify-center text-xs font-bold font-sans">3</span>
              <span>Responsible Breeding Requirements</span>
            </h4>

            <p className="text-xs text-[#536B60] leading-relaxed">
              If using Woof Pal for pedigree connections, members must understand that mutual interest in the app does not certify genetic compatibility or reproductive fitness. Ethical breeders must conduct breed-specific DNA tests, OFA hip/elbow x-rays, and consult licensed veterinary surgeons.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F0] border-t border-[#E8F0E9] flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#194B38] hover:bg-[#133A2B] text-white text-xs font-semibold cursor-pointer shadow-xs"
          >
            I Understand and Agree
          </button>
        </div>

      </div>

    </div>
  );
};
