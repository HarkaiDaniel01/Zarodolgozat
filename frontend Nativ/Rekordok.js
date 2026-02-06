import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import Cim from './Cim';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Rekordok = () => {
  const [rekordok, setRekordok] = useState([]);
  const [tolt, setTolt] = useState(true);
  const [hiba, setHiba] = useState(null);
  const [frissites, setFrissites] = useState(false);

  // Fetch data
  const adatLeker = async () => {
    try {
      const response = await fetch(`${Cim.Cim}/rekordok`);
      if (!response.ok) {
        throw new Error('A hálózati válasz nem volt rendben');
      }
      const json = await response.json();
      setRekordok(json);
    } catch (error) {
      setHiba(error.message);
    } finally {
      setTolt(false);
      setFrissites(false);
    }
  };

  useEffect(() => {
    adatLeker();
  }, []);

  const onRefresh = () => {
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

  const renderPodium = () => (
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

  const renderItem = ({ item, index }) => {
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
            {/* Optional: Add user level or title here if available */}
          </View>
          
          {/* Score */}
          <View style={styles.scoreContainer}>
             <Text style={styles.pont}>{item.eredmeny?.toLocaleString('hu-HU')} Ft</Text>
          </View>
        </View>
    );
  };

  const renderEmpty = () => (
    <View style={{padding: 20, alignItems: 'center'}}>
        <Text style={{color: '#999'}}>Nincs több játékos a listán.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
       <LinearGradient
            colors={['#FFC107', '#FF9800']}
            style={styles.headerGradient}
       >
            <SafeAreaView edges={['top', 'left', 'right']} style={{alignItems: 'center', paddingBottom: 25}}>
                <View style={styles.headerRow}>
                    <MaterialCommunityIcons name="podium-gold" size={32} color="#fff" />
                    <Text style={styles.headerTitle}>Ranglista</Text>
                </View>
                <Text style={styles.subTitle}>A legügyesebb játékosok</Text>
            </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={restOfList}
        renderItem={renderItem}
        keyExtractor={(item) => (item.jatekos_id ? item.jatekos_id.toString() : Math.random().toString())}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={renderPodium}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={frissites} onRefresh={onRefresh} colors={["#FFC107"]} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Soft gray background
  },
  headerGradient: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
    elevation: 8,
    // @ts-ignore
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    zIndex: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  },
  headerTitle: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#fff',
      ...Platform.select({
        web: {
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
        },
        default: {
          textShadowColor: 'rgba(0,0,0,0.1)',
          textShadowOffset: {width: 1, height: 1},
          textShadowRadius: 2,
        }
      })
  },
  subTitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.9)',
      fontWeight: '500',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  
  // PODIUM STYLES
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 25,
    marginTop: 15,
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
    marginBottom: -20, // Overlap the bar
    zIndex: 5,
    elevation: 4,
    // @ts-ignore
    boxShadow: '0px 2px 4px rgba(0,0,0,0.15)',
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
    position: 'absolute', bottom: -5, backgroundColor: '#FFD700', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeSilver: {
    position: 'absolute', bottom: -5, backgroundColor: '#B0BEC5', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeBronze: {
    position: 'absolute', bottom: -5, backgroundColor: '#D7CCC8', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  podiumBar: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 30,
    paddingHorizontal: 5,
    elevation: 3,
    // @ts-ignore
    boxShadow: '0px 3px 5px rgba(0,0,0,0.1)',
  },
  podiumName: {
      color: '#455A64',
      fontSize: 13,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 2,
  },
  podiumNameFirst: {
    color: '#D84315', // Darker orange/brown
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 2,
},
  podiumScore: {
      color: '#546E7A',
      fontSize: 11,
      fontWeight: '600',
      textAlign: 'center',
  },
  podiumScoreFirst: {
    color: '#BF360C',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  // LIST STYLES
  rekordSor: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 10,
    elevation: 2,
    // @ts-ignore
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  },
  rankBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#EFF0F4',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
  },
  rankText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#757575',
  },
  infoContainer: {
      flex: 1,
      justifyContent: 'center',
  },
  nev: {
    fontSize: 16,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 2,
  },
  scoreContainer: {
      backgroundColor: '#E3F2FD', // Light Blue bg
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
  },
  pont: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565C0', // Blue text
  },
  hibaText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default Rekordok;

