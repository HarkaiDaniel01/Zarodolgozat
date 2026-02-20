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
          <View style={[
              styles.podiumBar, 
              {backgroundColor: '#CFD8DC', height: 110} 
            ]}>
             <Text style={styles.podiumName} numberOfLines={1}>{topThree[1].jatekos_nev}</Text>
             <Text style={styles.podiumScore}>{topThree[1].eredmeny?.toLocaleString('hu-HU')} Ft</Text>
          </View>
        </View>
      )}

      {/* 1st Place */}
      {topThree[0] && (
        <View style={[styles.podiumItem, styles.firstPlace]}>
          <View style={[styles.avatarContainer, styles.avatarGold]}>
             <MaterialCommunityIcons name="trophy" size={35} color="#FFD700" />
             <View style={styles.badgeGold}><Text style={styles.badgeText}>1</Text></View>
          </View>
          <View style={[
              styles.podiumBar, 
              {backgroundColor: '#FFE082', height: 140}
            ]}>
             <Text style={styles.podiumNameFirst} numberOfLines={1}>{topThree[0].jatekos_nev}</Text>
             <Text style={styles.podiumScoreFirst}>{topThree[0].eredmeny?.toLocaleString('hu-HU')} Ft</Text>
          </View>
        </View>
      )}

      {/* 3rd Place */}
      {topThree[2] && (
        <View style={[styles.podiumItem, styles.thirdPlace]}>
           <View style={styles.avatarContainer}>
             <MaterialCommunityIcons name="account" size={30} color="#D7CCC8" />
             <View style={styles.badgeBronze}><Text style={styles.badgeText}>3</Text></View>
          </View>
           <View style={[
               styles.podiumBar, 
               {backgroundColor: '#D7CCC8', height: 90}
            ]}>
             <Text style={styles.podiumName} numberOfLines={1}>{topThree[2].jatekos_nev}</Text>
             <Text style={styles.podiumScore}>{topThree[2].eredmeny?.toLocaleString('hu-HU')} Ft</Text>
          </View>
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
    backgroundColor: '#FAFAFA',
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#FAFAFA',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
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
    backgroundColor: '#FAFAFA',
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
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
    position: 'absolute', bottom: -5, backgroundColor: '#8E24AA', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff'
  },
  badgeSilver: {
    position: 'absolute', bottom: -5, backgroundColor: '#333', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff'
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
  },
  podiumName: {
      color: '#333',
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 4,
  },
  podiumNameFirst: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumScore: {
      color: '#8E24AA',
      fontSize: 11,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  podiumScoreFirst: {
    color: '#8E24AA',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  rekordSor: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
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
      color: '#999',
  },
  infoContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
  },
  nev: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
  },
  scoreContainer: {
      backgroundColor: '#F3E5F5',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
  },
  pont: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8E24AA',
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
