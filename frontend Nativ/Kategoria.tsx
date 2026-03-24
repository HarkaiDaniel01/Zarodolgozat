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
  Image,
  Platform,
  useWindowDimensions
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

import Cim from "./Cim";
import Kerdesek from "./Kerdesek";
import { useTheme } from './ThemeContext';
import { rf } from './theme';

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
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const styles = getStyles(colors, isDark, width);
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
  const [hardcoreKattintas, setHardcoreKattintas] = useState<number>(0);
  const [easterEggVisible, setEasterEggVisible] = useState<boolean>(false);
  const [kategoriaBetoltes, setKategoriaBetoltes] = useState<boolean>(false);
  const [kevesKerdesModalVisible, setKevesKerdesModalVisible] = useState<boolean>(false);

  const getIconName = (nev: string): any => {
    const nevKisbetus = nev.toLowerCase();
    if (nevKisbetus.includes('karácsony') || nevKisbetus.includes('karacsony')) return 'pine-tree';
    if (nevKisbetus.includes('természet') || nevKisbetus.includes('termeszet')) return 'leaf';
    if (nevKisbetus.includes('állat') || nevKisbetus.includes('allat')) return 'paw';
    if (nevKisbetus.includes('történelem') || nevKisbetus.includes('tortenelem')) return 'bank';
    if (nevKisbetus.includes('tudomány') || nevKisbetus.includes('tudomany')) return 'flask';
    if (nevKisbetus.includes('fizika')) return 'atom';
    if (nevKisbetus.includes('kémia') || nevKisbetus.includes('kemia')) return 'flask-outline';
    if (nevKisbetus.includes('biológia') || nevKisbetus.includes('biologia')) return 'dna';
    if (nevKisbetus.includes('matematika') || nevKisbetus.includes('matek')) return 'calculator';
    if (nevKisbetus.includes('informatika') || nevKisbetus.includes('számítástechnika')) return 'laptop';
    if (nevKisbetus.includes('techno')) return 'desktop-tower';
    if (nevKisbetus.includes('földrajz') || nevKisbetus.includes('foldrajz')) return 'earth';
    if (nevKisbetus.includes('irodalom')) return 'book-open-variant';
    if (nevKisbetus.includes('könyv') || nevKisbetus.includes('konyv')) return 'book-open-variant';
    if (nevKisbetus.includes('zene') || nevKisbetus.includes('musik')) return 'music';
    if (nevKisbetus.includes('film') || nevKisbetus.includes('mozi')) return 'movie-open';
    if (nevKisbetus.includes('sport')) return 'dumbbell';
    if (nevKisbetus.includes('foci') || nevKisbetus.includes('futball')) return 'soccer';
    if (nevKisbetus.includes('konyha') || nevKisbetus.includes('étel') || nevKisbetus.includes('etel') || nevKisbetus.includes('gasztro')) return 'food-fork-drink';
    if (nevKisbetus.includes('auto') || nevKisbetus.includes('autó') || nevKisbetus.includes('jármű')) return 'car';
    if (nevKisbetus.includes('politika')) return 'account-tie';
    if (nevKisbetus.includes('vallás') || nevKisbetus.includes('vallas')) return 'church';
    if (nevKisbetus.includes('művészet') || nevKisbetus.includes('muveszet')) return 'palette';
    if (nevKisbetus.includes('játék') || nevKisbetus.includes('jatek')) return 'gamepad-variant';
    if (nevKisbetus.includes('bolt') || nevKisbetus.includes('üzlet')) return 'store';
    if (nevKisbetus.includes('egészség') || nevKisbetus.includes('egeszseg')) return 'heart-pulse';
    if (nevKisbetus.includes('sorozat') || nevKisbetus.includes('tv')) return 'television-play';
    if (nevKisbetus.includes('celebr') || nevKisbetus.includes('sztár') || nevKisbetus.includes('sztar')) return 'star';
    if (nevKisbetus.includes('internet') || nevKisbetus.includes('web')) return 'web';
    if (nevKisbetus.includes('anime') || nevKisbetus.includes('manga')) return 'television-shimmer';
    if (nevKisbetus.includes('pénz') || nevKisbetus.includes('penz') || nevKisbetus.includes('gazdaság') || nevKisbetus.includes('gazdasag')) return 'cash-multiple';
    if (nevKisbetus.includes('jog') || nevKisbetus.includes('törvény') || nevKisbetus.includes('torveny')) return 'scale-balance';
    if (nevKisbetus.includes('űr') || nevKisbetus.includes('ur') || nevKisbetus.includes('csillagászat')) return 'rocket-launch';
    if (nevKisbetus.includes('mitológia') || nevKisbetus.includes('mítosz')) return 'temple-greek';
    if (nevKisbetus.includes('utazás') || nevKisbetus.includes('utazas') || nevKisbetus.includes('turista')) return 'airplane';
    if (nevKisbetus.includes('nyelv')) return 'translate';
    if (nevKisbetus.includes('pszicho') || nevKisbetus.includes('lélek')) return 'head-snowflake';
    if (nevKisbetus.includes('építészet') || nevKisbetus.includes('epiteszet')) return 'office-building';
    if (nevKisbetus.includes('divat') || nevKisbetus.includes('ruha')) return 'tshirt-crew';
    if (nevKisbetus.includes('kert') || nevKisbetus.includes('virág')) return 'flower';
    if (nevKisbetus.includes('hadsereg') || nevKisbetus.includes('katona') || nevKisbetus.includes('fegyver')) return 'tank';
    if (nevKisbetus.includes('orvos') || nevKisbetus.includes('gyógyászat')) return 'medical-bag';
    if (nevKisbetus.includes('tech') || nevKisbetus.includes('mobil') || nevKisbetus.includes('telefon')) return 'cellphone';
    if (nevKisbetus.includes('filozófia') || nevKisbetus.includes('bölcsesség')) return 'lightbulb-on';
    if (nevKisbetus.includes('időjárás') || nevKisbetus.includes('klima')) return 'weather-partly-cloudy';
    if (nevKisbetus.includes('környezet') || nevKisbetus.includes('kornyezet')) return 'recycle';
    return 'help-circle-outline';
  };

  const szinek = isDark
    ? ["#1E4D35", "#4A3318", "#1A3060", "#3A1E60", "#0F3D50",
       "#501830", "#4A2810", "#3D2E18", "#202840"]
    : ["#E8F5E9", "#FFF3E0", "#E3F2FD", "#F3E5F5", "#E0F7FA",
       "#FCE4EC", "#FBE9E7", "#EFEBE9", "#ECEFF1"];

  const iconSzinek = isDark
    ? ["#7EEBB0", "#FFC55A", "#70B8FF", "#CF8FFF", "#5DD6E8",
       "#FF8DB8", "#FF8C6B", "#C4B49A", "#99ADC0"]
    : ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0", "#00BCD4",
       "#E91E63", "#FF5722", "#795548", "#607D8B"];
  
  const kategoriaValaszt = async (kategoriaId: number, kategoriaNev: string): Promise<void> => {
    if (kategoriaBetoltes) return;
    setKategoriaBetoltes(true);
    try {
      if (kategoriaNev === "Speedrun") await kategoriaValasztSpeedrun(kategoriaId);
      else if (kategoriaNev === "Endless") await kategoriaValasztEndless(kategoriaId);
      else if (kategoriaNev === "Gyakorlas") await kategoriaValasztGyakorlas(kategoriaId);
      else if (kategoriaNev === "Géniusz") await kategoriaValasztGeniusz(kategoriaId);
      else { 
        setKategoria(kategoriaId);
        const konnyu = await KerdesekLetoltese(kategoriaId, "/kerdesekKonnyu");
        const kozepes = await KerdesekLetoltese(kategoriaId, "/kerdesekKozepes");
        const nehez = await KerdesekLetoltese(kategoriaId, "/kerdesekNehez");
        const osszesKerdes = [...konnyu, ...kozepes, ...nehez];
        if (osszesKerdes.length < 10) {
          setKevesKerdesModalVisible(true);
        } else {
          setKerdesek(osszesKerdes);
          setKerdesekBetoltve(true);
        }
      }
    } finally {
      setKategoriaBetoltes(false);
    }
  };

  const kategoriaValasztGeniusz = async (kategoriaId: number): Promise<void> => {
    setKategoria(kategoriaId);
    const konnyu = await KerdesekLetolteseVegyes("/kerdesekKonnyuVegyes");
    const kozepes = await KerdesekLetolteseVegyes("/kerdesekKozepesVegyes");
    const nehez = await KerdesekLetolteseVegyes("/kerdesekNehezVegyes");
    const osszesKerdes = [...konnyu, ...kozepes, ...nehez];
    if (osszesKerdes.length < 10) {
      setKevesKerdesModalVisible(true);
    } else {
      setKerdesek(osszesKerdes);
      setKerdesekBetoltve(true);
    }
  };

  const kategoriaValasztSpeedrun = async (kategoriaId: number): Promise<void> => {
    setKategoria(kategoriaId);
    const konnyu = await KerdesekLetolteseVegyes("/kerdesekKonnyuVegyes");
    const kozepes = await KerdesekLetolteseVegyes("/kerdesekKozepesVegyes");
    const nehez = await KerdesekLetolteseVegyes("/kerdesekNehezVegyes");
    const osszesKerdes = [...konnyu, ...kozepes, ...nehez];
    if (osszesKerdes.length < 10) {
      setKevesKerdesModalVisible(true);
    } else {
      setKerdesek(osszesKerdes);
      setKerdesekBetoltve(true);
    }
  };

  const kategoriaValasztEndless = async (kategoriaId: number): Promise<void> => {
    setKategoria(kategoriaId);
    try {
      const response = await fetch(Cim.Cim + `/endless-kerdesek`, { method: "GET" });
      const data = await response.json();
      if (response.ok) {
        if (data.length < 10) {
          setKevesKerdesModalVisible(true);
        } else {
          setKerdesek(data); 
          setKerdesekBetoltve(true);
        } 
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
        if (data.length < 10) {
          setKevesKerdesModalVisible(true);
        } else {
          setKerdesek(data); 
          setKerdesekBetoltve(true); 
        }
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
        const unlocked = await AsyncStorage.getItem("geniuszUnlocked");
        if (unlocked === "true") {
          const geniuszItem = data.find((item: KategoriaItem) => item.kategoria_nev === "Géniusz");
          if (geniuszItem) setGeniuszKategoria(geniuszItem.kategoria_id);
        }
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
          const jatekos = Array.isArray(data) ? data[0] : data;
          setUserData({
            nev: jatekos.jatekos_nev,
            jatszottJatekok: jatekos.jatszott_jatekok || 0
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

  const specialColors = {
    speedrun:  { bg: isDark ? '#3A1E60' : '#F3E5F5', icon: isDark ? '#CF8FFF' : '#9C27B0' },
    endless:   { bg: isDark ? '#501830' : '#FCE4EC', icon: isDark ? '#FF8DB8' : '#E91E63' },
    gyakorlas: { bg: isDark ? '#1E4D35' : '#E8F5E9', icon: isDark ? '#7EEBB0' : '#4CAF50' },
    geniusz:   { bg: isDark ? '#202840' : '#E8EAF6', icon: isDark ? '#99ADC0' : '#3F51B5' },
  };

  if (tolt) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (hiba) return <View style={styles.center}><Text style={{ color: colors.text }}>Hiba az adatok letöltésekor.</Text></View>;

  return (
    <View style={styles.container}>
      {!kerdesekBetoltve ? (
        <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
            {/* Greeting Header */}
            <View style={styles.greetingCard}>
              <View style={styles.greetingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.greetingTitle}>
                    {userData ? `Helló, ${userData.nev}! 👋` : 'Nincs bejelentkezve 👤'}
                  </Text>
                  <Text style={styles.greetingSubtitle}>
                    {userData ? 'Kész vagy a kihívásra ma? 🎯' : 'Jelentkezz be az eredményeid mentéséhez!'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.greetingIconBtn}
                  onPress={() => {
                    const ujKattintas = hardcoreKattintas + 1;
                    setHardcoreKattintas(ujKattintas);
                    if (ujKattintas >= 5) {
                      setHardcoreKattintas(0);
                      setEasterEggVisible(true);
                    }
                  }}
                >
                  <MaterialCommunityIcons name="brain" size={28} color="#6C5CE7" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.headerContent}>
                <Text style={styles.sectionLabel}>Válaszon kategóriát!</Text>
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
                                <MaterialCommunityIcons name={getIconName(item.kategoria_nev)} size={32} color={iconSzinek[index % iconSzinek.length]} />
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
                    
                    ListEmptyComponent={
                      <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: colors.text, fontSize: 16 }}>Jelenleg nem elérhető</Text>
                      </View>
                    }

                    ListFooterComponent={
                    <View style={{marginTop: 20, paddingBottom: 100}}>
                        <Text style={styles.sectionTitle}>Speciális módok</Text>
                        <View style={{gap: 15}}>
                        <TouchableOpacity
                            style={[styles.specialCard, { backgroundColor: specialColors.speedrun.bg }]}
                            onPress={() => kategoriaValaszt(0, 'Speedrun')}
                        >
                            <View style={[styles.specialIconContainer, { backgroundColor: specialColors.speedrun.icon }]}>
                                <MaterialCommunityIcons name="timer-outline" size={24} color="#fff" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.specialCardText, { color: specialColors.speedrun.icon }]}>Gyorsasági kihívás</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color={specialColors.speedrun.icon} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.specialCard, { backgroundColor: specialColors.endless.bg }]}
                            onPress={() => kategoriaValaszt(-1, 'Endless')}
                        >
                            <View style={[styles.specialIconContainer, { backgroundColor: specialColors.endless.icon }]}>
                                <MaterialCommunityIcons name="infinity" size={24} color="#fff" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.specialCardText, { color: specialColors.endless.icon }]}>Megállás nélkül</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color={specialColors.endless.icon} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.specialCard, { backgroundColor: specialColors.gyakorlas.bg }]}
                            onPress={() => kategoriaValaszt(-2, 'Gyakorlas')}
                        >
                            <View style={[styles.specialIconContainer, { backgroundColor: specialColors.gyakorlas.icon }]}>
                                <MaterialCommunityIcons name="school" size={24} color="#fff" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.specialCardText, { color: specialColors.gyakorlas.icon }]}>Gyakorlás</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color={specialColors.gyakorlas.icon} />
                        </TouchableOpacity>

                        {/* Hardcore mód kapcsoló */}
                        <TouchableOpacity
                            style={[
                              styles.hardcoreBtn,
                              isHardcore && styles.hardcoreBtnActive
                            ]}
                            onPress={() => {
                              const newVal = !isHardcore;
                              setIsHardcore(newVal);
                              if (newVal) {
                                setHardcoreModeAlert('info');
                                setHardcoreModeModalVisible(true);
                              }
                            }}
                        >
                            <View style={[styles.specialIconContainer, { backgroundColor: isHardcore ? '#F44336' : '#9E9E9E', marginRight: 15 }]}>
                                <MaterialCommunityIcons name="skull-crossbones" size={24} color="#fff" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.specialCardText, { color: isHardcore ? '#F44336' : colors.text_secondary }]}>Ultranehéz mód</Text>
                                <Text style={{ fontSize: rf(12, width), color: isHardcore ? '#F44336' : colors.text_secondary }}>{isHardcore ? '✅ Bekapcsolva' : 'Koppints a bekapcsoláshoz'}</Text>
                            </View>
                            <Switch
                              value={isHardcore}
                              onValueChange={(val) => {
                                setIsHardcore(val);
                                if (val) {
                                  setHardcoreModeAlert('info');
                                  setHardcoreModeModalVisible(true);
                                }
                              }}
                              trackColor={{ false: '#ccc', true: '#FFCDD2' }}
                              thumbColor={isHardcore ? '#F44336' : '#f4f3f4'}
                            />
                        </TouchableOpacity>

                        {geniuszKategoria && (
                        <TouchableOpacity
                            style={[styles.specialCard, { backgroundColor: specialColors.geniusz.bg }]}
                            onPress={() => kategoriaValaszt(geniuszKategoria, 'Géniusz')}
                        >
                            <View style={[styles.specialIconContainer, { backgroundColor: specialColors.geniusz.icon }]}>
                                <MaterialCommunityIcons name="brain" size={24} color="#fff" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.specialCardText, { color: specialColors.geniusz.icon }]}>Géniusz Mód</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color={specialColors.geniusz.icon} />
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

      {/* Kevés Kérdés Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={kevesKerdesModalVisible}
        onRequestClose={() => setKevesKerdesModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modeModal}>
            <MaterialCommunityIcons 
              name="alert-circle-outline" 
              size={60} 
              color="#F44336" 
            />
            <Text style={[styles.modeTitle, { color: "#F44336" }]}>
              Hoppá!
            </Text>
            <Text style={styles.modeMessage}>
              Sajnos ebben a kategóriában jelenleg nincs elég kérdés a játék indításához (minimum 10 szükséges). Kérjük, válassz másikat! 😕
            </Text>
            <TouchableOpacity 
              style={[styles.modeButton, { backgroundColor: "#F44336" }]}
              onPress={() => setKevesKerdesModalVisible(false)}
            >
              <Text style={styles.modeButtonText}>Rendben</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Easter Egg Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={easterEggVisible}
        onRequestClose={() => setEasterEggVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modeModal, { backgroundColor: '#1a1a2e' }]}>
            <Text style={{ fontSize: rf(48, width) }}>🐣</Text>
            <Text style={[styles.modeTitle, { color: '#FFD700' }]}>Easter Egg!</Text>
                <Text style={[styles.modeMessage, { color: '#aaa' }]}>
                  Megtaláltad a titkot! 🎉{'\n\n'}Ez az alkalmazást
                </Text>
                            <Text style={{ fontSize: rf(20, width), fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 5 }}>
                              Daróczi Gergő és Harkai Dániel
                            </Text>
                <Text style={[styles.modeMessage, { color: '#aaa', marginTop: 5 }]}>
                  fejlesztették szeretettel. 💜{'\n\n'}Köszönjük, hogy játszol! 🚀
                  tipp:Géniusz módhoz írd be 20030826 a felhasználónévhez a jelszóhoz semmit, és máris elérhetővé válik! 😉
                </Text>
            <TouchableOpacity
              style={[styles.modeButton, { backgroundColor: '#FFD700' }]}
              onPress={() => setEasterEggVisible(false)}
            >
              <Text style={[styles.modeButtonText, { color: '#1a1a2e' }]}>😎 Klassz!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

const PRIMARY = '#6C5CE7';

const getStyles = (colors: any, isDark: boolean, width: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  greetingCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      web: { boxShadow: '0px 2px 16px rgba(108,92,231,0.08)' },
      default: {
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
      }
    })
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingTitle: {
    fontSize: rf(18, width),
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: rf(13, width),
    color: colors.text_secondary,
  },
  greetingIconBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EDE9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sectionLabel: {
    fontSize: rf(20, width),
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
    textAlign: 'center',
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
      fontSize: rf(20, width),
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
    fontSize: rf(16, width),
    fontWeight: 'bold',
    color: '#333',
  },
  levelText: {
    fontSize: rf(12, width),
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
    fontSize: rf(10, width),
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  questTitle: {
    fontSize: rf(18, width),
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
    fontSize: rf(12, width),
    color: '#666',
  },
  progressValue: {
    fontSize: rf(12, width),
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
    fontSize: rf(14, width),
  },
  exploreHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  exploreTitle: {
    fontSize: rf(28, width),
    fontWeight: '900',
    color: PRIMARY,
    letterSpacing: 0.5,
  },
  exploreSubtitle: {
    fontSize: rf(16, width),
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
  },
  viewAllText: {
    fontSize: rf(14, width),
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
    padding: 18,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    height: 160,
    justifyContent: 'space-between',
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardText: {
    fontWeight: 'bold',
    fontSize: rf(16, width),
    marginTop: -15,
    textAlign: 'center',
  },
  cardSubText: {
    fontSize: rf(10, width),
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
    fontSize: rf(13, width),
  },
  sectionTitle: {
    fontSize: rf(20, width),
    fontWeight: '800',
    color: colors.text,
    marginBottom: 15,
    marginLeft: 5,
    textAlign: 'center',
  },
  specialCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  specialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  specialCardText: {
    fontWeight: 'bold',
    fontSize: rf(16, width),
  },
  hardcoreBtn: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  hardcoreBtnActive: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
    borderStyle: 'solid',
    elevation: 5,
    shadowColor: '#F44336',
    shadowOpacity: 0.3,
  },
  textContainer: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeModal: {
    width: '85%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modeTitle: {
    fontSize: rf(22, width),
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 15,
  },
  modeMessage: {
    fontSize: rf(15, width),
    color: colors.text_secondary,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  modeButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
    alignItems: 'center',
    width: '100%',
  },
  modeButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: rf(16, width),
    letterSpacing: 0.5,
  }
});

export default Kategoria;
