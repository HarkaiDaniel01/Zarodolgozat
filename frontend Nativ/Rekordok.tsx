import React, { useState, useEffect, JSX } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import Cim from './Cim';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface RecordItem {
  jatekos_id: number;
  jatekos_nev: string;
  eredmeny: number;
}

const Rekordok: React.FC = () => {
  const [rekordok, setRekordok] = useState<RecordItem[]>([]);
  const [tolt, setTolt] = useState<boolean>(true);
  const [hiba, setHiba] = useState<string | null>(null);
  const [frissites, setFrissites] = useState<boolean>(false);

  // Fetch data
  const adatLeker = async (): Promise<void> => {
    try {
      const response = await fetch(`${Cim.Cim}/rekordok`);
      if (!response.ok) {
        throw new Error('A hálózati válasz nem volt rendben');
      }
      const json = await response.json();
      setRekordok(json);
    } catch (error) {
      setHiba(error instanceof Error ? error.message : 'Ismeretlen hiba');
    } finally {
      setTolt(false);
      setFrissites(false);
    }
  };

  useEffect(() => {
    adatLeker();
  }, []);

  const onRefresh = (): void => {
    setFrissites(true);
    adatLeker();
  };

  if (tolt) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFC107" />
        <Text style={{marginTop: 10, color: '#666'}}>Ranglista betöltése...</Text>
      </View>
    );
  }

  if (hiba) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons name="alert-circle" size={50} color="red" />
        <Text style={styles.hibaText}>Hiba történt: {hiba}</Text>
        <Text onPress={onRefresh} style={{color: '#2196F3', marginTop: 10, fontWeight: 'bold'}}>Próbáld újra</Text>
      </View>
    );
  }

  const topThree = rekordok.slice(0, 3);
  const restOfList = rekordok.slice(3);

  const renderPodium = (): JSX.Element => (
    <View style={styles.podiumContainer}>
      {/* 2nd Place */}
      {topThree[1] && (
        <View style={[styles.podiumItem, styles.secondPlace]}>
          <View style={styles.avatarContainer}>
             <MaterialCommunityIcons name="account" size={30} color="#B0BEC5" />
             <View style={styles.badgeSilver}><Text style={styles.badgeText}>2</Text></View>
          </View>
          <LinearGradient
              colors={['#E0E0E0', '#BDBDBD']}
              style={[styles.podiumBar, {height: 110}]}
          >
             <Text style={styles.podiumName} numberOfLines={1}>{topThree[1].jatekos_nev}</Text>
             <Text style={styles.podiumScore}>{topThree[1].eredmeny?.toLocaleString('hu-HU')} Ft</Text>
          </LinearGradient>
        </View>
      )}

      {/* 1st Place */}
      {topThree[0] && (
        <View style={[styles.podiumItem, styles.firstPlace]}>
          <View style={[styles.avatarContainer, styles.avatarGold]}>
             <MaterialCommunityIcons name="trophy" size={35} color="#FFD700" />
             <View style={styles.badgeGold}><Text style={styles.badgeText}>1</Text></View>
          </View>
          <LinearGradient
              colors={['#FFF59D', '#FFC107']}
              style={[styles.podiumBar, {height: 140}]}
          >
             <Text style={styles.podiumNameFirst} numberOfLines={1}>{topThree[0].jatekos_nev}</Text>
             <Text style={styles.podiumScoreFirst}>{topThree[0].eredmeny?.toLocaleString('hu-HU')} Ft</Text>
          </LinearGradient>
        </View>
      )}

      {/* 3rd Place */}
      {topThree[2] && (
        <View style={[styles.podiumItem, styles.thirdPlace]}>
           <View style={styles.avatarContainer}>
             <MaterialCommunityIcons name="account" size={30} color="#D7CCC8" />
             <View style={styles.badgeBronze}><Text style={styles.badgeText}>3</Text></View>
          </View>
           <LinearGradient
               colors={['#EFEBE9', '#D7CCC8']}
               style={[styles.podiumBar, {height: 90}]}
           >
             <Text style={styles.podiumName} numberOfLines={1}>{topThree[2].jatekos_nev}</Text>
             <Text style={styles.podiumScore}>{topThree[2].eredmeny?.toLocaleString('hu-HU')} Ft</Text>
          </LinearGradient>
        </View>
      )}
    </View>
  );

  const renderItem = ({ item, index }: { item: RecordItem; index: number }): JSX.Element => {
    const rank = index + 4; // Start ranking from 4

    return (
        <View style={styles.rekordSor}>
          {/* Rank Badge */}
          <View style={styles.rankBadge}>
             <Text style={styles.rankText}>{rank}</Text>
          </View>

          {/* Name and Info */}
          <View style={styles.infoContainer}>
            <View style={styles.listAvatar}>
              <MaterialCommunityIcons name="account" size={20} color="#8E24AA" />
            </View>
            <Text style={styles.nev}>{item.jatekos_nev}</Text>
          </View>
          
          {/* Score */}
          <View style={styles.scoreContainer}>
             <Text style={styles.pont}>{item.eredmeny?.toLocaleString('hu-HU')} Ft</Text>
          </View>
        </View>
    );
  };

  const renderEmpty = (): JSX.Element => (
    <View style={{padding: 20, alignItems: 'center'}}>
        <Text style={{color: '#999'}}>Nincs több játékos a listán.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
       <SafeAreaView style={styles.headerArea}>
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Ranglista</Text>           
            </View>
            
      </SafeAreaView>

      <FlatList
        data={restOfList}
        renderItem={renderItem}
        keyExtractor={(item: RecordItem) => (item.jatekos_id ? item.jatekos_id.toString() : Math.random().toString())}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={renderPodium}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={frissites} onRefresh={onRefresh} colors={["#8E24AA"]} />
        }
      />
      

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#F4F6FB',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1A1A2E',
    letterSpacing: 0.3,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#F3E5F5',
  },
  activeTabText: {
    color: '#8E24AA',
    fontWeight: 'bold',
    fontSize: 14,
  },
  inactiveTabText: {
    color: '#999',
    fontWeight: '600',
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
  },
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 30,
    marginTop: 20,
    height: 220, 
  },
  podiumItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '30%',
  },
  firstPlace: {
    zIndex: 10,
    marginBottom: 10,
    width: '35%',
  },
  secondPlace: {
    marginRight: -5,
  },
  thirdPlace: {
    marginLeft: -5,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -20,
    zIndex: 5,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarGold: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: -25,
    borderColor: '#FFD700',
    borderWidth: 3,
  },
  badgeGold: {
    position: 'absolute', bottom: -5, backgroundColor: '#6C5CE7', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff'
  },
  badgeSilver: {
    position: 'absolute', bottom: -5, backgroundColor: '#757575', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff'
  },
  badgeBronze: {
    position: 'absolute', bottom: -5, backgroundColor: '#FF9800', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff'
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  podiumBar: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 35,
    paddingHorizontal: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  podiumName: {
      color: '#424242',
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 4,
  },
  podiumNameFirst: {
    color: '#3E2723',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumScore: {
    color: '#6C5CE7',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  podiumScoreFirst: {
    color: '#6C5CE7',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  rekordSor: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F7',
    ...Platform.select({
      web: { boxShadow: '0px 2px 8px rgba(108,92,231,0.07)' },
      default: {
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
      }
    })
  },
  rankBadge: {
      width: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
  },
  rankText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#9E9E9E',
  },
  infoContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
  },
  listAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EDE9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nev: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginLeft: 12,
  },
  scoreContainer: {
    backgroundColor: '#EDE9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  pont: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C5CE7',
  },
  hibaText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  startQuizButton: {
    backgroundColor: '#8E24AA',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#8E24AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  startQuizButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default Rekordok;
