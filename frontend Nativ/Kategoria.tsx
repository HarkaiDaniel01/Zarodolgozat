import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Switch,
  StatusBar,
  ViewStyle,
  TextStyle,
  Modal,
  Image
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

import Cim from "./Cim";
import Kerdesek from "./Kerdesek"; 

interface KategoriaProps {
  setHideTabBar: (value: boolean) => void;
  navigateToProfile: () => void;
}

interface KategoriaItem {
  kategoria_id: number;
  kategoria_nev: string;
}

interface UserData {
  nev: string;
  jatszottJatekok: number;
}

const Kategoria: React.FC<KategoriaProps> = ({ setHideTabBar, navigateToProfile }) => {
  const [adatok, setAdatok] = useState<KategoriaItem[]>([]);
  const [tolt, setTolt] = useState<boolean>(true);
  const [hiba, setHiba] = useState<boolean>(false);
  const [kerdesek, setKerdesek] = useState<any[]>([]);
  const [kerdesekBetoltve, setKerdesekBetoltve] = useState<boolean>(false);
  const [kategoria, setKategoria] = useState<number>(0);
  const [isGyakorlas, setIsGyakorlas] = useState<boolean>(false);
  const [isHardcore, setIsHardcore] = useState<boolean>(false);
  const [hardcoreModeModalVisible, setHardcoreModeModalVisible] = useState<boolean>(false);
  const [hardcoreModeAlert, setHardcoreModeAlert] = useState<'error' | 'info'>('info');
  const [geniuszKategoria, setGeniuszKategoria] = useState<number | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const getIconName = (index: number): any => {
    const icons = [
      "leaf", 
      "palette", 
      "history", 
      "rocket-launch", 
      "earth", 
      "book-open-variant", 
      "music", 
      "dumbbell", 
      "coffee", 
      "dice-5", 
      "brain", 
      "desktop-tower", 
      "gamepad-variant"
    ];
    return icons[index % icons.length];
  };

  const [szinek] = useState<string[]>([
    "#E8F5E9", "#FFF3E0", "#E3F2FD", "#F3E5F5", "#E0F7FA", 
    "#FCE4EC", "#FBE9E7", "#EFEBE9", "#ECEFF1"
  ]);

  const [iconSzinek] = useState<string[]>([
    "#4CAF50", "#FF9800", "#2196F3", "#9C27B0", "#00BCD4", 
    "#E91E63", "#FF5722", "#795548", "#607D8B"
  ]);
  
  const kategoriaValaszt = async (kategoriaId: number, kategoriaNev: string): Promise<void> => {
    if (kategoriaNev === "Speedrun") kategoriaValasztSpeedrun(kategoriaId);
    else if (kategoriaNev === "Endless") kategoriaValasztEndless(kategoriaId);
    else if (kategoriaNev === "Gyakorlas") kategoriaValasztGyakorlas(kategoriaId);
    else if (kategoriaNev === "Géniusz") kategoriaValasztGeniusz(kategoriaId);
    else { 
      setKategoria(kategoriaId);
      const konnyu = await KerdesekLetoltese(kategoriaId, "/kerdesekKonnyu");
      const kozepes = await KerdesekLetoltese(kategoriaId, "/kerdesekKozepes");
      const nehez = await KerdesekLetoltese(kategoriaId, "/kerdesekNehez");
      setKerdesek([...konnyu, ...kozepes, ...nehez]);
      setKerdesekBetoltve(true);
    }
  };

  const kategoriaValasztGeniusz = async (kategoriaId: number): Promise<void> => {
    setKategoria(kategoriaId);
    const konnyu = await KerdesekLetolteseVegyes("/kerdesekKonnyuVegyes");
    const kozepes = await KerdesekLetolteseVegyes("/kerdesekKozepesVegyes");
    const nehez = await KerdesekLetolteseVegyes("/kerdesekNehezVegyes");
    setKerdesek([...konnyu, ...kozepes, ...nehez]);
    setKerdesekBetoltve(true);
  };

  const kategoriaValasztSpeedrun = async (kategoriaId: number): Promise<void> => {
    setKategoria(kategoriaId);
    const konnyu = await KerdesekLetolteseVegyes("/kerdesekKonnyuVegyes");
    const kozepes = await KerdesekLetolteseVegyes("/kerdesekKozepesVegyes");
    const nehez = await KerdesekLetolteseVegyes("/kerdesekNehezVegyes");
    setKerdesek([...konnyu, ...kozepes, ...nehez]);
    setKerdesekBetoltve(true);
  };

  const kategoriaValasztEndless = async (kategoriaId: number): Promise<void> => {
    setKategoria(kategoriaId);
    try {
      const response = await fetch(Cim.Cim + `/endless-kerdesek`, { method: "GET" });
      const data = await response.json();
      if (response.ok) {
        setKerdesek(data); 
        setKerdesekBetoltve(true); 
      }
    } catch (error) { console.log('kategoriaValasztEndless Error:', error); }
  };

  const kategoriaValasztGyakorlas = async (kategoriaId: number): Promise<void> => {
    if (isHardcore) {
      setHardcoreModeAlert('error');
      setHardcoreModeModalVisible(true);
      return;
    }
    setKategoria(kategoriaId);
    setIsGyakorlas(true);
    try {
      const response = await fetch(Cim.Cim + `/Gyakorlo-kerdesek`, { method: "GET" });
      const data = await response.json();
      if (response.ok) {
        setKerdesek(data); 
        setKerdesekBetoltve(true); 
      }
    } catch (error) { console.log('kategoriaValasztGyakorlas Error:', error); }
  };

  const KerdesekLetoltese = async (kategoriaId: number, vegpont: string): Promise<any[]> => {
    try {
      const response = await fetch(Cim.Cim + vegpont, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kategoria: kategoriaId }),
      });
      return response.ok ? await response.json() : [];
    } catch (error) { return []; }
  };

  const KerdesekLetolteseVegyes = async (vegpont: string): Promise<any[]> => {
    try {
      const response = await fetch(Cim.Cim + vegpont, {
        method: "GET",
      });
      return response.ok ? await response.json() : [];
    } catch (error) { console.log('KerdesekLetolteseVegyes Error:', error); return []; }
  };

  const leToltes = async (): Promise<void> => {
    try {
      const response = await fetch(Cim.Cim + "/kategoria");
      const data = await response.json();
      if (response.ok) { 
        const szurtAdatok = data.filter((item: KategoriaItem) => item.kategoria_nev !== "Vegyes" && item.kategoria_nev !== "Géniusz");
        setAdatok(szurtAdatok); 
      }
      else { setHiba(true); }
    } catch (error) { 
      console.log('leToltes Error:', error); 
      setHiba(true); 
    } finally {
      setTolt(false);
    }
  };

  const fetchUserData = async (): Promise<void> => {
    try {
      const userId = await AsyncStorage.getItem('userid');
      if (userId) {
        const response = await fetch(`${Cim.Cim}/jatekos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jatekosId: userId }),
        });
        if (response.ok) {
          const data = await response.json();
          setUserData({
            nev: data.jatekos_nev,
            jatszottJatekok: data.jatszott_jatekok || 0
          });
        }
      }
    } catch (error) {
      console.log('fetchUserData Error:', error);
    }
  };

  useEffect(() => {
    setHideTabBar(kerdesekBetoltve);
  }, [kerdesekBetoltve, setHideTabBar]);

  useEffect(() => { 
    leToltes(); 
    fetchUserData();
  }, []);

  const calculateLevelInfo = (totalGames: number | undefined) => {
    if (!totalGames) return { level: 1, currentXp: 0, maxXp: 100 };
    let lvl = 1;
    let gamesNeeded = 10;
    let gamesLeft = totalGames;
    while (gamesLeft >= gamesNeeded) {
      gamesLeft -= gamesNeeded;
      lvl++;
      gamesNeeded += 2; 
    }
    return { level: lvl, currentXp: gamesLeft * 10, maxXp: gamesNeeded * 10 };
  };

  const { level } = calculateLevelInfo(userData?.jatszottJatekok);

  if (tolt) return <View style={styles.center}><ActivityIndicator size="large" color="#8E24AA" /></View>;
  if (hiba) return <View style={styles.center}><Text>Hiba az adatok letöltésekor.</Text></View>;

  return (
    <View style={styles.container}>
      {!kerdesekBetoltve ? (
        <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
            <View style={styles.headerContent}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>Kezdőlap</Text>
                </View>

              

                <View style={styles.exploreHeader}>
                    <Text style={styles.exploreTitle}>Válasz Kategoriát!</Text>
                </View>
            </View>

            <View style={styles.listWrapper}>
                <FlatList
                    data={adatok}
                    keyExtractor={(item: KategoriaItem, index: number) => index.toString()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item, index }) => (
                    <View style={styles.cardContainer}>
                        <View style={[styles.card, { backgroundColor: szinek[index % szinek.length] }]}>
                            <View style={styles.cardIconContainer}>
                                <MaterialCommunityIcons name={getIconName(index)} size={32} color={iconSzinek[index % iconSzinek.length]} />
                            </View>
                            <Text style={[styles.cardText, { color: iconSzinek[index % iconSzinek.length] }]} numberOfLines={1} adjustsFontSizeToFit>
                                {item.kategoria_nev}
                            </Text>
                            <TouchableOpacity
                                style={[styles.startButton, { backgroundColor: iconSzinek[index % iconSzinek.length] }]}
                                onPress={() => kategoriaValaszt(item.kategoria_id, item.kategoria_nev)}
                            >
                                <Text style={styles.startButtonText}>Kezdés</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    )}
                    
                    ListFooterComponent={
                    <View style={{marginTop: 20, paddingBottom: 100}}>
                        <Text style={styles.sectionTitle}>Speciális módok</Text>
                        <View style={{gap: 15}}>
                        <TouchableOpacity
                            style={[styles.specialCard, { backgroundColor: '#F3E5F5' }]}
                            onPress={() => kategoriaValaszt(0, 'Speedrun')}
                        >
                            <View style={[styles.specialIconContainer, { backgroundColor: '#9C27B0' }]}>
                                <MaterialCommunityIcons name="timer-outline" size={24} color="#fff" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.specialCardText, { color: '#9C27B0' }]}>Gyorsasági kihívás</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color="#9C27B0" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.specialCard, { backgroundColor: '#FCE4EC' }]}
                            onPress={() => kategoriaValaszt(-1, 'Endless')}
                        >
                            <View style={[styles.specialIconContainer, { backgroundColor: '#E91E63' }]}>
                                <MaterialCommunityIcons name="infinity" size={24} color="#fff" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.specialCardText, { color: '#E91E63' }]}>Megállás nélkül</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color="#E91E63" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.specialCard, { backgroundColor: '#E8F5E9' }]}
                            onPress={() => kategoriaValaszt(-2, 'Gyakorlas')}
                        >
                            <View style={[styles.specialIconContainer, { backgroundColor: '#4CAF50' }]}>
                                <MaterialCommunityIcons name="school" size={24} color="#fff" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.specialCardText, { color: '#4CAF50' }]}>Gyakorlás</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color="#4CAF50" />
                        </TouchableOpacity>

                        {geniuszKategoria && (
                        <TouchableOpacity
                            style={[styles.specialCard, { backgroundColor: '#E8EAF6' }]}
                            onPress={() => kategoriaValaszt(geniuszKategoria, 'Géniusz')}
                        >
                            <View style={[styles.specialIconContainer, { backgroundColor: '#3F51B5' }]}>
                                <MaterialCommunityIcons name="brain" size={24} color="#fff" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.specialCardText, { color: '#3F51B5' }]}>Géniusz Mód</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color="#3F51B5" />
                        </TouchableOpacity>
                        )}
                        </View>
                    </View>
                    }
                />
            </View>
        </SafeAreaView>
      ) : (
        <Kerdesek 
            kerdesek={kerdesek} 
            kategoria={kategoria} 
            kerdesekBetoltve={setKerdesekBetoltve} 
            navigateToProfile={navigateToProfile} 
            isGyakorlas={isGyakorlas} 
            isHardcore={isHardcore}
        />
      )}

      {/* Ultranehéz Mód Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={hardcoreModeModalVisible}
        onRequestClose={() => setHardcoreModeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modeModal}>
            <MaterialCommunityIcons 
              name={hardcoreModeAlert === 'error' ? 'alert-circle' : 'information'} 
              size={60} 
              color={hardcoreModeAlert === 'error' ? '#F44336' : '#FF9800'} 
            />
            <Text style={[styles.modeTitle, { color: hardcoreModeAlert === 'error' ? '#F44336' : '#FF9800' }]}>
              Ultranehéz Mód
            </Text>
            <Text style={styles.modeMessage}>
              {hardcoreModeAlert === 'error' 
                ? 'Ultranehéz módban nem lehet gyakorolni!' 
                : 'Az Ultranehéz mód aktiválva! Összes segítség kikapcsolva. Sok szerencse! 🧠'}
            </Text>
            <TouchableOpacity 
              style={[styles.modeButton, { backgroundColor: hardcoreModeAlert === 'error' ? '#F44336' : '#FF9800' }]}
              onPress={() => setHardcoreModeModalVisible(false)}
            >
              <Text style={styles.modeButtonText}>Rendben</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  headerContent: {
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
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  levelText: {
    fontSize: 12,
    color: '#8E24AA',
    fontWeight: '600',
  },
  bellIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFC107',
  },
  dailyQuestCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questTag: {
    backgroundColor: '#fff',
    color: '#8E24AA',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  questTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  progressValue: {
    fontSize: 12,
    color: '#8E24AA',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 3,
    marginBottom: 15,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8E24AA',
    borderRadius: 3,
  },
  continueButton: {
    backgroundColor: '#8E24AA',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  exploreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  exploreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#8E24AA',
    fontWeight: '600',
  },
  listWrapper: {
    flex: 1,
    paddingHorizontal: 15,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
    marginBottom: 15,
  },
  card: {
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  startButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
  },
  specialCard: {
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  specialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  specialCardText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeModal: {
    width: '85%',
    maxWidth: 300,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
  },
  modeMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 15,
    lineHeight: 20,
  },
  modeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
  },
  modeButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14,
  }
});

export default Kategoria;
