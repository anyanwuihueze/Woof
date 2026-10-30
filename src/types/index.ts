export type DogSex = 'male' | 'female';
export type DogSize = 'Toy' | 'Small' | 'Medium' | 'Large' | 'Giant';
export type EnergyLevel = 'Low' | 'Moderate' | 'High' | 'Very High';
export type DogPurpose = 'playdates' | 'socialization' | 'breeding';

export type VaccinationStatus =
  | 'owner_reported_up_to_date'
  | 'unvaccinated'
  | 'under_vet_review'
  | 'verified_by_vet';

export interface HealthScreening {
  rabiesVaccinated: boolean;
  dhppVaccinated: boolean;
  dewormedRecently: boolean;
  spayedOrNeutered: boolean;
  microchipped: boolean;
  vetName?: string;
  vetContact?: string;
  lastCheckupDate?: string;
  notes?: string;
}

export interface ResponsibleBreedingInfo {
  pedigreeRegistered: boolean;
  pedigreeClubName?: string;
  registrationNumber?: string;
  dnaScreeningConducted: boolean;
  hipElbowScoreAvailable: boolean;
  eyeCertificationAvailable: boolean;
  vetBreedingClearance: boolean;
  breedingExperience: 'First time' | 'Experienced' | 'Occasional';
  ethicalBreedingAgreementAccepted: boolean;
  studOrDamTerms?: string;
}

export interface Dog {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  name: string;
  breed: string;
  isMixedBreed: boolean;
  ageYears: number;
  ageMonths: number;
  sex: DogSex;
  size: DogSize;
  weightKg?: number;
  temperament: string[];
  energyLevel: EnergyLevel;
  favoriteActivities: string[];
  photos: string[];
  bio: string;
  primaryPurpose: DogPurpose;
  location: {
    city: string;
    area: string;
    approximateDistanceKm: number;
  };
  vaccinationStatus: VaccinationStatus;
  healthScreening: HealthScreening;
  responsibleBreedingInfo?: ResponsibleBreedingInfo;
  createdAt: string;
  updatedAt: string;
}

export interface OwnerProfile {
  id: string;
  displayName: string;
  email: string;
  phone?: string;
  bio: string;
  avatarUrl?: string;
  city: string;
  area: string;
  joinedDate: string;
  activeDogId?: string;
  privacySettings: {
    showExactArea: boolean;
    showPhoneToMatchesOnly: boolean;
    allowBreedingInquiries: boolean;
  };
}

export interface Match {
  id: string;
  dog1Id: string;
  dog2Id: string;
  owner1Id: string;
  owner2Id: string;
  targetDog: Dog;
  matchedAt: string;
  status: 'active' | 'unmatched';
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface FilterPreferences {
  maxDistanceKm: number;
  purpose: 'all' | DogPurpose;
  sex: 'all' | DogSex;
  size: 'all' | DogSize;
  minAge: number;
  maxAge: number;
  energyLevel: 'all' | EnergyLevel;
  breedSearch: string;
}

export type ServiceCategory =
  | 'veterinary'
  | 'grooming'
  | 'boarding'
  | 'training'
  | 'walking'
  | 'supplies'
  | 'other';

export interface ServiceItem {
  id: string;
  name: string;
  price: string;
  duration?: string;
  description: string;
}

export interface ServiceProvider {
  id: string;
  businessName: string;
  category: ServiceCategory;
  categoryLabel: string;
  logoUrl: string;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  address: string;
  city: string;
  area: string;
  phone: string;
  email: string;
  website?: string;
  operatingHours: string;
  verifiedStatus: 'verified_partner' | 'community_listed';
  description: string;
  services: ServiceItem[];
  pricingRange: '₦' | '₦₦' | '₦₦₦' | '₦₦₦₦' | '$' | '$$' | '$$$';
}

export type EnquiryStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';

export interface ServiceEnquiry {
  id: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  dogId?: string;
  dogName?: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: EnquiryStatus;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  targetType: 'dog' | 'owner' | 'provider';
  targetId: string;
  targetName: string;
  reason: string;
  details: string;
  createdAt: string;
}

export type MatingRequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export interface MatingRequest {
  id: string;
  fromDogId: string;
  fromDog: Dog;
  fromOwnerId: string;
  fromOwnerName: string;
  fromOwnerAvatar?: string;
  fromOwnerPhone?: string;
  fromOwnerEmail?: string;
  toDogId: string;
  toDog: Dog;
  toOwnerId: string;
  toOwnerName: string;
  toOwnerAvatar?: string;
  toOwnerPhone?: string;
  toOwnerEmail?: string;
  status: MatingRequestStatus;
  termsProposed: string;
  healthCertAttached: boolean;
  pedigreeAttached: boolean;
  note: string;
  createdAt: string;
  updatedAt: string;
  responseNote?: string;
}

export interface BreedingFilters {
  breed: string;
  sex: 'all' | DogSex;
  minAge: number;
  maxAge: number;
  pedigreeOnly: boolean;
  healthClearedOnly: boolean;
  maxDistanceKm: number;
}
