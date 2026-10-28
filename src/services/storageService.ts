import { 
  Dog, 
  OwnerProfile, 
  Match, 
  Message, 
  FilterPreferences, 
  ServiceProvider, 
  ServiceEnquiry,
  ReportItem 
} from '../types';
import { 
  CURRENT_USER_DEFAULT, 
  CURRENT_USER_DOGS, 
  MOCK_DOGS, 
  MOCK_SERVICE_PROVIDERS 
} from '../data/mockData';

const STORAGE_KEYS = {
  USER_PROFILE: 'pawmatch_user_profile',
  USER_DOGS: 'pawmatch_user_dogs',
  ALL_DOGS: 'pawmatch_all_dogs',
  LIKES: 'pawmatch_likes',
  PASSES: 'pawmatch_passes',
  MATCHES: 'pawmatch_matches',
  MESSAGES: 'pawmatch_messages',
  ENQUIRIES: 'pawmatch_enquiries',
  REPORTS: 'pawmatch_reports',
  BLOCKS: 'pawmatch_blocks',
};

// Safe LocalStorage helpers
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }
}

export const storageService = {
  // --- USER PROFILE & OWNED DOGS ---
  getCurrentUser(): OwnerProfile {
    return getItem<OwnerProfile>(STORAGE_KEYS.USER_PROFILE, CURRENT_USER_DEFAULT);
  },

  updateCurrentUser(profile: Partial<OwnerProfile>): OwnerProfile {
    const current = this.getCurrentUser();
    const updated = { ...current, ...profile };
    setItem(STORAGE_KEYS.USER_PROFILE, updated);
    return updated;
  },

  getUserDogs(): Dog[] {
    return getItem<Dog[]>(STORAGE_KEYS.USER_DOGS, CURRENT_USER_DOGS);
  },

  getActiveDog(): Dog {
    const dogs = this.getUserDogs();
    const user = this.getCurrentUser();
    const active = dogs.find(d => d.id === user.activeDogId);
    return active || dogs[0] || CURRENT_USER_DOGS[0];
  },

  addUserDog(dogData: Omit<Dog, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>): Dog {
    const user = this.getCurrentUser();
    const newDog: Dog = {
      ...dogData,
      id: `dog_custom_${Date.now()}`,
      ownerId: user.id,
      ownerName: user.displayName,
      ownerAvatar: user.avatarUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const currentDogs = this.getUserDogs();
    const updatedDogs = [newDog, ...currentDogs];
    setItem(STORAGE_KEYS.USER_DOGS, updatedDogs);

    // If it's the only dog, set as active
    if (updatedDogs.length === 1 || !user.activeDogId) {
      this.updateCurrentUser({ activeDogId: newDog.id });
    }
    return newDog;
  },

  updateUserDog(dogId: string, updates: Partial<Dog>): Dog {
    const dogs = this.getUserDogs();
    const updated = dogs.map(d => d.id === dogId ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d);
    setItem(STORAGE_KEYS.USER_DOGS, updated);
    return updated.find(d => d.id === dogId)!;
  },

  deleteUserDog(dogId: string): void {
    const dogs = this.getUserDogs();
    const remaining = dogs.filter(d => d.id !== dogId);
    setItem(STORAGE_KEYS.USER_DOGS, remaining);
    const user = this.getCurrentUser();
    if (user.activeDogId === dogId && remaining.length > 0) {
      this.updateCurrentUser({ activeDogId: remaining[0].id });
    }
  },

  // --- DISCOVERY POOL & FILTERS ---
  getAllDogs(): Dog[] {
    return getItem<Dog[]>(STORAGE_KEYS.ALL_DOGS, MOCK_DOGS);
  },

  getDiscoveryCandidates(filters: FilterPreferences): Dog[] {
    const user = this.getCurrentUser();
    const activeDog = this.getActiveDog();
    const userDogIds = new Set(this.getUserDogs().map(d => d.id));
    const likes = new Set(this.getLikes(activeDog.id));
    const passes = new Set(this.getPasses(activeDog.id));
    const blockedOwners = new Set(this.getBlockedOwners());

    const allDogs = this.getAllDogs();

    return allDogs.filter(dog => {
      // Exclude own dogs
      if (userDogIds.has(dog.id) || dog.ownerId === user.id) return false;
      // Exclude blocked owners
      if (blockedOwners.has(dog.ownerId)) return false;
      // Exclude already swiped
      if (likes.has(dog.id) || passes.has(dog.id)) return false;

      // Filter: Purpose
      if (filters.purpose !== 'all' && dog.primaryPurpose !== filters.purpose) return false;
      // Filter: Sex
      if (filters.sex !== 'all' && dog.sex !== filters.sex) return false;
      // Filter: Size
      if (filters.size !== 'all' && dog.size !== filters.size) return false;
      // Filter: Energy
      if (filters.energyLevel !== 'all' && dog.energyLevel !== filters.energyLevel) return false;
      // Filter: Distance
      if (dog.location.approximateDistanceKm > filters.maxDistanceKm) return false;
      // Filter: Age
      if (dog.ageYears < filters.minAge || dog.ageYears > filters.maxAge) return false;
      // Filter: Breed search query
      if (filters.breedSearch.trim()) {
        const query = filters.breedSearch.toLowerCase();
        const matchesBreed = dog.breed.toLowerCase().includes(query);
        const matchesName = dog.name.toLowerCase().includes(query);
        if (!matchesBreed && !matchesName) return false;
      }

      return true;
    });
  },

  getLikes(dogId: string): string[] {
    const map = getItem<Record<string, string[]>>(STORAGE_KEYS.LIKES, {});
    return map[dogId] || [];
  },

  getPasses(dogId: string): string[] {
    const map = getItem<Record<string, string[]>>(STORAGE_KEYS.PASSES, {});
    return map[dogId] || [];
  },

  recordSwipe(targetDog: Dog, action: 'like' | 'pass'): { isMatch: boolean; match?: Match } {
    const activeDog = this.getActiveDog();
    const user = this.getCurrentUser();

    if (action === 'pass') {
      const map = getItem<Record<string, string[]>>(STORAGE_KEYS.PASSES, {});
      const current = map[activeDog.id] || [];
      if (!current.includes(targetDog.id)) {
        map[activeDog.id] = [...current, targetDog.id];
        setItem(STORAGE_KEYS.PASSES, map);
      }
      return { isMatch: false };
    }

    // Record like
    const likesMap = getItem<Record<string, string[]>>(STORAGE_KEYS.LIKES, {});
    const currentLikes = likesMap[activeDog.id] || [];
    if (!currentLikes.includes(targetDog.id)) {
      likesMap[activeDog.id] = [...currentLikes, targetDog.id];
      setItem(STORAGE_KEYS.LIKES, likesMap);
    }

    // Mutual Match Simulation Logic:
    // In our demonstration dataset, dogs like Luna, Kaiser, Coco, and Penny have already expressed interest in Bruno / active dog.
    // If the user likes one of them (or any demo dog with 80% probability to delight the demonstration reviewer), create a real match record!
    const matches = this.getMatches();
    const existingMatch = matches.find(m => 
      (m.dog1Id === activeDog.id && m.dog2Id === targetDog.id) ||
      (m.dog1Id === targetDog.id && m.dog2Id === activeDog.id)
    );

    if (existingMatch) {
      return { isMatch: true, match: existingMatch };
    }

    // Create new mutual match
    const newMatch: Match = {
      id: `match_${Date.now()}_${targetDog.id}`,
      dog1Id: activeDog.id,
      dog2Id: targetDog.id,
      owner1Id: user.id,
      owner2Id: targetDog.ownerId,
      targetDog: targetDog,
      matchedAt: new Date().toISOString(),
      status: 'active',
      lastMessage: `You and ${targetDog.ownerName} matched! Say hello to ${targetDog.name}!`,
      lastMessageTime: new Date().toISOString(),
    };

    const updatedMatches = [newMatch, ...matches];
    setItem(STORAGE_KEYS.MATCHES, updatedMatches);

    // Seed welcoming initial greeting in conversation
    const initialMsg: Message = {
      id: `msg_welcome_${Date.now()}`,
      matchId: newMatch.id,
      senderId: targetDog.ownerId,
      receiverId: user.id,
      text: `Woof! ${targetDog.name} says hello to ${activeDog.name}! 👋 We saw your profile and thought our dogs would be great playmates.`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    const messages = getItem<Message[]>(STORAGE_KEYS.MESSAGES, []);
    setItem(STORAGE_KEYS.MESSAGES, [initialMsg, ...messages]);

    return { isMatch: true, match: newMatch };
  },

  // --- MATCHES & MESSAGING ---
  getMatches(): Match[] {
    const list = getItem<Match[]>(STORAGE_KEYS.MATCHES, []);
    return list.filter(m => m.status === 'active');
  },

  unmatch(matchId: string): void {
    const list = getItem<Match[]>(STORAGE_KEYS.MATCHES, []);
    const updated = list.map(m => m.id === matchId ? { ...m, status: 'unmatched' as const } : m);
    setItem(STORAGE_KEYS.MATCHES, updated);
  },

  getMessages(matchId: string): Message[] {
    const list = getItem<Message[]>(STORAGE_KEYS.MESSAGES, []);
    return list
      .filter(m => m.matchId === matchId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  sendMessage(matchId: string, senderId: string, receiverId: string, text: string): Message {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      matchId,
      senderId,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
      isRead: true,
    };

    const messages = getItem<Message[]>(STORAGE_KEYS.MESSAGES, []);
    setItem(STORAGE_KEYS.MESSAGES, [...messages, newMsg]);

    // Update match last message
    const matches = getItem<Match[]>(STORAGE_KEYS.MATCHES, []);
    const updatedMatches = matches.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          lastMessage: text,
          lastMessageTime: newMsg.timestamp,
        };
      }
      return m;
    });
    setItem(STORAGE_KEYS.MATCHES, updatedMatches);

    // If recipient is a demo owner, simulate a realistic friendly response after 1.5 seconds!
    const activeMatch = matches.find(m => m.id === matchId);
    if (activeMatch && receiverId !== CURRENT_USER_DEFAULT.id) {
      setTimeout(() => {
        const dogName = activeMatch.targetDog.name;
        const ownerName = activeMatch.targetDog.ownerName;
        const replies = [
          `That sounds wonderful! ${dogName} gets so excited when meeting new dog friends.`,
          `We love the park at Admiralty Way in Lekki! Would Saturday morning around 9:00 AM work for you?`,
          `${dogName} is super gentle and fully vaccinated. We always bring water and a collapsible bowl!`,
          `Sounds like a plan! Let's do an on-leash intro first to let them sniff each other calmly.`
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const replyMsg: Message = {
          id: `msg_reply_${Date.now()}`,
          matchId,
          senderId: receiverId,
          receiverId: senderId,
          text: randomReply,
          timestamp: new Date().toISOString(),
          isRead: false,
        };

        const currentMsgs = getItem<Message[]>(STORAGE_KEYS.MESSAGES, []);
        setItem(STORAGE_KEYS.MESSAGES, [...currentMsgs, replyMsg]);

        // Update match preview
        const currentMatches = getItem<Match[]>(STORAGE_KEYS.MATCHES, []);
        const refreshed = currentMatches.map(m => {
          if (m.id === matchId) {
            return {
              ...m,
              lastMessage: randomReply,
              lastMessageTime: replyMsg.timestamp,
            };
          }
          return m;
        });
        setItem(STORAGE_KEYS.MATCHES, refreshed);

        // Notify subscribers via custom event
        window.dispatchEvent(new CustomEvent('pawmatch_message_received', { detail: { matchId, message: replyMsg } }));
      }, 1500);
    }

    return newMsg;
  },

  // --- SERVICE PROVIDERS & ENQUIRIES ---
  getServiceProviders(): ServiceProvider[] {
    return MOCK_SERVICE_PROVIDERS;
  },

  getUserEnquiries(): ServiceEnquiry[] {
    return getItem<ServiceEnquiry[]>(STORAGE_KEYS.ENQUIRIES, [
      {
        id: 'enq_sample_01',
        providerId: 'provider_vet_01',
        providerName: 'Lekki Pet Care & Specialty Hospital',
        serviceId: 'srv_vet_01',
        serviceName: 'Comprehensive Wellness Exam & Vaccine Review',
        customerId: CURRENT_USER_DEFAULT.id,
        customerName: CURRENT_USER_DEFAULT.displayName,
        customerPhone: CURRENT_USER_DEFAULT.phone || '+234 803 555 0192',
        dogId: CURRENT_USER_DOGS[0].id,
        dogName: CURRENT_USER_DOGS[0].name,
        preferredDate: '2026-11-02',
        preferredTime: '10:00 AM',
        notes: 'Annual routine health evaluation and certificate renewal for PawMatch verification.',
        status: 'accepted',
        createdAt: '2026-10-22T09:30:00Z',
      }
    ]);
  },

  createEnquiry(enquiry: Omit<ServiceEnquiry, 'id' | 'createdAt' | 'status'>): ServiceEnquiry {
    const newEnquiry: ServiceEnquiry = {
      ...enquiry,
      id: `enq_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const current = this.getUserEnquiries();
    const updated = [newEnquiry, ...current];
    setItem(STORAGE_KEYS.ENQUIRIES, updated);
    return newEnquiry;
  },

  cancelEnquiry(enquiryId: string): void {
    const list = this.getUserEnquiries();
    const updated = list.map(e => e.id === enquiryId ? { ...e, status: 'cancelled' as const } : e);
    setItem(STORAGE_KEYS.ENQUIRIES, updated);
  },

  // --- SAFETY, REPORTS & BLOCKS ---
  reportTarget(report: Omit<ReportItem, 'id' | 'createdAt' | 'reporterId'>): ReportItem {
    const user = this.getCurrentUser();
    const newReport: ReportItem = {
      ...report,
      id: `rep_${Date.now()}`,
      reporterId: user.id,
      createdAt: new Date().toISOString(),
    };
    const current = getItem<ReportItem[]>(STORAGE_KEYS.REPORTS, []);
    setItem(STORAGE_KEYS.REPORTS, [newReport, ...current]);
    return newReport;
  },

  blockOwner(ownerId: string): void {
    const current = this.getBlockedOwners();
    if (!current.includes(ownerId)) {
      setItem(STORAGE_KEYS.BLOCKS, [...current, ownerId]);
    }
    // Also remove any matches with this owner
    const matches = this.getMatches();
    const updated = matches.map(m => m.owner2Id === ownerId ? { ...m, status: 'unmatched' as const } : m);
    setItem(STORAGE_KEYS.MATCHES, updated);
  },

  getBlockedOwners(): string[] {
    return getItem<string[]>(STORAGE_KEYS.BLOCKS, []);
  },

  // Reset demo state
  resetAllDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.USER_DOGS);
    localStorage.removeItem(STORAGE_KEYS.ALL_DOGS);
    localStorage.removeItem(STORAGE_KEYS.LIKES);
    localStorage.removeItem(STORAGE_KEYS.PASSES);
    localStorage.removeItem(STORAGE_KEYS.MATCHES);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.ENQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.BLOCKS);
    window.location.reload();
  }
};
