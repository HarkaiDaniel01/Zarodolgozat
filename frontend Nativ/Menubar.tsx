import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Kategoria from './Kategoria';
import Profil from './Profil';
import Rekordok from './Rekordok';
import Cim from './Cim';

type TabType = 'jatek' | 'rekordok' | 'profil';

function MyTabs(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('jatek');
  const [hideTabBar, setHideTabBar] = useState<boolean>(false);

  useEffect(() => {
    const validateUser = async (): Promise<void> => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userid');
        
        if (token && userId) {
          const response = await fetch(`${Cim.Cim}/jatekos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jatekosId: userId }),
          });

          if (response.status === 404) {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userid');
            setActiveTab('profil');
          }
        }
      } catch (error) {
        console.log('User validation error:', error);
      }
    };
    
    validateUser();
  }, []);

  const navigateToProfile = (): void => {
    setActiveTab('profil');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      
      <View style={{ flex: 1 }}>
        {activeTab === 'jatek' ? (
          <Kategoria setHideTabBar={setHideTabBar} navigateToProfile={navigateToProfile} />
        ) : activeTab === 'rekordok' ? (
          <Rekordok />
        ) : (
          <Profil />
        )}
      </View>

      {/* Custom Tab Bar */}
      {!hideTabBar && (
        <View style={styles.tabBarContainer}>
          <View style={[styles.tabBar, Platform.OS === 'android' && { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }]}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab('jatek')}
            >
              <MaterialCommunityIcons 
                name={activeTab === 'jatek' ? "home" : "home-outline"} 
                size={28} 
                color={activeTab === 'jatek' ? "#6C5CE7" : "#B0BEC5"} 
              />
              <Text style={[styles.tabText, activeTab === 'jatek' && styles.activeTabText]}>
                Kezdőlap
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab('rekordok')}
            >
               <MaterialCommunityIcons 
                name={activeTab === 'rekordok' ? "trophy" : "trophy-outline"} 
                size={28} 
                color={activeTab === 'rekordok' ? "#6C5CE7" : "#B0BEC5"} 
              />
              <Text style={[styles.tabText, activeTab === 'rekordok' && styles.activeTabText]}>
                Eredmények
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab('profil')}
            >
              <MaterialCommunityIcons 
                name={activeTab === 'profil' ? "account" : "account-outline"} 
                size={28} 
                color={activeTab === 'profil' ? "#6C5CE7" : "#B0BEC5"} 
              />
              <Text style={[styles.tabText, activeTab === 'profil' && styles.activeTabText]}>
                Fiók
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 10,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      web: {
        boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabText: {
    fontSize: 10,
    color: '#B0BEC5',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  activeTabText: {
    color: '#6C5CE7',
  },
});

export default MyTabs;
