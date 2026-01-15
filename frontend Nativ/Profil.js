import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './Login';
import Register from './Register';
import Felhasznalo from './Felhasznalo';

const Profil = () => {
  const [currentScreen, setCurrentScreen] = useState('loading');

  useEffect(() => {
    const checkAuth = async () => {
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

  const navigateToRegister = () => setCurrentScreen('register');
  const navigateToLogin = () => setCurrentScreen('login');
  const navigateToFelhasznalo = () => setCurrentScreen('felhasznalo');

  if (currentScreen === 'loading') {
    return <View style={{ flex: 1 }} />;
  }

  if (currentScreen === 'register') {
    return <Register onNavigateToLogin={navigateToLogin} />;
  }

  if (currentScreen === 'felhasznalo') {
    return <Felhasznalo onLogout={navigateToLogin} />;
  }

  return <Login onNavigateToRegister={navigateToRegister} onLoginSuccess={navigateToFelhasznalo} />;
};

export default Profil;
