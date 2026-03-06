import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Kategoria from './Kategoria';
import Profil from './Profil';
import Rekordok from './Rekordok';
import { useTheme } from './ThemeContext';
import { SPACING, BORDER_RADIUS, rf } from './theme';
const { width: _screenWidth } = Dimensions.get('window');
// import COLORS from './theme';
import Cim from './Cim';

type TabType = 'jatek' | 'rekordok' | 'profil';

const TabBarButton = ({ tab, activeTab, onPress, icon, label }: any) => {
  const { colors } = useTheme();
  const isActive = activeTab === tab;
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isActive ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const containerStyle = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  const iconColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.text_secondary, colors.primary],
  });

  const textColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.text_secondary, colors.primary],
  });

  return (
    <TouchableOpacity style={styles.tab} onPress={onPress}>
      <Animated.View style={[styles.tabIconContainer, containerStyle]}>
        <Animated.View style={[styles.tabIconCircle, {
          backgroundColor: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', colors.primary_light],
          })
        }]}>
          <MaterialCommunityIcons name={icon} size={28} color={isActive ? colors.primary : colors.text_secondary} />
        </Animated.View>
      </Animated.View>
      <Animated.Text style={[styles.tabText, { color: textColor }]}>
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
};

function MyTabs(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      
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
        <View style={[styles.tabBarContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View style={[styles.tabBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : SPACING.sm }]}>
            <TabBarButton
              tab="jatek"
              activeTab={activeTab}
              onPress={() => setActiveTab('jatek')}
              icon={activeTab === 'jatek' ? "home" : "home-outline"}
              label="Kezdőlap"
            />
            <TabBarButton
              tab="rekordok"
              activeTab={activeTab}
              onPress={() => setActiveTab('rekordok')}
              icon={activeTab === 'rekordok' ? "trophy" : "trophy-outline"}
              label="Eredmények"
            />
            <TabBarButton
              tab="profil"
              activeTab={activeTab}
              onPress={() => setActiveTab('profil')}
              icon={activeTab === 'profil' ? "account" : "account-outline"}
              label="Fiók"
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF', // ✅ white helyett string
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: SPACING.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconCircle: {
    width: 56,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: rf(10, _screenWidth),
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
  },
});

export default MyTabs;
