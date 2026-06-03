import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PublicDirectory from './components/PublicDirectory';
import Screener from './components/Screener';
import FamilyDashboard from './components/FamilyDashboard';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [currentTab, setCurrentTab] = useState('directory'); // 'directory' | 'dashboard' | 'screener' | 'admin'
  const [profilesList, setProfilesList] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);

  // Initialize with a high-trust default profile so that the Dashboard is gorgeous immediately!
  useEffect(() => {
    // Check localStorage first
    const saved = localStorage.getItem('ca_disability_profiles');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        setProfilesList(parsed);
        setActiveProfile(parsed[0]);
        return;
      }
    }

    // Default Seed Profile (Leo, Down Syndrome, age 6, LA)
    const seedProfile = {
      id: 'profile-leo-12',
      nickname: 'Leo',
      dob: '2020-04-12', // Will calculate as ~6 years old in 2026
      countyId: 'los-angeles',
      zipCode: '90010',
      conditionIds: ['down-syndrome'],
      suspectedConditionIds: [],
      functionalNeedIds: ['speech-therapy', 'respite-care', 'diapers-incontinence-supplies', 'iep-evaluation'],
      insuranceType: 'both', // Medi-Cal secondary + Private primary
      schoolStatus: 'iep',
      currentServiceIds: ['iep-special-education', 'early-start'],
      languagePreference: 'english',
      caregiverNotes: 'Leo has moderate speech delays and mild hypotonia. Seeking protective supervision under IHSS.',
      statusMap: {
        'ihss-for-children': 'gathering-documents',
        'iep-special-education': 'approved',
        'regional-centers': 'waiting',
        'calable': 'recommended'
      }
    };

    setProfilesList([seedProfile]);
    setActiveProfile(seedProfile);
    localStorage.setItem('ca_disability_profiles', JSON.stringify([seedProfile]));
  }, []);

  // Sync profile edits
  const handleUpdateProfile = (id, updatedFields) => {
    const newList = profilesList.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    setProfilesList(newList);
    const active = newList.find(p => p.id === id);
    if (active) setActiveProfile(active);
    localStorage.setItem('ca_disability_profiles', JSON.stringify(newList));
  };

  // Add new profile from screener onboarding
  const handleRegisterProfile = (newProfileData) => {
    const newProfile = {
      ...newProfileData,
      id: 'profile-' + Date.now(),
      statusMap: {
        'ihss-for-children': 'recommended',
        'iep-special-education': 'recommended',
        'regional-centers': 'recommended'
      }
    };
    const newList = [newProfile, ...profilesList];
    setProfilesList(newList);
    setActiveProfile(newProfile);
    localStorage.setItem('ca_disability_profiles', JSON.stringify(newList));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Navigation Header */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        userProfilesCount={profilesList.length} 
      />

      {/* Main Core Router View */}
      <main style={{ flex: 1 }} className="container animate-fade-in">
        {currentTab === 'directory' && (
          <PublicDirectory 
            setCurrentTab={setCurrentTab} 
          />
        )}
        
        {currentTab === 'screener' && (
          <Screener 
            onRegisterProfile={handleRegisterProfile} 
            setCurrentTab={setCurrentTab} 
          />
        )}
        
        {currentTab === 'dashboard' && (
          <FamilyDashboard 
            activeProfile={activeProfile}
            setActiveProfile={setActiveProfile}
            profilesList={profilesList}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
        
        {currentTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Footer */}
      <Footer 
        setCurrentTab={setCurrentTab} 
      />

    </div>
  );
}
