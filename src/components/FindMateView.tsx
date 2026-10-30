import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Filter, 
  MapPin, 
  Info, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  ChevronDown,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { Dog, MatingRequest, BreedingFilters } from '../types';
import { storageService } from '../services/storageService';
import { SendMatingRequestModal } from './SendMatingRequestModal';
import { MatingConnectionModal } from './MatingConnectionModal';

interface FindMateViewProps {
  activeDog: Dog;
  userDogs: Dog[];
  onSelectActiveDog: (dogId: string) => void;
  onOpenDogDetail: (dog: Dog) => void;
  onOpenChat?: (partnerDog: Dog, partnerOwnerName: string) => void;
}

export const FindMateView: React.FC<FindMateViewProps> = ({
  activeDog,
  userDogs,
  onSelectActiveDog,
  onOpenDogDetail,
  onOpenChat,
}) => {
  // Main view tab: 'browse' | 'requests'
  const [activeSubTab, setActiveSubTab] = useState<'browse' | 'requests'>('browse');
  const [requestsSubTab, setRequestsSubTab] = useState<'incoming' | 'outgoing'>('incoming');

  // Breeding filters state - automatically default opposite sex for biological pairing
  const defaultSex = activeDog.sex === 'male' ? 'female' : 'male';
  const [filters, setFilters] = useState<BreedingFilters>({
    breed: '',
    sex: defaultSex,
    minAge: 1,
    maxAge: 10,
    pedigreeOnly: false,
    healthClearedOnly: false,
    maxDistanceKm: 30,
  });

  const [candidates, setCandidates] = useState<Dog[]>([]);
  const [matingRequests, setMatingRequests] = useState<MatingRequest[]>([]);
  const [selectedPartnerForRequest, setSelectedPartnerForRequest] = useState<Dog | null>(null);
  const [selectedRequestForConnection, setSelectedRequestForConnection] = useState<MatingRequest | null>(null);

  // Load candidates and requests
  const loadData = () => {
    const dogs = storageService.getBreedingCandidates(activeDog, filters);
    setCandidates(dogs);
    const reqs = storageService.getMatingRequests();
    setMatingRequests(reqs);
  };

  useEffect(() => {
    loadData();
  }, [filters, activeDog.id]);

  // Separate incoming vs outgoing requests
  const incomingRequests = matingRequests.filter(r => r.toDogId === activeDog.id || r.toOwnerId === activeDog.ownerId);
  const outgoingRequests = matingRequests.filter(r => r.fromDogId === activeDog.id || r.fromOwnerId === activeDog.ownerId);
  const pendingIncomingCount = incomingRequests.filter(r => r.status === 'pending').length;

  const handleAcceptRequest = (request: MatingRequest) => {
    const updated = storageService.updateMatingRequestStatus(request.id, 'accepted');
    if (updated) {
      loadData();
      setSelectedRequestForConnection(updated);
    }
  };

  const handleDeclineRequest = (request: MatingRequest) => {
    if (window.confirm(`Decline mating request from ${request.fromDog.name}?`)) {
      storageService.updateMatingRequestStatus(request.id, 'declined');
      loadData();
    }
  };

  const handleCancelRequest = (request: MatingRequest) => {
    if (window.confirm(`Cancel your mating inquiry for ${request.toDog.name}?`)) {
      storageService.cancelMatingRequest(request.id);
      loadData();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner & Active Dog Breeding Context */}
      <div className="bg-white rounded-3xl border border-[#E8F0E9] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F0E9] text-[#194B38] flex items-center justify-center shrink-0">
            <HeartHandshake className="w-7 h-7 text-[#194B38]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#194B38]">Find a Mate</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E8F0E9] text-[#194B38] px-2.5 py-0.5 rounded-full">
                Responsible Breeding
              </span>
            </div>
            <p className="text-xs text-[#536B60] mt-0.5">
              Discover verified health-screened breeding partners with documented pedigree records.
            </p>
          </div>
        </div>

        {/* Active Dog Selector Dropdown */}
        <div className="flex items-center gap-3 bg-[#FAF7F0] p-2.5 rounded-2xl border border-[#E8F0E9]">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-[#E8F0E9] shrink-0">
            <img 
              src={activeDog.photos[0]} 
              alt={activeDog.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-[#536B60] uppercase">Selected Dog:</span>
              <span className="font-bold text-xs text-[#194B38]">{activeDog.name}</span>
            </div>
            <p className="text-[11px] text-[#536B60] capitalize">
              {activeDog.breed} · {activeDog.sex} · {activeDog.ageYears}y
            </p>
          </div>

          {userDogs.length > 1 && (
            <select
              value={activeDog.id}
              onChange={(e) => onSelectActiveDog(e.target.value)}
              className="ml-2 text-xs bg-white border border-[#E8F0E9] text-[#194B38] font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              {userDogs.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.sex})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#E8F0E9] pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('browse')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'browse'
                ? 'bg-[#194B38] text-white shadow-xs'
                : 'bg-white text-[#536B60] hover:text-[#194B38] border border-[#E8F0E9]'
            }`}
          >
            <span>Browse Partners</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeSubTab === 'browse' ? 'bg-white/20 text-white' : 'bg-[#FAF7F0] text-[#536B60]'
            }`}>
              {candidates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('requests')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
              activeSubTab === 'requests'
                ? 'bg-[#194B38] text-white shadow-xs'
                : 'bg-white text-[#536B60] hover:text-[#194B38] border border-[#E8F0E9]'
            }`}
          >
            <span>Mating Requests</span>
            {pendingIncomingCount > 0 ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E98779] text-white font-bold animate-pulse">
                {pendingIncomingCount} pending
              </span>
            ) : (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeSubTab === 'requests' ? 'bg-white/20 text-white' : 'bg-[#FAF7F0] text-[#536B60]'
              }`}>
                {matingRequests.length}
              </span>
            )}
          </button>
        </div>

        <span className="hidden sm:inline-block text-xs text-[#536B60]">
          Strict Vet Oversight &amp; Documented Lineage
        </span>
      </div>

      {/* SUB-VIEW 1: BROWSE PARTNERS DIRECTORY */}
      {activeSubTab === 'browse' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-3xl border border-[#E8F0E9] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Breed Search */}
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Filter by breed (e.g. Golden Retriever, German Shepherd)..."
                  value={filters.breed}
                  onChange={(e) => setFilters(prev => ({ ...prev, breed: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F0] border border-[#E8F0E9] rounded-xl focus:outline-none focus:border-[#194B38] text-[#24352D]"
                />
              </div>

              {/* Sex Selector */}
              <div className="flex items-center gap-1.5 bg-[#FAF7F0] p-1 rounded-xl border border-[#E8F0E9] text-xs">
                {(['all', 'female', 'male'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, sex: s }))}
                    className={`px-3 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                      filters.sex === s 
                        ? 'bg-[#194B38] text-white shadow-2xs' 
                        : 'text-[#536B60] hover:text-[#194B38]'
                    }`}
                  >
                    {s === 'all' ? 'Any Sex' : s}
                  </button>
                ))}
              </div>

              {/* Reset Filters */}
              {(filters.breed || filters.pedigreeOnly || filters.healthClearedOnly || filters.sex !== defaultSex) && (
                <button
                  onClick={() => setFilters({
                    breed: '',
                    sex: defaultSex,
                    minAge: 1,
                    maxAge: 10,
                    pedigreeOnly: false,
                    healthClearedOnly: false,
                    maxDistanceKm: 30,
                  })}
                  className="text-xs text-[#E98779] hover:underline flex items-center gap-1 self-center cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Checkbox Toggles & Quick Filters */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#24352D]">
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, breed: prev.breed === activeDog.breed ? '' : activeDog.breed }))}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  filters.breed.toLowerCase() === activeDog.breed.toLowerCase()
                    ? 'bg-[#194B38] text-white border-[#194B38]'
                    : 'bg-[#FAF7F0] text-[#194B38] border-[#D1E0D3] hover:bg-[#E8F0E9]'
                }`}
                title={`Filter for other ${activeDog.breed}s`}
              >
                <span>Same Breed: {activeDog.breed}</span>
              </button>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.pedigreeOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, pedigreeOnly: e.target.checked }))}
                  className="w-4 h-4 accent-[#194B38]"
                />
                <span className="font-medium">Registered Pedigree Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.healthClearedOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, healthClearedOnly: e.target.checked }))}
                  className="w-4 h-4 accent-[#194B38]"
                />
                <span className="font-medium">Vet-Audited Clearances Only</span>
              </label>
            </div>
          </div>

          {/* Partner Cards Grid */}
          {candidates.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E8F0E9] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F0] mx-auto flex items-center justify-center text-[#194B38]">
                <HeartHandshake className="w-8 h-8 text-[#E98779]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#194B38]">No Matching Breeding Partners Found</h3>
              <p className="text-xs text-[#536B60] max-w-sm mx-auto">
                No eligible candidates match your current breed and health filters. Try clearing the breed search or expanding sex criteria.
              </p>
              <button
                onClick={() => setFilters({
                  breed: '',
                  sex: 'all',
                  minAge: 1,
                  maxAge: 12,
                  pedigreeOnly: false,
                  healthClearedOnly: false,
                  maxDistanceKm: 50,
                })}
                className="px-5 py-2.5 bg-[#194B38] text-white rounded-xl text-xs font-semibold hover:bg-[#133A2B] transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {candidates.map((partner) => {
                const isPedigree = partner.responsibleBreedingInfo?.pedigreeRegistered;
                const hasVetClearance = partner.responsibleBreedingInfo?.vetBreedingClearance || partner.vaccinationStatus === 'verified_by_vet';

                return (
                  <div
                    key={partner.id}
                    className="bg-white rounded-3xl border border-[#E8F0E9] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Header with Pedigree & Distance Badges */}
                      <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={partner.photos[0]}
                          alt={partner.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          {isPedigree ? (
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#194B38] text-white shadow-2xs flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-[#A7F3D0]" />
                              <span>Pedigree Registered</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/90 text-[#536B60]">
                              Standard Listing
                            </span>
                          )}

                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/45 text-white backdrop-blur-xs flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-[#E98779]" />
                            <span>{partner.location.area}</span>
                          </span>
                        </div>

                        {/* Bottom Name & Breed Line */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h3 className="font-serif text-2xl font-bold">{partner.name}</h3>
                          <p className="text-xs text-white/90 font-medium capitalize">
                            {partner.breed} · {partner.sex} · {partner.ageYears}y {partner.ageMonths > 0 ? `${partner.ageMonths}m` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-3">
                        {/* Health & Screening Chips */}
                        <div className="flex flex-wrap gap-1.5">
                          {hasVetClearance && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#E8F0E9] text-[#194B38]">
                              ✓ Vet Cleared
                            </span>
                          )}
                          {partner.responsibleBreedingInfo?.dnaScreeningConducted && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF7F0] border border-[#E8F0E9] text-[#24352D]">
                              🧬 DNA Screened
                            </span>
                          )}
                          {partner.responsibleBreedingInfo?.hipElbowScoreAvailable && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF7F0] border border-[#E8F0E9] text-[#24352D]">
                              🦴 Hip/Elbow Scored
                            </span>
                          )}
                        </div>

                        {/* Bio snippet */}
                        <p className="text-xs text-[#536B60] line-clamp-2 leading-relaxed">
                          {partner.bio}
                        </p>

                        {/* Stated Terms Snippet */}
                        {partner.responsibleBreedingInfo?.studOrDamTerms && (
                          <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8F0E9] text-[11px] text-[#24352D]">
                            <span className="font-bold text-[#194B38]">Terms: </span>
                            <span className="line-clamp-1">{partner.responsibleBreedingInfo.studOrDamTerms}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-4 pt-0 border-t border-[#E8F0E9] mt-2 flex items-center gap-2">
                      <button
                        onClick={() => onOpenDogDetail(partner)}
                        className="flex-1 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#E8F0E9] text-[#194B38] text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>View Pedigree</span>
                      </button>

                      <button
                        onClick={() => setSelectedPartnerForRequest(partner)}
                        className="flex-1 py-2 rounded-xl bg-[#194B38] hover:bg-[#133A2B] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-[#E98779]" />
                        <span>Send Request</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: MATING REQUESTS MANAGEMENT */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4">
          {/* Requests Segmented Control */}
          <div className="flex items-center gap-2 border-b border-[#E8F0E9] pb-3">
            <button
              onClick={() => setRequestsSubTab('incoming')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                requestsSubTab === 'incoming'
                  ? 'bg-[#194B38] text-white shadow-xs'
                  : 'bg-white text-[#536B60] border border-[#E8F0E9] hover:text-[#194B38]'
              }`}
            >
              <span>Incoming Requests</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                requestsSubTab === 'incoming' ? 'bg-white/20 text-white' : 'bg-[#FAF7F0]'
              }`}>
                {incomingRequests.length}
              </span>
            </button>

            <button
              onClick={() => setRequestsSubTab('outgoing')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                requestsSubTab === 'outgoing'
                  ? 'bg-[#194B38] text-white shadow-xs'
                  : 'bg-white text-[#536B60] border border-[#E8F0E9] hover:text-[#194B38]'
              }`}
            >
              <span>Sent Outgoing Inquiries</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                requestsSubTab === 'outgoing' ? 'bg-white/20 text-white' : 'bg-[#FAF7F0]'
              }`}>
                {outgoingRequests.length}
              </span>
            </button>
          </div>

          {/* List of Requests */}
          {requestsSubTab === 'incoming' ? (
            incomingRequests.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E8F0E9] p-10 text-center space-y-2">
                <Clock className="w-10 h-10 text-[#536B60] mx-auto opacity-40" />
                <h4 className="font-serif text-lg font-bold text-[#194B38]">No Incoming Breeding Requests</h4>
                <p className="text-xs text-[#536B60]">
                  When verified owners propose a breeding inquiry for {activeDog.name}, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl border border-[#E8F0E9] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-[#E8F0E9] shrink-0">
                        <img
                          src={req.fromDog.photos[0]}
                          alt={req.fromDog.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-lg font-bold text-[#194B38]">{req.fromDog.name}</h4>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            req.status === 'pending' ? 'bg-[#FEF3C7] text-[#92400E]' :
                            req.status === 'accepted' ? 'bg-[#D1FAE5] text-[#065F46]' :
                            req.status === 'declined' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#536B60]">
                          Owner: <strong>{req.fromOwnerName}</strong> · Proposed for <strong>{req.toDog.name}</strong>
                        </p>
                        <p className="text-xs text-[#24352D] bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8F0E9]">
                          <strong>Terms:</strong> {req.termsProposed}
                        </p>
                        {req.note && (
                          <p className="text-xs text-[#536B60] italic">
                            "{req.note}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Controls for Incoming */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleDeclineRequest(req)}
                            className="px-3.5 py-2 rounded-xl border border-[#E8F0E9] hover:bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleAcceptRequest(req)}
                            className="px-4 py-2 rounded-xl bg-[#194B38] hover:bg-[#133A2B] text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept Proposal</span>
                          </button>
                        </>
                      ) : req.status === 'accepted' ? (
                        <button
                          onClick={() => setSelectedRequestForConnection(req)}
                          className="px-4 py-2 rounded-xl bg-[#194B38] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <HeartHandshake className="w-3.5 h-3.5 text-[#E98779]" />
                          <span>View Connection Details</span>
                        </button>
                      ) : (
                        <span className="text-xs text-[#536B60] italic">
                          Request {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            outgoingRequests.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E8F0E9] p-10 text-center space-y-2">
                <Clock className="w-10 h-10 text-[#536B60] mx-auto opacity-40" />
                <h4 className="font-serif text-lg font-bold text-[#194B38]">No Outgoing Inquiries</h4>
                <p className="text-xs text-[#536B60]">
                  When you propose mating inquiries to other dog owners, you can track their status here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {outgoingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl border border-[#E8F0E9] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-[#E8F0E9] shrink-0">
                        <img
                          src={req.toDog.photos[0]}
                          alt={req.toDog.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-lg font-bold text-[#194B38]">Partner: {req.toDog.name}</h4>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            req.status === 'pending' ? 'bg-[#FEF3C7] text-[#92400E]' :
                            req.status === 'accepted' ? 'bg-[#D1FAE5] text-[#065F46]' :
                            req.status === 'declined' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#536B60]">
                          Owner: <strong>{req.toOwnerName}</strong> · For your dog <strong>{req.fromDog.name}</strong>
                        </p>
                        <p className="text-xs text-[#24352D] bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8F0E9]">
                          <strong>Proposed Terms:</strong> {req.termsProposed}
                        </p>
                      </div>
                    </div>

                    {/* Action Controls for Outgoing */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {req.status === 'pending' ? (
                        <button
                          onClick={() => handleCancelRequest(req)}
                          className="px-3.5 py-2 rounded-xl border border-[#E8F0E9] hover:bg-slate-100 text-[#536B60] text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cancel Inquiry
                        </button>
                      ) : req.status === 'accepted' ? (
                        <button
                          onClick={() => setSelectedRequestForConnection(req)}
                          className="px-4 py-2 rounded-xl bg-[#194B38] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <HeartHandshake className="w-3.5 h-3.5 text-[#E98779]" />
                          <span>View Connection Details</span>
                        </button>
                      ) : (
                        <span className="text-xs text-[#536B60] italic">
                          Inquiry {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}

      {/* Send Mating Request Modal */}
      {selectedPartnerForRequest && (
        <SendMatingRequestModal
          isOpen={Boolean(selectedPartnerForRequest)}
          onClose={() => setSelectedPartnerForRequest(null)}
          senderDog={activeDog}
          partnerDog={selectedPartnerForRequest}
          onSuccess={(newReq) => {
            loadData();
            setActiveSubTab('requests');
            setRequestsSubTab('outgoing');
          }}
        />
      )}

      {/* Mating Connection Modal (Accepted Request) */}
      {selectedRequestForConnection && (
        <MatingConnectionModal
          isOpen={Boolean(selectedRequestForConnection)}
          onClose={() => setSelectedRequestForConnection(null)}
          request={selectedRequestForConnection}
          onOpenChat={onOpenChat}
        />
      )}

    </div>
  );
};
