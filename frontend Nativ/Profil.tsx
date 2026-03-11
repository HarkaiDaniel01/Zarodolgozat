import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './Login';
import Register from './Register';
import Felhasznalo from './Felhasznalo';
import OsszesNyeremeny from './OsszesNyeremeny';
import HibaBejentesek from './HibaBejentesek';

type CurrentScreen = 'loading' | 'register' | 'felhasznalo' | 'osszesNyeremeny' | 'hibabejentesek' | 'login';

const Profil: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('loading');

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setCurrentScreen('felhasznalo');
        } else {
          setCurrentScreen('login');
        }
      } catch (error) {
        console.log('Profil checkAuth Error:', error);
        setCurrentScreen('login');
      }
    };
    checkAuth();
  }, []);

  const navigateToRegister = (): void => setCurrentScreen('register');
  const navigateToLogin = (): void => setCurrentScreen('login');
  const navigateToFelhasznalo = (): void => setCurrentScreen('felhasznalo');
  const navigateToOsszesNyeremeny = (): void => setCurrentScreen('osszesNyeremeny');
  const navigateToHibaBejentesek = (): void => setCurrentScreen('hibabejentesek');

  if (currentScreen === 'loading') {
    return <View style={{ flex: 1 }} />;
  }

  if (currentScreen === 'register') {
    return <Register onNavigateToLogin={navigateToLogin} />;
  }

  if (currentScreen === 'felhasznalo') {
    return <Felhasznalo onLogout={navigateToLogin} onNavigateToWinnings={navigateToOsszesNyeremeny} onNavigateToIssues={navigateToHibaBejentesek} />;
  }

  if (currentScreen === 'osszesNyeremeny') {
    return <OsszesNyeremeny onBack={navigateToFelhasznalo} />;
  }

  if (currentScreen === 'hibabejentesek') {
    return <HibaBejentesek onBack={navigateToFelhasznalo} />;
  }

  return <Login onNavigateToRegister={navigateToRegister} onLoginSuccess={navigateToFelhasznalo} />;
};

export default Profil;
