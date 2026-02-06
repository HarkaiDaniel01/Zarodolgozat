import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Kategoria from './Kategoria';
import Profil from './Profil';
import Rekordok from './Rekordok';
import Cim from './Cim';

function MyTabs() {
  const [activeTab, setActiveTab] = useState('jatek');
  const [hideTabBar, setHideTabBar] = useState(false);

  useEffect(() => {
    const validateUser = async () => {
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

  const navigateToProfile = () => {
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
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('jatek')}
          >
            <MaterialCommunityIcons 
              name={activeTab === 'jatek' ? "play-circle" : "play-circle-outline"} 
              size={28} 
              color={activeTab === 'jatek' ? "#2962FF" : "#9E9E9E"} 
            />
            <Text style={[styles.tabText, activeTab === 'jatek' && styles.activeTabText]}>
              Játék
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('rekordok')}
          >
             <MaterialCommunityIcons 
              name={activeTab === 'rekordok' ? "check-decagram" : "check-decagram-outline"} 
              size={28} 
              color={activeTab === 'rekordok' ? "#2962FF" : "#9E9E9E"} 
            />
            <Text style={[styles.tabText, activeTab === 'rekordok' && styles.activeTabText]}>
              Rekordok
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('profil')}
          >
            <MaterialCommunityIcons 
              name={activeTab === 'profil' ? "account" : "account-outline"} 
              size={28} 
              color={activeTab === 'profil' ? "#2962FF" : "#9E9E9E"} 
            />
            <Text style={[styles.tabText, activeTab === 'profil' && styles.activeTabText]}>
              Profil
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    elevation: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      web: {
        boxShadow: '0px -2px 3px rgba(0, 0, 0, 0.05)',
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
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2962FF',
    fontWeight: '700',
  },
});

export default MyTabs;
