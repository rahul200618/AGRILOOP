import React, { useState, useEffect } from 'react';
import { UserRole, Listing, User, ListingStatus, Bid, WasteAnalysis } from './utils/types';
import { database } from './utils/database';
import { LoginScreen } from './screens/LoginScreen';
import { NatureAuthScreen } from './screens/NatureAuthScreen';
import { Scanner } from './components/ScanWaste/Scanner';
import { RewardsDashboardScreen } from './screens/RewardsDashboardScreen';
import { FarmingGuideScreen } from './screens/FarmingGuideScreen';
import { MarketplaceScreen } from './screens/MarketplaceScreen';
import { ScanResultListingScreen } from './screens/ScanResultListingScreen';
import { HouseholdScreen } from './screens/HouseholdScreen';
import { BiogasMarketplaceScreen } from './screens/BiogasMarketplaceScreen';
import { LearningHubScreen } from './screens/LearningHubScreen';
import { AboutScreen } from './screens/AboutScreen';
import { Plus, Home, ShoppingBag, User as UserIcon, Calculator, LogOut, Sprout, Flame, BookOpen } from 'lucide-react';
import { TargetCursor } from './components/Common/TargetCursor';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
}

const MOCK_LISTINGS: Listing[] = [
  {
    id: 'l1',
    farmerName: 'Harpreet Singh',
    image: 'https://images.unsplash.com/photo-1595859703053-96a16ebc863b?auto=format&fit=crop&q=80&w=800',
    analysis: {
      residueType: 'Wheat Straw',
      suggestedUses: ['Biofuel', 'Cattle Feed'],
      transportFeasibility: 'High',
      environmentalImpactScore: 8,
      estimatedPriceRange: '₹3,000 - ₹4,000',
      confidence: 0.95,
      moistureContent: '12%',
      purityScore: 90,
      co2Saved: 450
    },
    quantity: 12,
    location: 'Sangrur, Punjab',
    status: ListingStatus.OPEN,
    timestamp: Date.now() - 100000000,
    bids: [],
    wasteCategory: 'FARM_CROP',
    degradability: 'DEGRADABLE'
  },
  {
    id: 'l2',
    farmerName: 'Gurmeet Kaur',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=800',
    analysis: {
      residueType: 'Rice Stubble',
      suggestedUses: ['Composting', 'Mushroom'],
      transportFeasibility: 'Medium',
      environmentalImpactScore: 7,
      estimatedPriceRange: '₹2,500 - ₹3,200',
      confidence: 0.88,
      moistureContent: '18%',
      purityScore: 85,
      co2Saved: 320
    },
    quantity: 8,
    location: 'Patiala, Punjab',
    status: ListingStatus.OPEN,
    timestamp: Date.now() - 200000000,
    bids: [],
    wasteCategory: 'FARM_CROP',
    degradability: 'DEGRADABLE'
  }
];

function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'marketplace' | 'planner' | 'profile' | 'household' | 'biogas' | 'learning' | 'about'>('dashboard');
  const [showScanner, setShowScanner] = useState(false);
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [scanResult, setScanResult] = useState<{image: string, analysis: WasteAnalysis} | null>(null);

  // Load user data from database on app start
  useEffect(() => {
    const currentUser = database.getCurrentUser();
    if (currentUser) {
      const user: User = {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        carbonPoints: currentUser.carbonPoints,
        walletBalance: currentUser.walletBalance
      };
      setUser(user);
      setAuthUser({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        location: currentUser.location
      });
    }
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowAuth(true);
  };

  const handleAuthComplete = (userData: AuthUser) => {
    setAuthUser(userData);
    if (selectedRole) {
      handleLogin(selectedRole, userData);
    }
  };

  const handleLogin = (role: UserRole, userData?: AuthUser) => {
    const authData = userData || authUser;
    if (!authData) return;
    
    // Register/login user in database
    const dbUser = database.registerUser(authData, role);
    
    const user: User = {
      id: dbUser.id,
      name: dbUser.name,
      role: dbUser.role,
      carbonPoints: dbUser.carbonPoints,
      walletBalance: dbUser.walletBalance
    };
    
    setUser(user);
    setAuthUser(authData);
    setShowAuth(false);
    
    // Set appropriate tab based on role
    switch(role) {
        case UserRole.FARMER:
        case UserRole.BUYER:
            setActiveTab('dashboard');
            break;
        case UserRole.HOUSEHOLD:
            setActiveTab('household');
            break;
        case UserRole.BIOGAS:
            setActiveTab('biogas');
            break;
        case UserRole.LEARNER:
            setActiveTab('learning');
            break;
    }
  };

  const handleLogout = () => {
    database.logout();
    setUser(null);
    setAuthUser(null);
  };

  const handleScanComplete = (image: string, analysis: WasteAnalysis) => {
    setShowScanner(false);
    setScanResult({ image, analysis });
  };

  const confirmListing = () => {
    if (!scanResult || !user) return;
    
    const newListing: Listing = {
      id: Math.random().toString(36).substr(2, 9),
      farmerName: user.name,
      image: scanResult.image,
      analysis: scanResult.analysis,
      quantity: 5, // Default for demo
      location: 'Ludhiana, Punjab',
      status: ListingStatus.OPEN,
      timestamp: Date.now(),
      bids: [],
      wasteCategory: 'FARM_CROP',
      degradability: 'DEGRADABLE'
    };

    setListings(prev => [newListing, ...prev]);
    setScanResult(null);
    setActiveTab('marketplace');
  };

  const renderContent = () => {
    if (showAuth && !user) {
        return <NatureAuthScreen onAuthComplete={handleAuthComplete} />;
    }
    
    if (!user) {
        return <LoginScreen onLogin={handleRoleSelect} />;
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
        {/* Enhanced Header */}
        <header className="glass sticky top-0 z-30 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
                    <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Sprout size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold gradient-text tracking-tight">AgriLoop</h1>
                        <p className="text-xs text-gray-500 font-medium">Circular Economy</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="hidden lg:flex items-center space-x-2">
                {(user.role === UserRole.FARMER || user.role === UserRole.BUYER) && (
                    <>
                        <button onClick={() => setActiveTab('dashboard')} className={`cursor-target flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}`}>
                            <Home size={18} /> Dashboard
                        </button>
                        <button onClick={() => setActiveTab('marketplace')} className={`cursor-target flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'marketplace' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}`}>
                            <ShoppingBag size={18} /> Marketplace
                        </button>
                    </>
                )}
                
                {(user.role === UserRole.FARMER || user.role === UserRole.LEARNER) && (
                   <button onClick={() => setActiveTab('learning')} className={`cursor-target flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'learning' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}`}>
                        <BookOpen size={18} /> Learning
                   </button>
                )}

                <button onClick={() => setActiveTab('about')} className={`cursor-target flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'about' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}`}>
                    About
                </button>

                {user.role === UserRole.FARMER && (
                    <button onClick={() => setActiveTab('planner')} className={`cursor-target flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'planner' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}`}>
                        <Calculator size={18} /> Planner
                    </button>
                )}

                {user.role === UserRole.HOUSEHOLD && (
                    <button onClick={() => setActiveTab('household')} className={`cursor-target flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'household' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}`}>
                        <Home size={18} /> Submit Waste
                    </button>
                )}

                {user.role === UserRole.BIOGAS && (
                    <button onClick={() => setActiveTab('biogas')} className={`cursor-target flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'biogas' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}`}>
                        <Flame size={18} /> Procurement
                    </button>
                )}
                </nav>

                {/* User Profile & Actions */}
                <div className="flex items-center gap-4">
                    {/* Carbon Points Badge */}
                    <div className="hidden md:flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold text-green-700">{user.carbonPoints} pts</span>
                    </div>
                    
                    {/* User Info */}
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 capitalize">{user.role.toLowerCase()}</p>
                    </div>
                    
                    {/* Profile Avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {user.name.charAt(0)}
                    </div>
                    
                    {/* Logout Button */}
                    <button onClick={handleLogout} className="cursor-target p-2.5 text-gray-400 hover:text-red-500 transition-all duration-300 rounded-xl hover:bg-red-50 group" title="Logout">
                        <LogOut size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                    </button>
                </div>
            </div>
            </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'dashboard' && <RewardsDashboardScreen user={user} listings={listings} />}
            {activeTab === 'marketplace' && (
                <MarketplaceScreen 
                    user={user} listings={listings}
                    onAcceptBid={() => {}} onConfirmPickup={() => {}} onPlaceBid={() => {}}
                    onScanRequest={() => setShowScanner(true)}
                />
            )}
            {activeTab === 'planner' && user.role === UserRole.FARMER && <div className="max-w-3xl mx-auto"><FarmingGuideScreen /></div>}
            {activeTab === 'household' && user.role === UserRole.HOUSEHOLD && <HouseholdScreen user={user} onSubmitWaste={() => {}} listings={listings} />}
            {activeTab === 'biogas' && user.role === UserRole.BIOGAS && <BiogasMarketplaceScreen user={user} listings={listings} onCollectWaste={() => {}} />}
            {activeTab === 'learning' && <LearningHubScreen />}
            {activeTab === 'about' && <AboutScreen />}

        </main>

        {/* FAB for Farmer */}
        {user.role === UserRole.FARMER && (
            <div className={`fixed bottom-24 right-6 md:bottom-12 md:right-12 z-40`}>
                <button onClick={() => setShowScanner(true)} className="group flex items-center gap-2 pl-4 pr-2 py-2 h-14 bg-green-600 rounded-full shadow-lg shadow-green-600/40 text-white hover:bg-green-700 transition-transform hover:scale-105 active:scale-95">
                    <span className="font-bold pr-2 hidden md:block">Scan Waste</span>
                    <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Plus size={24} strokeWidth={3} /></span>
                </button>
            </div>
        )}

        {/* Overlays */}
        {showScanner && <Scanner onScanComplete={handleScanComplete} onCancel={() => setShowScanner(false)} />}
        {scanResult && <ScanResultListingScreen scanResult={scanResult} onCancel={() => setScanResult(null)} onConfirm={confirmListing} />}
        </div>
    );
  };

  return (
    <>
        <TargetCursor spinDuration={4} hideDefaultCursor={true} parallaxOn={true} />
        {renderContent()}
    </>
  );
}

export default App;