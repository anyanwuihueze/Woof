import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  X, 
  Building,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  ServiceProvider, 
  ServiceCategory, 
  ServiceEnquiry, 
  Dog, 
  OwnerProfile 
} from '../types';
import { storageService } from '../services/storageService';

interface PetServicesMarketplaceProps {
  currentUser: OwnerProfile;
  activeDog: Dog;
  userDogs: Dog[];
}

export const PetServicesMarketplace: React.FC<PetServicesMarketplaceProps> = ({
  currentUser,
  activeDog,
  userDogs,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [providers] = useState<ServiceProvider[]>(storageService.getServiceProviders());
  
  // Modals & Active Tab
  const [viewTab, setViewTab] = useState<'directory' | 'my_bookings'>('directory');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [bookingProvider, setBookingProvider] = useState<ServiceProvider | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [showBusinessPartnerInfo, setShowBusinessPartnerInfo] = useState(false);

  // Booking Form State
  const [preferredDate, setPreferredDate] = useState('2026-11-05');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [selectedDogId, setSelectedDogId] = useState(activeDog.id);
  const [enquiryNotes, setEnquiryNotes] = useState('');
  const [contactPhone, setContactPhone] = useState(currentUser.phone || '+234 803 555 0192');
  const [bookingSubmittedSuccess, setBookingSubmittedSuccess] = useState(false);

  // User enquiries list
  const [userEnquiries, setUserEnquiries] = useState<ServiceEnquiry[]>(storageService.getUserEnquiries());

  const categories: { id: 'all' | ServiceCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All Services', icon: '🐾' },
    { id: 'veterinary', label: 'Veterinary Clinics', icon: '🩺' },
    { id: 'grooming', label: 'Pet Grooming', icon: '✂️' },
    { id: 'boarding', label: 'Boarding & Daycare', icon: '🏡' },
    { id: 'training', label: 'Dog Training', icon: '🎓' },
    { id: 'walking', label: 'Dog Walking', icon: '🦮' },
    { id: 'supplies', label: 'Pet Shops & Supplies', icon: '🛍️' },
    { id: 'other', label: 'Other Services', icon: '📸' },
  ];

  const filteredProviders = providers.filter(provider => {
    if (activeCategory !== 'all' && provider.category !== activeCategory) return false;
    if (selectedArea !== 'all' && !provider.area.toLowerCase().includes(selectedArea.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = provider.businessName.toLowerCase().includes(q);
      const matchDesc = provider.description.toLowerCase().includes(q);
      const matchService = provider.services.some(s => s.name.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchService) return false;
    }
    return true;
  });

  const handleOpenBooking = (provider: ServiceProvider, serviceId?: string) => {
    setBookingProvider(provider);
    setSelectedServiceId(serviceId || provider.services[0]?.id || '');
    setBookingSubmittedSuccess(false);
  };

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingProvider) return;

    const chosenService = bookingProvider.services.find(s => s.id === selectedServiceId) || bookingProvider.services[0];
    const dog = userDogs.find(d => d.id === selectedDogId) || activeDog;

    const newEnquiry = storageService.createEnquiry({
      providerId: bookingProvider.id,
      providerName: bookingProvider.businessName,
      serviceId: chosenService.id,
      serviceName: chosenService.name,
      customerId: currentUser.id,
      customerName: currentUser.displayName,
      customerPhone: contactPhone,
      dogId: dog.id,
      dogName: dog.name,
      preferredDate,
      preferredTime,
      notes: enquiryNotes.trim(),
    });

    setUserEnquiries([newEnquiry, ...userEnquiries]);
    setBookingSubmittedSuccess(true);
    setTimeout(() => {
      setBookingProvider(null);
      setBookingSubmittedSuccess(false);
      setViewTab('my_bookings');
    }, 1400);
  };

  const handleCancelEnquiry = (enquiryId: string) => {
    if (window.confirm("Cancel this appointment enquiry?")) {
      storageService.cancelEnquiry(enquiryId);
      setUserEnquiries(storageService.getUserEnquiries());
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-7">
      
      {/* Marketplace Header Card */}
      <div className="bg-[#FAF7F0] rounded-3xl border border-[#E8F0E9] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#194B38] bg-[#E8F0E9] px-3 py-1 rounded-full border border-[#D1E0D3]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#194B38]" />
            <span>Trusted Lagos Pet Care Directory</span>
          </div>
          <h2 className="font-serif text-3xl font-black text-[#194B38] tracking-tight">
            Verified Pet Care & Supplies
          </h2>
          <p className="text-xs sm:text-sm text-[#536B60] leading-relaxed">
            Discover audited veterinary hospitals, luxury grooming studios, climate-controlled boarding, and certified trainers across Lagos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Toggle between directory & user's bookings */}
          <div className="bg-white p-1 rounded-2xl border border-[#E8F0E9] flex gap-1 shadow-2xs">
            <button
              onClick={() => setViewTab('directory')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                viewTab === 'directory' ? 'bg-[#194B38] text-white shadow-2xs' : 'text-[#536B60] hover:text-[#194B38]'
              }`}
            >
              Services Directory
            </button>
            <button
              onClick={() => setViewTab('my_bookings')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer relative ${
                viewTab === 'my_bookings' ? 'bg-[#194B38] text-white shadow-2xs' : 'text-[#536B60] hover:text-[#194B38]'
              }`}
            >
              <span>My Enquiries</span>
              {userEnquiries.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-[#E98779] text-white text-[10px] font-bold rounded-full">
                  {userEnquiries.length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setShowBusinessPartnerInfo(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-white border border-[#D1E0D3] text-xs font-semibold text-[#194B38] hover:bg-[#FAF7F0] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Building className="w-3.5 h-3.5 text-[#194B38]" />
            <span>List Your Practice</span>
          </button>
        </div>
      </div>

      {viewTab === 'directory' ? (
        <>
          {/* Search & Location Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#536B60]" />
              <input
                type="text"
                placeholder="Search clinic name, grooming, boarding, training..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E8F0E9] text-xs sm:text-sm bg-white focus:outline-none focus:border-[#194B38] shadow-2xs text-[#24352D]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <MapPin className="w-4 h-4 text-[#194B38] shrink-0" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full sm:w-48 px-3 py-2.5 rounded-2xl border border-[#E8F0E9] text-xs bg-white focus:outline-none focus:border-[#194B38] shadow-2xs font-medium text-[#194B38]"
              >
                <option value="all">All Lagos Areas</option>
                <option value="lekki">Lekki & Environs</option>
                <option value="victoria island">Victoria Island</option>
                <option value="ikoyi">Ikoyi</option>
                <option value="ikeja">Ikeja / Mainland</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="overflow-x-auto pb-2 flex gap-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`min-h-[40px] px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap shrink-0 border transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-[#194B38] text-white border-[#194B38] shadow-2xs'
                    : 'bg-white text-[#536B60] border-[#E8F0E9] hover:border-[#D1E0D3]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Providers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map(provider => (
              <div
                key={provider.id}
                className="bg-white rounded-3xl border border-[#E8F0E9] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={provider.logoUrl}
                      alt={provider.businessName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#24352D]/85 via-transparent to-transparent"></div>

                    {/* Verification & Rating Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      {provider.verifiedStatus === 'verified_partner' ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#194B38]/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                          <ShieldCheck className="w-3 h-3 text-[#A7F3D0]" />
                          <span>Verified Partner</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#536B60] text-[10px] font-medium shadow-2xs">
                          Community Listed
                        </span>
                      )}

                      <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#F59E0B] fill-current" />
                        <span>{provider.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-white/75 font-normal">({provider.reviewCount})</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <p className="text-[11px] text-[#A7F3D0] uppercase tracking-wider font-semibold">
                        {provider.categoryLabel}
                      </p>
                      <h3 className="font-serif text-lg font-bold truncate leading-tight mt-0.5">
                        {provider.businessName}
                      </h3>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-[#536B60] line-clamp-2 leading-relaxed">
                      {provider.description}
                    </p>

                    <div className="text-xs text-[#536B60] space-y-1">
                      <p className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#E98779] shrink-0" />
                        <span className="truncate">{provider.address}</span>
                      </p>
                      <p className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-[#194B38] shrink-0" />
                        <span className="truncate">{provider.operatingHours}</span>
                      </p>
                    </div>

                    {/* Featured Services */}
                    <div className="pt-2 border-t border-[#E8F0E9]">
                      <p className="text-[11px] font-semibold text-[#194B38] uppercase tracking-wider mb-1.5">
                        Featured Services
                      </p>
                      <div className="space-y-1.5">
                        {provider.services.slice(0, 2).map(srv => (
                          <div key={srv.id} className="flex items-center justify-between text-xs bg-[#FAF7F0] p-2 rounded-xl border border-[#E8F0E9]">
                            <span className="truncate font-medium text-[#24352D] pr-2">{srv.name}</span>
                            <span className="font-bold text-[#194B38] shrink-0">{srv.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-[#FAF7F0] border-t border-[#E8F0E9] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedProvider(provider)}
                    className="min-h-[42px] flex-1 py-2 px-3 rounded-xl border border-[#D1E0D3] text-xs font-semibold text-[#194B38] hover:bg-white transition-colors cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleOpenBooking(provider)}
                    className="min-h-[42px] flex-1 py-2 px-3 rounded-xl bg-[#194B38] hover:bg-[#133A2B] text-white text-xs font-semibold transition-colors cursor-pointer text-center shadow-2xs"
                  >
                    Request Booking
                  </button>
                </div>

              </div>
            ))}
          </div>

          {filteredProviders.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#E8F0E9] space-y-3">
              <Briefcase className="w-12 h-12 text-[#536B60] mx-auto" />
              <h3 className="font-serif text-base font-bold text-[#194B38]">No service providers match your search</h3>
              <p className="text-xs text-[#536B60]">
                Try clearing your search keyword or switching category tabs.
              </p>
              <button
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); setSelectedArea('all'); }}
                className="px-4 py-2 bg-[#194B38] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </>
      ) : (
        /* MY BOOKINGS VIEW */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-[#194B38]">Your Submitted Service Enquiries</h3>
            <span className="text-xs text-[#536B60]">
              Requests are reviewed directly by the clinic or provider.
            </span>
          </div>

          {userEnquiries.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E8F0E9] p-10 text-center space-y-3">
              <Calendar className="w-10 h-10 text-[#536B60] mx-auto" />
              <h4 className="font-serif text-base font-bold text-[#194B38]">No enquiries submitted yet</h4>
              <p className="text-xs text-[#536B60] max-w-sm mx-auto">
                Select any veterinary clinic, grooming spa, or trainer from the directory to request an appointment.
              </p>
              <button
                onClick={() => setViewTab('directory')}
                className="px-5 py-2.5 rounded-xl bg-[#194B38] text-white text-xs font-semibold cursor-pointer"
              >
                Explore Directory
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userEnquiries.map(enq => (
                <div
                  key={enq.id}
                  className="bg-white rounded-3xl border border-[#E8F0E9] p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-base text-[#194B38]">{enq.providerName}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        enq.status === 'accepted' ? 'bg-[#E8F0E9] text-[#194B38]' :
                        enq.status === 'pending' ? 'bg-[#FEF3C7] text-[#92400E]' :
                        enq.status === 'cancelled' ? 'bg-[#FEE2E2] text-[#991B1B]' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {enq.status}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#24352D]">
                      Service: <strong>{enq.serviceName}</strong> {enq.dogName && `for ${enq.dogName}`}
                    </p>

                    <p className="text-xs text-[#536B60] flex items-center gap-3">
                      <span>Preferred Date: {enq.preferredDate} at {enq.preferredTime}</span>
                      <span>·</span>
                      <span>Phone: {enq.customerPhone}</span>
                    </p>

                    {enq.notes && (
                      <p className="text-[11px] text-[#536B60] italic pt-1">
                        Note: "{enq.notes}"
                      </p>
                    )}
                  </div>

                  {enq.status === 'pending' && (
                    <button
                      onClick={() => handleCancelEnquiry(enq.id)}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-[#FCA5A5] text-[#DC2626] hover:bg-[#FEF2F2] text-xs font-medium transition-colors cursor-pointer shrink-0"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROVIDER DETAIL MODAL */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8F0E9] overflow-hidden my-auto max-h-[90vh] flex flex-col">
            
            <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
              <img
                src={selectedProvider.logoUrl}
                alt={selectedProvider.businessName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24352D]/90 via-transparent to-black/30"></div>

              <button
                onClick={() => setSelectedProvider(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
                  {selectedProvider.categoryLabel}
                </span>
                <h3 className="font-serif text-2xl font-bold mt-1 text-white">{selectedProvider.businessName}</h3>
                <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E98779]" />
                  <span>{selectedProvider.address}</span>
                </p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#24352D] flex-1">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B60] mb-2">About the Business</h4>
                <p className="text-sm text-[#24352D] leading-relaxed">
                  {selectedProvider.description}
                </p>
              </div>

              {/* Contact & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FAF7F0] p-4 rounded-2xl border border-[#E8F0E9]">
                <div>
                  <span className="text-[#536B60] block text-[10px]">Operating Hours</span>
                  <span className="font-semibold text-[#194B38]">{selectedProvider.operatingHours}</span>
                </div>
                <div>
                  <span className="text-[#536B60] block text-[10px]">Direct Phone</span>
                  <span className="font-semibold text-[#194B38]">{selectedProvider.phone}</span>
                </div>
                <div>
                  <span className="text-[#536B60] block text-[10px]">Email Enquiries</span>
                  <span className="font-semibold text-[#194B38]">{selectedProvider.email}</span>
                </div>
                <div>
                  <span className="text-[#536B60] block text-[10px]">Price Tier</span>
                  <span className="font-semibold text-[#194B38]">{selectedProvider.pricingRange}</span>
                </div>
              </div>

              {/* Full Services List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#194B38]">Available Services & Pricing</h4>
                <div className="space-y-2">
                  {selectedProvider.services.map(srv => (
                    <div
                      key={srv.id}
                      className="p-3.5 rounded-2xl border border-[#E8F0E9] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-[#194B38]">{srv.name}</h5>
                          {srv.duration && (
                            <span className="text-[10px] text-[#536B60] bg-[#FAF7F0] px-2 py-0.5 rounded-md border border-[#E8F0E9]">
                              {srv.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#536B60]">{srv.description}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-sm text-[#194B38]">{srv.price}</span>
                        <button
                          onClick={() => {
                            setSelectedProvider(null);
                            handleOpenBooking(selectedProvider, srv.id);
                          }}
                          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#194B38] hover:bg-[#133A2B] text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Book Service
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F0] border-t border-[#E8F0E9] flex justify-end">
              <button
                onClick={() => {
                  setSelectedProvider(null);
                  handleOpenBooking(selectedProvider);
                }}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#194B38] hover:bg-[#133A2B] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                Submit General Appointment Request
              </button>
            </div>

          </div>
        </div>
      )}

      {/* BOOKING / APPOINTMENT ENQUIRY MODAL */}
      {bookingProvider && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E8F0E9] overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            <div className="p-5 border-b border-[#E8F0E9] bg-[#FAF7F0] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-[#194B38]">
                  Request Service with {bookingProvider.businessName}
                </h3>
                <p className="text-xs text-[#536B60]">
                  Submit preferred date and time. The clinic or provider will confirm.
                </p>
              </div>

              <button
                onClick={() => setBookingProvider(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#FAF7F0] text-[#536B60] flex items-center justify-center transition-colors cursor-pointer border border-[#E8F0E9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bookingSubmittedSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#E8F0E9] text-[#194B38] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#194B38]">Enquiry Submitted Successfully!</h4>
                <p className="text-xs text-[#536B60] max-w-sm mx-auto">
                  {bookingProvider.businessName} has received your request. You can check the status under "My Enquiries".
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry} className="p-6 overflow-y-auto space-y-4 text-xs text-[#24352D] flex-1">
                
                {/* Service Selection */}
                <div>
                  <label className="font-semibold text-[#194B38] block mb-1">Select Service *</label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8F0E9] bg-[#FAF7F0] text-xs focus:outline-none focus:border-[#194B38]"
                  >
                    {bookingProvider.services.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dog Selection */}
                <div>
                  <label className="font-semibold text-[#194B38] block mb-1">Select Your Dog *</label>
                  <select
                    value={selectedDogId}
                    onChange={(e) => setSelectedDogId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8F0E9] bg-[#FAF7F0] text-xs focus:outline-none focus:border-[#194B38]"
                  >
                    {userDogs.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.breed})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#194B38] block mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E8F0E9] bg-[#FAF7F0] text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#194B38] block mb-1">Preferred Time *</label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E8F0E9] bg-[#FAF7F0] text-xs"
                    >
                      <option value="8:00 AM">8:00 AM</option>
                      <option value="9:30 AM">9:30 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="font-semibold text-[#194B38] block mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8F0E9] bg-[#FAF7F0] text-xs"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="font-semibold text-[#194B38] block mb-1">Special Notes / Pet Health Details</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Bruno is sensitive about his ears, need vaccination booster review, etc..."
                    value={enquiryNotes}
                    onChange={(e) => setEnquiryNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8F0E9] bg-[#FAF7F0] text-xs"
                  />
                </div>

                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8F0E9] text-[11px] text-[#536B60]">
                  ℹ️ This is an enquiry request. Payments are settled directly with the clinic or service provider upon appointment confirmation.
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingProvider(null)}
                    className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold text-[#536B60] hover:bg-[#FAF7F0] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="min-h-[40px] px-5 py-2 rounded-xl bg-[#194B38] hover:bg-[#133A2B] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    Submit Booking Request
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* PARTNER / LISTING TIERS MODAL */}
      {showBusinessPartnerInfo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E8F0E9] p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-[#194B38]" />
                <h3 className="font-serif text-xl font-bold text-[#194B38]">Partner with Woof Pal</h3>
              </div>
              <button onClick={() => setShowBusinessPartnerInfo(false)} className="cursor-pointer text-[#536B60] hover:text-[#24352D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#536B60] leading-relaxed">
              Grow your pet care practice in Lagos. Woof Pal connects veterinary surgeries, groomers, boarders, and certified trainers with engaged dog parents.
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#194B38]">Monetization & Listing Tiers</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl border border-[#E8F0E9] bg-[#FAF7F0] space-y-2">
                  <span className="font-bold text-[#194B38] block">Verified Partner Tier</span>
                  <p className="text-[#536B60]">Featured directory placement, verified clinic badge, direct enquiry routing, and health-card audit capabilities.</p>
                  <span className="text-[11px] font-semibold text-[#194B38] block">Subscription Plan</span>
                </div>

                <div className="p-4 rounded-2xl border border-[#E8F0E9] bg-[#FAF7F0] space-y-2">
                  <span className="font-bold text-[#194B38] block">Community Listing</span>
                  <p className="text-[#536B60]">Standard directory listing with business profile, services catalog, and direct customer contact.</p>
                  <span className="text-[11px] font-semibold text-[#194B38] block">Free Starter Tier</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#E8F0E9] border border-[#D1E0D3] text-xs text-[#194B38] space-y-1">
              <p className="font-semibold">Demonstration Mode</p>
              <p className="text-[11px]">
                In this prototype, listings are pre-seeded with sample businesses. Business registration and automated payout gateways will connect in Phase 2.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowBusinessPartnerInfo(false)}
                className="px-5 py-2.5 rounded-xl bg-[#194B38] text-white text-xs font-semibold cursor-pointer"
              >
                Got It
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
