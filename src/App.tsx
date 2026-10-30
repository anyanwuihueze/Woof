import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { DiscoveryView } from './components/DiscoveryView';
import { MatchesView } from './components/MatchesView';
import { PetServicesMarketplace } from './components/PetServicesMarketplace';
import { OwnerProfileView } from './components/OwnerProfileView';
import { DogDetailModal } from './components/DogDetailModal';
import { FilterModal } from './components/FilterModal';
import { MatchCelebrationModal } from './components/MatchCelebrationModal';
import { ChatModal } from './components/ChatModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AddEditDogModal } from './components/AddEditDogModal';
import { TrustSafetyModal } from './components/TrustSafetyModal';
import { ReportBlockModal } from './components/ReportBlockModal';
import { FindMateView } from './components/FindMateView';

import {
  Dog,
  OwnerProfile,
  Match,
  FilterPreferences,
  MatingRequest
} from './types';
import { storageService } from './services/storageService';

export default function App() {
  // Navigation & Core State
  const [activeTab, setActiveTab] = useState<'landing' | 'discovery' | 'find-mate' | 'matches' | 'services' | 'profile'>('landing');
  const [currentUser, setCurrentUser] = useState<OwnerProfile>(storageService.getCurrentUser());
  const [userDogs, setUserDogs] = useState<Dog[]>(storageService.getUserDogs());
  const [activeDog, setActiveDog] = useState<Dog>(storageService.getActiveDog());
  const [matches, setMatches] = useState<Match[]>(storageService.getMatches());
  const [matingRequests, setMatingRequests] = useState<MatingRequest[]>(storageService.getMatingRequests());

  // Filter State
  const [filterPreferences, setFilterPreferences] = useState<FilterPreferences>({
    maxDistanceKm: 25,
    purpose: 'all',
    sex: 'all',
    size: 'all',
    minAge: 0,
    maxAge: 15,
    energyLevel: 'all',
    breedSearch: '',
  });

  // Modal States
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedDogDetail, setSelectedDogDetail] = useState<Dog | null>(null);
  const [celebrationMatch, setCelebrationMatch] = useState<Match | null>(null);
  const [activeChatMatch, setActiveChatMatch] = useState<Match | null>(null);

  // Add / Edit Dog Modal State
  const [dogModalState, setDogModalState] = useState<{
    isOpen: boolean;
    initialDog?: Dog | null;
  }>({ isOpen: false, initialDog: null });

  // Report & Block Modal State
  const [reportBlockState, setReportBlockState] = useState<{
    isOpen: boolean;
    mode: 'report' | 'block';
    targetDog?: Dog | null;
    targetOwnerId?: string | null;
    targetOwnerName?: string | null;
  }>({ isOpen: false, mode: 'report' });

  // Sync state on load or change
  const refreshAppData = () => {
    const user = storageService.getCurrentUser();
    const dogs = storageService.getUserDogs();
    const active = storageService.getActiveDog();
    const currentMatches = storageService.getMatches();
    const reqs = storageService.getMatingRequests();

    setCurrentUser(user);
    setUserDogs(dogs);
    setActiveDog(active);
    setMatches(currentMatches);
    setMatingRequests(reqs);
  };

  useEffect(() => {
    refreshAppData();
  }, []);

  const handleSelectActiveDog = (dogId: string) => {
    storageService.updateCurrentUser({ activeDogId: dogId });
    refreshAppData();
  };

  const handleSaveDog = (dogData: any) => {
    if (dogModalState.initialDog) {
      storageService.updateUserDog(dogModalState.initialDog.id, dogData);
    } else {
      storageService.addUserDog(dogData);
    }
    refreshAppData();
  };

  const handleCompleteOnboarding = (data: any) => {
    storageService.updateCurrentUser(data.owner);
    const newDog = storageService.addUserDog(data.dog);
    storageService.updateCurrentUser({ activeDogId: newDog.id });
    if (data.preferences?.maxDistanceKm) {
      setFilterPreferences(prev => ({ ...prev, maxDistanceKm: data.preferences.maxDistanceKm }));
    }
    refreshAppData();
    setActiveTab('discovery');
  };

  const handleMatchCreated = (match: Match) => {
    setMatches(storageService.getMatches());
    setCelebrationMatch(match);
  };

  const pendingMatingCount = matingRequests.filter(
    r => (r.toDogId === activeDog.id || r.toOwnerId === currentUser.id) && r.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#24352D] flex flex-col font-sans pb-16 md:pb-0 overflow-x-hidden w-full max-w-full">

      {/* Global Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        matchesCount={matches.length}
        pendingMatingRequestsCount={pendingMatingCount}
        currentUser={currentUser}
        activeDog={activeDog}
        userDogs={userDogs}
        onSelectActiveDog={handleSelectActiveDog}
        onOpenNewDogModal={() => setDogModalState({ isOpen: true, initialDog: null })}
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onStartDiscovery={() => setActiveTab('discovery')}
            onExploreServices={() => setActiveTab('services')}
            onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
            previewDogs={storageService.getAllDogs()}
          />
        )}

        {activeTab === 'discovery' && (
          <DiscoveryView
            activeDog={activeDog}
            onOpenDogDetail={(dog) => setSelectedDogDetail(dog)}
            onMatchCreated={handleMatchCreated}
            onOpenFilters={() => setIsFiltersOpen(true)}
            filterPreferences={filterPreferences}
          />
        )}

        {activeTab === 'find-mate' && (
          <FindMateView
            activeDog={activeDog}
            userDogs={userDogs}
            onSelectActiveDog={handleSelectActiveDog}
            onOpenDogDetail={(dog) => setSelectedDogDetail(dog)}
            onOpenChat={(partnerDog, partnerOwnerName) => {
              const existingMatch = matches.find(m => m.targetDog.id === partnerDog.id);
              if (existingMatch) {
                setActiveChatMatch(existingMatch);
              } else {
                const matingMatch: Match = {
                  id: `mating_conn_${partnerDog.id}`,
                  dog1Id: activeDog.id,
                  dog2Id: partnerDog.id,
                  owner1Id: currentUser.id,
                  owner2Id: partnerDog.ownerId,
                  targetDog: partnerDog,
                  matchedAt: new Date().toISOString(),
                  status: 'active',
                  lastMessage: `Mating connection confirmed with ${partnerOwnerName}.`,
                  lastMessageTime: 'Just now',
                };
                setActiveChatMatch(matingMatch);
              }
            }}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesView
            matches={matches}
            onOpenChat={(match) => setActiveChatMatch(match)}
            onOpenDogDetail={(dog) => setSelectedDogDetail(dog)}
            onStartDiscovery={() => setActiveTab('discovery')}
            onRefreshMatches={refreshAppData}
          />
        )}

        {activeTab === 'services' && (
          <PetServicesMarketplace
            currentUser={currentUser}
            activeDog={activeDog}
            userDogs={userDogs}
          />
        )}

        {activeTab === 'profile' && (
          <OwnerProfileView
            currentUser={currentUser}
            userDogs={userDogs}
            activeDog={activeDog}
            onSelectActiveDog={handleSelectActiveDog}
            onOpenAddDog={() => setDogModalState({ isOpen: true, initialDog: null })}
            onOpenEditDog={(dog) => setDogModalState({ isOpen: true, initialDog: dog })}
            onUpdateUser={(updates) => {
              storageService.updateCurrentUser(updates);
              refreshAppData();
            }}
            onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
            onStartDiscovery={() => setActiveTab('discovery')}
          />
        )}
      </main>

      {/* --- MODALS & DIALOGS --- */}

      {/* Dog Detail Modal */}
      <DogDetailModal
        dog={selectedDogDetail}
        onClose={() => setSelectedDogDetail(null)}
        onLike={(dog) => {
          const res = storageService.recordSwipe(dog, 'like');
          if (res.isMatch && res.match) {
            handleMatchCreated(res.match);
          }
          setSelectedDogDetail(null);
        }}
        onPass={(dog) => {
          storageService.recordSwipe(dog, 'pass');
          setSelectedDogDetail(null);
        }}
        onReport={(dog) => {
          setSelectedDogDetail(null);
          setReportBlockState({
            isOpen: true,
            mode: 'report',
            targetDog: dog,
          });
        }}
        onBlock={(ownerId, ownerName) => {
          setSelectedDogDetail(null);
          setReportBlockState({
            isOpen: true,
            mode: 'block',
            targetOwnerId: ownerId,
            targetOwnerName: ownerName,
          });
        }}
      />

      {/* Discovery Filters Modal */}
      <FilterModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        currentFilters={filterPreferences}
        onApplyFilters={(newFilters) => setFilterPreferences(newFilters)}
      />

      {/* Mutual Match Celebration Modal */}
      <MatchCelebrationModal
        match={celebrationMatch}
        activeDog={activeDog}
        onClose={() => setCelebrationMatch(null)}
        onStartChat={(match) => {
          setCelebrationMatch(null);
          setActiveChatMatch(match);
        }}
      />

      {/* Owner-to-Owner Chat Modal */}
      <ChatModal
        match={activeChatMatch}
        currentUser={currentUser}
        activeDog={activeDog}
        onClose={() => {
          setActiveChatMatch(null);
          refreshAppData();
        }}
        onOpenDogDetail={(dog) => setSelectedDogDetail(dog)}
      />

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleCompleteOnboarding}
      />

      {/* Add / Edit Dog Profile Modal */}
      <AddEditDogModal
        isOpen={dogModalState.isOpen}
        initialDog={dogModalState.initialDog}
        onClose={() => setDogModalState({ isOpen: false, initialDog: null })}
        onSave={handleSaveDog}
      />

      {/* Trust & Safety Protocol Modal */}
      <TrustSafetyModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />

      {/* Report & Block Modal */}
      {reportBlockState.isOpen && (
        <ReportBlockModal
          mode={reportBlockState.mode}
          targetDog={reportBlockState.targetDog}
          targetOwnerId={reportBlockState.targetOwnerId}
          targetOwnerName={reportBlockState.targetOwnerName}
          onClose={() => setReportBlockState({ isOpen: false, mode: 'report' })}
          onSuccess={() => {
            refreshAppData();
          }}
        />
      )}

    </div>
  );
}
