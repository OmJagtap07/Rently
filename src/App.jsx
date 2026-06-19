import React, { useState, useEffect } from 'react';
import { auth, provider, db } from './config/firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Wallet } from 'lucide-react';

// Import Pages & Components
import RoleSelection from './components/RoleSelection.jsx';
import LandlordApp from './LandlordApp.jsx';
import TenantApp from './TenantApp.jsx';
import { PropertyProvider } from './context/PropertyContext.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingUserProfile, setLoadingUserProfile] = useState(false);

  useEffect(() => {
    let unsubscribeDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        setLoadingUserProfile(true);
        // Subscribe to user document
        const userRef = doc(db, 'users', u.uid);
        
        unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData(null);
          }
          setLoadingUserProfile(false);
          setLoading(false);
        });
      } else {
        setUser(null);
        setUserData(null);
        if (unsubscribeDoc) {
          unsubscribeDoc();
          unsubscribeDoc = null;
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const u = result.user;
      
      // Immediately create user document if it doesn't exist
      const userRef = doc(db, 'users', u.uid);
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
          role: null,
          onboardingCompleted: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  // 1. IF NOT LOGGED IN -> Show Login Page
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 p-8 rounded-2xl text-center backdrop-blur-xl shadow-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/20">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">RentManager</h1>
          <p className="text-slate-400 mb-8">Professional Property Management SaaS</p>
          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/25"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // 2. Loading User Profile
  if (loadingUserProfile) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Profile...</div>;
  }

  // 3. User Exists, but No Role -> Role Selection
  if (!userData?.role) {
    return <RoleSelection user={user} />;
  }

  // 4. Role Exists -> Route based on Role
  if (userData.role === 'landlord') {
    return (
      <PropertyProvider user={user}>
        <LandlordApp user={user} />
      </PropertyProvider>
    );
  }

  if (userData.role === 'tenant') {
    return <TenantApp user={user} />;
  }

  // Fallback if role is unrecognized
  return <RoleSelection user={user} />;
}

export default App;