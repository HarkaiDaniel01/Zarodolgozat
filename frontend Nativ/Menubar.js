import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Kategoria from './Kategoria';
import Profil from './Profil';

function MyTabs() {
  const [activeTab, setActiveTab] = useState('jatek');
  const [hideTabBar, setHideTabBar] = useState(false);

  const navigateToProfile = () => {
    setActiveTab('profil');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Content */}
      {activeTab === 'jatek' ? (
        <Kategoria setHideTabBar={setHideTabBar} navigateToProfile={navigateToProfile} />
      ) : (
        <Profil />
      )}

      {/* Custom Tab Bar */}
      {!hideTabBar && (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'jatek' && styles.activeTab]}
            onPress={() => setActiveTab('jatek')}
          >
            <Text style={[styles.tabText, activeTab === 'jatek' && styles.activeTabText]}>
              Játék
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'profil' && styles.activeTab]}
            onPress={() => setActiveTab('profil')}
          >
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
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#2962FF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#2962FF',
    fontWeight: 'bold',
  },
});

export default MyTabs;