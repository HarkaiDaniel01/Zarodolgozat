import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  StatusBar,
  Animated,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Cim from "./Cim";
import { useTheme } from './ThemeContext';

const customStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  headerDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  headerExitBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerStatsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  headerPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerPillTextLeft: {
    color: '#8e24aa', // Purple
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },
  headerPillRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffc107', // Amber/Gold
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerPillTextRight: {
    color: '#3e2723', // Dark brown for contrast
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    position: 'relative', // For the floating badge
  },
  floatingBadge: {
    position: 'absolute',
    top: -15,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  floatingBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#37474f',
    lineHeight: 24,
  },
  answersContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 12,
    height: 70,
    overflow: 'hidden', // Ensure gradient doesn't bleed
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  answerRowSelected: {
    // We will handle background via LinearGradient conditionally
    backgroundColor: 'transparent',
    elevation: 4,
  },
  letterBox: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ab47bc', // Light Purple default
  },
  letterText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  answerTextContainer: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  answerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  answerTextSelected: {
    color: '#fff',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  controlItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  controlIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginBottom: 4,
  },
  controlIconCircleActive: {
    backgroundColor: '#FFF3E0',
  },
  controlIconCircleExit: {
    backgroundColor: '#FFEBEE',
  },
  controlText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#455A64',
  }
});

const Kerdesek = ({ kerdesek, kategoria, kerdesekBetoltve, navigateToProfile, isGyakorlas, isHardcore }: any) => {
  const { height, width } = useWindowDimensions(); 
  const isLargeScreen = width > 600;
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  
  const [szamlalo, setSzamlalo] = useState<number>(0);
  const [valaszok, setValaszok] = useState<string[]>([]);
  const [tolt, setTolt] = useState<boolean>(false);
  const [pontszam, setPontszam] = useState<number>(0);
  const [betuk] = useState<string[]>(["A", "B", "C", "D"]);
  const [helyesValasz, setHelyesValasz] = useState<any>();
  const [helytelenValaszMarad, setHelytelenValaszMarad] = useState<any>();
  const [telefonSegitsegAktiv, setTelefonSegitsegAktiv] = useState<boolean>(!isHardcore);
  const [felezoSegitsegAktiv, setFelezoSegitsegAktiv] = useState<boolean>(!isHardcore);
  const [kozonsegSegitsegAktiv, setKozonsegSegitsegAktiv] = useState<boolean>(!isHardcore);
  const [felezoMegjelol, setFelezoMegjelol] = useState<boolean>(false);
  const [kozonsegMegjelol, setKozonsegMegjelol] = useState<boolean>(false);
  const [szazalek, setSzazalek] = useState<string[]>([]);
  const [megjeloltValasz, setMegjeloltValasz] = useState<string | null>(null);
  const [valaszMegjelolve, setValaszMegjelolve] = useState<boolean>(false);
  const [eredmenyMutat, setEredmenyMutat] = useState(false);
  const [idoLejartMutat, setIdoLejartMutat] = useState(false);
  const [mentve, setMentve] = useState(false);
  const [blinkAnim] = useState(new Animated.Value(1));
  const [kerdesekList, setKerdesekList] = useState(kerdesek);
  const [showWrongAnswerModal, setShowWrongAnswerModal] = useState(false);
  const [wrongAnswerInfo, setWrongAnswerInfo] = useState<{rightAnswer: string, description: string, isTraining: boolean}>({rightAnswer: '', description: '', isTraining: false});
  const [gameEndModalVisible, setGameEndModalVisible] = useState(false);
  const [gameEndMessage, setGameEndMessage] = useState('');
  const [confirmSaveModalVisible, setConfirmSaveModalVisible] = useState(false);
  const [confirmSaveModalInfo, setConfirmSaveModalInfo] = useState<{title: string, content: string}>({title: '', content: ''});
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [hibajelentesModalVisible, setHibajelentesModalVisible] = useState(false);
  const [hibaLeiras, setHibaLeiras] = useState('');
  const [phoneHelpModalVisible, setPhoneHelpModalVisible] = useState(false);
  const [phoneHelpAnswer, setPhoneHelpAnswer] = useState('');
  const [loginPromptModalVisible, setLoginPromptModalVisible] = useState(false);
  const [hibaVisszajelzesModalVisible, setHibaVisszajelzesModalVisible] = useState(false);
  const [hibaVisszajelzesSzoveg, setHibaVisszajelzesSzoveg] = useState('');
  const [hibaVisszajelzesSiker, setHibaVisszajelzesSiker] = useState(false);

  useEffect(() => {
    setKerdesekList(kerdesek);
  }, [kerdesek]);

  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;
    if (eredmenyMutat) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.3,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
    } else {
      blinkAnim.setValue(1); 
    }
    return () => {
      if (loop) loop.stop();
    };
  }, [eredmenyMutat]);

  // Speedrun state-ek
  const [ido, setIdo] = useState(60);
  const [progress, setProgress] = useState(1);
  const isSpeedrun = kategoria === 0 || kategoria === "0";
  const isEndless = kategoria === -1;

  
  useEffect(() => {
    if (isSpeedrun && szamlalo < kerdesekList.length && !valaszMegjelolve) {
      const nehezseg = kerdesekList[szamlalo].kerdesek_nehezseg;
      const kezdoIdo = nehezseg === 1 ? 45 : nehezseg === 2 ? 30 : 25;
      setIdo(kezdoIdo);
      setProgress(1);

      const interval = setInterval(() => {
        setIdo(prevIdo => {
          if (prevIdo <= 1) {
            clearInterval(interval);
            setIdoLejartMutat(true); 
            return 0;
          }
          setProgress((prevIdo - 1) / kezdoIdo);
          return prevIdo - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [szamlalo, isSpeedrun, valaszMegjelolve]);
  
  const stripHtml = (html: string) => (!html ? "" : html.replace(/<[^>]*>?/gm, ''));

  const valaszEllenoriz = async (valasz: string) => {
    setMegjeloltValasz(valasz);
    setValaszMegjelolve(true);
    setEredmenyMutat(false);

    setTimeout(async () => {
      setEredmenyMutat(true);

      setTimeout(async () => {
        if (valasz === kerdesekList[szamlalo].kerdesek_helyesValasz) {  // Helyes?
          setSzamlalo(szamlalo + 1);  // ← Inkrementálódik
          setMegjeloltValasz(null);
          setValaszMegjelolve(false);
          setEredmenyMutat(false);
        } else {  // Hibás
          // Hibás válasz - számláló -1 (csak nem-gyakorlás módban)
          if (!isGyakorlas && szamlalo > 0) {
            setSzamlalo(szamlalo - 1);
          }
          const leiras = stripHtml(kerdesekList[szamlalo].kerdesek_leiras || "");
          setWrongAnswerInfo({
            rightAnswer: kerdesekList[szamlalo].kerdesek_helyesValasz,
            description: leiras,
            isTraining: isGyakorlas
          });
          setShowWrongAnswerModal(true);
        }
      }, 1000);
    }, 2000);
  };

  const telefonSegitseg = () => { 
    if(telefonSegitsegAktiv) { 
      if (!isGyakorlas) {
        setTelefonSegitsegAktiv(false);
        if (isSpeedrun) {
          setKozonsegSegitsegAktiv(false);
          setFelezoSegitsegAktiv(false);
        }
      } 
      setPhoneHelpAnswer(helyesValasz);
      setPhoneHelpModalVisible(true);
    }
  };
  const kozonsegSegitseg = () => { 
    if(kozonsegSegitsegAktiv) { 
      if (!isGyakorlas) {
        setKozonsegSegitsegAktiv(false);
        if (isSpeedrun) {
          setTelefonSegitsegAktiv(false);
          setFelezoSegitsegAktiv(false);
        }
      } 
      let esely = 40;
      let maradekSzazalek = 60;
      if (szamlalo < 3) { esely = 50; maradekSzazalek = 50; } 
      else if (szamlalo > 5) { esely = 30; maradekSzazalek = 70; }

      const helyes = esely + Math.floor(Math.random() * maradekSzazalek);
      let szazalekTomb = ["0%", "0%", "0%", "0%"];
      const helyesIndex = valaszok.indexOf(kerdesekList[szamlalo].kerdesek_helyesValasz);
      let maradek = 100 - helyes;
      let index = 0;

      while (maradek > 0) {
        if (index === helyesIndex) {
          szazalekTomb[index] = helyes + "%";
        } else if (index === 3 || (index === 2 && helyesIndex === 3)) {
          szazalekTomb[index] = maradek + "%";
          maradek = 0;
        } else {
          let rand = Math.floor(Math.random() * maradek);
          szazalekTomb[index] = rand + "%";
          maradek -= rand;
        }
        if (index === 3) maradek = 0;
        index++;
      }
      szazalekTomb[helyesIndex] = helyes + "%";
      setKozonsegMegjelol(true); 
      setSzazalek(szazalekTomb); 
    }
  };
  const felezoSegitseg = () => { 
    if(felezoSegitsegAktiv) { 
      if (!isGyakorlas) {
        setFelezoSegitsegAktiv(false);
        if (isSpeedrun) {
          setTelefonSegitsegAktiv(false);
          setKozonsegSegitsegAktiv(false);
        }
      } 
      setFelezoMegjelol(true); 
    }
  };

  const eredmenyMentes = async (cim: string, tartalom: string) => {
    if (isGyakorlas) {
      setGameEndMessage(`Elért pontszámod: ${szamlalo}`);
      setGameEndModalVisible(true);
      return;
    }

    if (szamlalo <= 0) {
      Alert.alert('Nincs menthető eredmény', '0 pontos eredményt nem lehet menteni.');
      return;
    }

    let saveContent = tartalom;
    if (isSpeedrun || isEndless) {
      saveContent = `Elért pontszám: ${szamlalo}`; 
    } else {
      saveContent = tartalom + `\nNyeremény: ${pontszam} Ft`;
    }

    setConfirmSaveModalInfo({
      title: cim,
      content: saveContent
    });
    setConfirmSaveModalVisible(true);
  };

  const performSave = async () => {
    if (szamlalo <= 0) {
      Alert.alert('Nincs menthető eredmény', '0 pontos eredményt nem lehet menteni.');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userid');
      const token = await AsyncStorage.getItem('token');

      if (token && userId) {
        const maiDatum = new Date().toISOString();
        const response = await fetch(`${Cim.Cim}/eredmenyFelvitel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nyeremeny: pontszam,
            pontszam: szamlalo,
            jatekos: userId,
            kategoria: kategoria,
            datum: maiDatum
          }),
        });
      } else {
        await AsyncStorage.setItem("taroltEredmeny", JSON.stringify({
          ePont: pontszam,
          eKat: kategoria
        }));
        setLoginPromptModalVisible(true);
      }
    } catch (error) {
      console.log('Eredmeny mentes error:', error);
    }
  };

  const handleConfirmSaveYes = async () => {
    setConfirmSaveModalVisible(false);
    await performSave();
    setSzamlalo(0); 
    kerdesekBetoltve(false);
  };

  const valaszKever = () => {
    setFelezoMegjelol(false);
    setKozonsegMegjelol(false);
    setValaszMegjelolve(false);
    if (!kerdesekList || !kerdesekList[szamlalo]) return;
    
    let tomb = [kerdesekList[szamlalo].kerdesek_helyesValasz, kerdesekList[szamlalo].kerdesek_helytelenValasz1, kerdesekList[szamlalo].kerdesek_helytelenValasz2, kerdesekList[szamlalo].kerdesek_helytelenValasz3];
    for (let i = tomb.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [tomb[i], tomb[j]] = [tomb[j], tomb[i]]; }
    setValaszok(tomb);
    setHelyesValasz(kerdesekList[szamlalo].kerdesek_helyesValasz);
    let randomHelytelen;
    do { randomHelytelen = Math.floor(Math.random() * 4); } while (tomb[randomHelytelen] === kerdesekList[szamlalo].kerdesek_helyesValasz);
    setHelytelenValaszMarad(tomb[randomHelytelen]);
    setTolt(true);
    const nyeremenyek = [0, 50000, 100000, 500000, 750000, 1500000, 2000000, 10000000, 15000000, 50000000];
    setPontszam(nyeremenyek[szamlalo] || 0);
  };

  const handleExit = () => {
    setExitModalVisible(true);
  };

  const kuldHibaJelentes = async () => {
    if (!hibaLeiras.trim()) {
      setHibaVisszajelzesSzoveg('Kérlek írd le a hibát!');
      setHibaVisszajelzesSiker(false);
      setHibaVisszajelzesModalVisible(true);
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userid');
      const response = await fetch(`${Cim.Cim}/kerdes-hibajelentes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kerdes_id: kerdesekList[szamlalo]?.kerdesek_id,
          jatekos_id: userId,
          leiras: hibaLeiras
        }),
      });

      if (response.ok) {
        setHibaVisszajelzesSzoveg('Hibajelentés sikeresen beküldve! Köszönjük!');
        setHibaVisszajelzesSiker(true);
        setHibajelentesModalVisible(false);
        setHibaLeiras('');
      } else {
        setHibaVisszajelzesSzoveg('Hiba a hibajelentés beküldésekor');
        setHibaVisszajelzesSiker(false);
      }
    } catch (error) {
      console.log('Hibajelentés error:', error);
      setHibaVisszajelzesSzoveg('Hiba a hibajelentés beküldésekor');
      setHibaVisszajelzesSiker(false);
    }
    setHibaVisszajelzesModalVisible(true);
  };

  useEffect(() => { 
    if (kerdesekList && szamlalo < kerdesekList.length) {
      valaszKever(); 
    }
  }, [szamlalo, kerdesekList]);

  if (szamlalo < kerdesekList.length && tolt && kerdesekList[szamlalo]) {
    
    // ============= RESPONSIV KÉPERNYŐ MÉRET FELISMERÉS =============
    const isSmallScreen = width < 350;
    const isMediumScreen = width >= 350 && width < 600;
    const isTablet = width >= 600 && width < 900;
    const isLargeTablet = width >= 900;
    
    // ============= GRADIENSEK =============
    const bgGradientColors = ['#AB47BC', '#7B1FA2', '#4A148C'] as const;
    const goldGradient = ['#FFD54F', '#FFB300'] as const;
    const pinkBadgeGradient = ['#F48FB1', '#EC407A'] as const;
    const greenGradient = ['#69F0AE', '#00C853'] as const;
    const redGradient = ['#ef5350', '#c62828'] as const;
    const defaultLetterColor = '#AB47BC';
    const selectedLetterColor = 'rgba(255,255,255,0.3)';
    
    // ============= RESPONSIV FONT MÉRETEK =============
    const responsiveFontSizes = {
      headerPill: isSmallScreen ? 12 : isMediumScreen ? 13 : isTablet ? 16 : 18,
      question: isSmallScreen ? 18 : isMediumScreen ? 20 : isTablet ? 24 : 28,
      answerText: isSmallScreen ? 14 : isMediumScreen ? 16 : isTablet ? 18 : 20,
      controlText: isSmallScreen ? 9 : isMediumScreen ? 11 : 13,
    };
    
    // ============= RESPONSIV SZÓKÖZÖK ÉS PADDING =============
    const responsivePadding = {
      headerHorizontal: isSmallScreen ? 12 : isMediumScreen ? 15 : isTablet ? 30 : 40,
      headerVertical: isSmallScreen ? 8 : 10,
      questionPadding: isSmallScreen ? 20 : isMediumScreen ? 24 : isTablet ? 40 : 50,
      questionMargin: isSmallScreen ? 12 : isMediumScreen ? 15 : isTablet ? 30 : 40,
      answerMargin: isSmallScreen ? 8 : isMediumScreen ? 10 : isTablet ? 15 : 20,
      answerPadding: isSmallScreen ? 14 : isMediumScreen ? 16 : isTablet ? 20 : 25,
      answerHeight: isSmallScreen ? 60 : isMediumScreen ? 65 : isTablet ? 80 : 90,
      bottomPadding: isSmallScreen ? 15 : isMediumScreen ? 20 : isTablet ? 40 : 50,
    };
    
    // ============= RESPONSIV KOMPONENS MÉRETEK =============
    const controlSize = isSmallScreen ? 36 : isMediumScreen ? 40 : isTablet ? 55 : 65;
    const controlIconSize = isSmallScreen ? 20 : isMediumScreen ? 22 : isTablet ? 30 : 34;
    const iconSize = isSmallScreen ? 60 : 80;
    const exitIconSize = isSmallScreen ? 18 : 22;
    const starIconSize = isSmallScreen ? 12 : 16;
    const trophyIconSize = isSmallScreen ? 12 : 16;
    const timerIconSize = isSmallScreen ? 12 : 16;

    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <View style={[styles.contentContainer, isTablet && { maxWidth: 800, alignSelf: 'center', width: '100%' }, isLargeTablet && { maxWidth: 1000, alignSelf: 'center', width: '100%' }]}>
            {/* ========== FEJLÉC ========== */}
            <View style={styles.newHeaderRow}>
              <TouchableOpacity
                style={styles.exitDoorBtn}
                onPress={handleExit}
              >
                <MaterialCommunityIcons name="door-open" size={isSmallScreen ? 18 : 24} color="#FF6B6B" />
                {!isSmallScreen && <Text style={styles.exitDoorText}>Kilépés</Text>}
              </TouchableOpacity>

              <Text style={[styles.newHeaderText, { flex: 1, textAlign: 'center', fontSize: isSmallScreen ? 14 : 17 }]}>
                Kérdés {szamlalo + 1} / {isEndless ? '∞' : kerdesekList.length}
              </Text>

              <TouchableOpacity
                style={styles.exitDoorBtn}
                onPress={() => setHibajelentesModalVisible(true)}
              >
                <MaterialCommunityIcons name="alert-circle-outline" size={isSmallScreen ? 18 : 24} color="#FFA500" />
                {!isSmallScreen && <Text style={styles.exitDoorText}>Hiba</Text>}
              </TouchableOpacity>
            </View>


            {/* ========== IDŐMÉRŐ (CSAK SPEEDRUN) ========== */}
            {isSpeedrun && (
              <View style={{ 
                marginHorizontal: 8, 
                marginBottom: 8, 
                height: 8, 
                backgroundColor: isDark ? '#444' : '#E0E0E0', 
                borderRadius: 5, 
                overflow: 'hidden' 
              }}>
                <View style={{ 
                  height: '100%', 
                  width: `${progress * 100}%`, 
                  backgroundColor: progress > 0.3 ? '#AB47BC' : '#FF6B6B' 
                }} />
              </View>
            )}

            {/* ========== PROGRESS DOTS ========== */}
            <View style={styles.progressDotsContainer}>
              {kerdesekList.map((_, index) => {
                // Csak a környező pöttyöket mutatjuk, ha túl sok van
                if (kerdesekList.length > 15) {
                  if (index < szamlalo - 3 || index > szamlalo + 3) {
                    if (index === 0 || index === kerdesekList.length - 1) {
                      // Első és utolsó mindig látszik
                    } else if (index === szamlalo - 4 || index === szamlalo + 4) {
                      return <Text key={index} style={{color: '#ccc', fontSize: 10}}>...</Text>;
                    } else {
                      return null;
                    }
                  }
                }
                
                return (
                  <View
                    key={index}
                    style={[
                      styles.progressDot,
                      index === szamlalo ? styles.progressDotActive : null,
                      index < szamlalo ? styles.progressDotCompleted : null,
                    ]}
                  />
                );
              })}
            </View>

            {/* ========== KÉRDÉS KÁRTYA ========== */}
            <View style={styles.newQuestionCard}>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 8 }}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <Text style={[styles.newQuestionText, { fontSize: responsiveFontSizes.question }]}>
                  {kerdesekList[szamlalo].kerdesek_kerdes}
                </Text>
              </ScrollView>
            </View>

            {/* ========== VÁLASZOK ========== */}
            <View style={styles.newAnswersContainer}>
              {valaszok.map((elem, index) => {
                const isHidden = 
                  felezoMegjelol && 
                  (elem !== helyesValasz && elem !== helytelenValaszMarad);
                const isSelectedSubstitute = megjeloltValasz === elem;
                const isCorrect = elem === kerdesekList[szamlalo].kerdesek_helyesValasz;
                
                let answerStyle: any = styles.newAnswerBtn;
                let textStyle: any = styles.newAnswerText;
                let letterBoxStyle: any = styles.answerLetterBox;
                let letterTextStyle: any = styles.answerLetterText;

                if (eredmenyMutat) {
                  if (isCorrect) {
                    answerStyle = [styles.newAnswerBtn, styles.newAnswerBtnCorrect];
                    textStyle = [styles.newAnswerText, styles.newAnswerTextCorrect];
                    letterBoxStyle = [styles.answerLetterBox, styles.answerLetterBoxCorrect];
                    letterTextStyle = [styles.answerLetterText, styles.answerLetterTextCorrect];
                  } else if (isSelectedSubstitute) {
                    answerStyle = [styles.newAnswerBtn, styles.newAnswerBtnWrong];
                    textStyle = [styles.newAnswerText, styles.newAnswerTextWrong];
                    letterBoxStyle = [styles.answerLetterBox, styles.answerLetterBoxWrong];
                    letterTextStyle = [styles.answerLetterText, styles.answerLetterTextWrong];
                  }
                } else {
                  if (isSelectedSubstitute) {
                    answerStyle = [styles.newAnswerBtn, styles.newAnswerBtnSelected];
                    textStyle = [styles.newAnswerText, styles.newAnswerTextSelected];
                    letterBoxStyle = [styles.answerLetterBox, styles.answerLetterBoxSelected];
                    letterTextStyle = [styles.answerLetterText, styles.answerLetterTextSelected];
                  }
                }

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.9}
                    disabled={valaszMegjelolve || isHidden}
                    onPress={() => valaszEllenoriz(elem)}
                    style={[{ opacity: isHidden ? 0 : 1 }, answerStyle]}
                  >
                    <View style={[letterBoxStyle, { width: isSmallScreen ? 28 : 34, height: isSmallScreen ? 28 : 34, borderRadius: isSmallScreen ? 14 : 17, marginRight: isSmallScreen ? 10 : 14 }]}>
                      <Text style={[letterTextStyle, { fontSize: isSmallScreen ? 12 : 14 }]}>{betuk[index]}</Text>
                    </View>
                    <Text style={[textStyle, { fontSize: responsiveFontSizes.answerText }]}>
                      {elem}
                      {kozonsegMegjelol && szazalek[index] 
                        ? `  (${szazalek[index]})` 
                        : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ========== SEGÍTSÉGEK ========== */}
            <View style={styles.newLifelinesContainer}>
              <Text style={[styles.newLifelinesTitle, { fontSize: isSmallScreen ? 9 : 11 }]}>ELÉRHETŐ SEGÍTSÉGEK</Text>
              <View style={styles.newLifelinesRow}>
                {/* FELEZŐ (50:50) segítség */}
                <TouchableOpacity
                  style={[
                    styles.newLifelineBtn,
                    !felezoSegitsegAktiv && { opacity: 0.5 },
                    { width: isSmallScreen ? 46 : 56, height: isSmallScreen ? 46 : 56, borderRadius: isSmallScreen ? 23 : 28 }
                  ]}
                  onPress={felezoSegitseg}
                  disabled={!felezoSegitsegAktiv}
                >
                  <Text style={{ color: '#8E24AA', fontWeight: 'bold', fontSize: isSmallScreen ? 11 : 14 }}>50:50</Text>
                </TouchableOpacity>

                {/* TELEFON segítség */}
                <TouchableOpacity
                  style={[
                    styles.newLifelineBtn,
                    !telefonSegitsegAktiv && { opacity: 0.5 },
                    { width: isSmallScreen ? 46 : 56, height: isSmallScreen ? 46 : 56, borderRadius: isSmallScreen ? 23 : 28 }
                  ]}
                  onPress={telefonSegitseg}
                  disabled={!telefonSegitsegAktiv}
                >
                  <MaterialCommunityIcons
                    name="phone"
                    size={isSmallScreen ? 20 : 24}
                    color="#8E24AA"
                  />
                </TouchableOpacity>

                {/* KÖZÖNSÉG segítség */}
                <TouchableOpacity
                  style={[
                    styles.newLifelineBtn,
                    !kozonsegSegitsegAktiv && { opacity: 0.5 },
                    { width: isSmallScreen ? 46 : 56, height: isSmallScreen ? 46 : 56, borderRadius: isSmallScreen ? 23 : 28 }
                  ]}
                  onPress={kozonsegSegitseg}
                  disabled={!kozonsegSegitsegAktiv}
                >
                  <MaterialCommunityIcons
                    name="account-group-outline"
                    size={isSmallScreen ? 20 : 24}
                    color="#8E24AA"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

      {/* IDŐ LEJÁRT Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={idoLejartMutat}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.timeoutModal,
              {
                width: isSmallScreen ? '90%' : '85%',
                maxWidth: isTablet ? 400 : 360,
              },
            ]}
          >
            {/* Icon */}
            <MaterialCommunityIcons
              name="clock-alert"
              size={isSmallScreen ? 60 : 80}
              color="#FF6B6B"
            />

            {/* Cím */}
            <Text
              style={[
                styles.timeoutTitle,
                {
                  fontSize: isSmallScreen ? 24 : 28,
                },
              ]}
            >
              Idő lejárt! ⏰
            </Text>

            {/* Szöveg */}
            <Text
              style={[
                styles.timeoutText,
                {
                  fontSize: isSmallScreen ? 14 : 16,
                },
              ]}
            >
              Sajnos nem sikerült időben válaszolni.
            </Text>

            {/* Gomb */}
            <TouchableOpacity
              style={[
                styles.timeoutButton,
                {
                  paddingVertical: isSmallScreen ? 12 : 14,
                },
              ]}
              onPress={() => {
                setIdoLejartMutat(false);
                eredmenyMentes('Nem nyertél! 😿', 'Az idő lejárt!');
              }}
            >
              <Text
                style={[
                  styles.timeoutButtonText,
                  {
                    fontSize: isSmallScreen ? 14 : 16,
                  },
                ]}
              >
                Rendben
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* HIBÁS VÁLASZ Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showWrongAnswerModal}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.wrongAnswerModal,
              {
                width: isSmallScreen ? '90%' : '85%',
                maxWidth: 360,
              },
            ]}
          >
            {/* Icon */}
            <MaterialCommunityIcons
              name="close-circle"
              size={isSmallScreen ? 60 : 80}
              color="#FF6B6B"
            />

            {/* Cím */}
            <Text
              style={[
                styles.wrongAnswerTitle,
                {
                  fontSize: isSmallScreen ? 22 : 24,
                },
              ]}
            >
              Helytelen! 😿
            </Text>

            {/* Helyes válasz */}
            <View
              style={[
                styles.correctAnswerBox,
                {
                  padding: isSmallScreen ? 12 : 15,
                },
              ]}
            >
              <Text
                style={[
                  styles.correctAnswerLabel,
                  {
                    fontSize: isSmallScreen ? 11 : 12,
                  },
                ]}
              >
                A helyes válasz:
              </Text>
              <Text
                style={[
                  styles.correctAnswerText,
                  {
                    fontSize: isSmallScreen ? 14 : 16,
                  },
                ]}
              >
                {wrongAnswerInfo.rightAnswer}
              </Text>
            </View>

            {/* Leírás (ha van) */}
            {wrongAnswerInfo.description ? (
              <View
                style={[
                  styles.descriptionBox,
                  {
                    padding: isSmallScreen ? 12 : 15,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.descriptionText,
                    {
                      fontSize: isSmallScreen ? 12 : 14,
                    },
                  ]}
                >
                  {wrongAnswerInfo.description}
                </Text>
              </View>
            ) : null}

            {/* Gombok */}
            <View
              style={[
                styles.wrongAnswerButtonContainer,
                {
                  gap: isSmallScreen ? 8 : 10,
                },
              ]}
            >
              {/* VISSZA / TOVÁBB gomb */}
              <TouchableOpacity
                style={[
                  styles.wrongAnswerButton,
                  wrongAnswerInfo.isTraining && { backgroundColor: '#8E24AA' },
                  {
                    paddingVertical: isSmallScreen ? 10 : 12,
                  },
                ]}
                onPress={() => {
                  setShowWrongAnswerModal(false);
                  setMegjeloltValasz(null);
                  setValaszMegjelolve(false);
                  setEredmenyMutat(false);
                  if (wrongAnswerInfo.isTraining) {
                    // Gyakorlásban: következő kérdés
                    setSzamlalo(prev => prev + 1);
                  } else {
                    // Normál módban: visszalép
                    setSzamlalo(0);
                    kerdesekBetoltve(false);
                  }
                }}
              >
                <Text
                  style={[
                    styles.wrongAnswerButtonText,
                    {
                      fontSize: isSmallScreen ? 12 : 14,
                    },
                  ]}
                >
                  {wrongAnswerInfo.isTraining ? 'Tovább' : 'Vissza'}
                </Text>
              </TouchableOpacity>

              {/* MENTÉS gomb (csak ha nem gyakorlás) */}
              {!wrongAnswerInfo.isTraining && szamlalo > 0 && (
                <TouchableOpacity
                  style={[
                    styles.wrongAnswerButton,
                    styles.saveButton,
                    {
                      paddingVertical: isSmallScreen ? 10 : 12,
                    },
                  ]}
                  onPress={() => {
                    eredmenyMentes(
                      'Nem nyertél! 😿',
                      `Helyes: ${wrongAnswerInfo.rightAnswer}\n\n${wrongAnswerInfo.description}`
                    );
                  }}
                >
                  <Text
                    style={[
                      styles.wrongAnswerButtonText,
                      {
                        fontSize: isSmallScreen ? 12 : 14,
                      },
                    ]}
                  >
                    Mentés
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* JÁTÉK VÉGE Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={gameEndModalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.gameEndModal,
              {
                width: isSmallScreen ? '90%' : '85%',
                maxWidth: 360,
              },
            ]}
          >
            {/* Icon */}
            <MaterialCommunityIcons
              name="flag-checkered"
              size={isSmallScreen ? 60 : 80}
              color="#FFB300"
            />

            {/* Cím */}
            <Text
              style={[
                styles.gameEndTitle,
                {
                  fontSize: isSmallScreen ? 22 : 24,
                },
              ]}
            >
              Játék vége! 🏁
            </Text>

            {/* Üzenet */}
            <Text
              style={[
                styles.gameEndText,
                {
                  fontSize: isSmallScreen ? 16 : 18,
                },
              ]}
            >
              {gameEndMessage}
            </Text>

            {/* Gomb */}
            <TouchableOpacity
              style={[
                styles.gameEndButton,
                {
                  paddingVertical: isSmallScreen ? 10 : 12,
                },
              ]}
              onPress={() => {
                setGameEndModalVisible(false);
                setSzamlalo(0);
                kerdesekBetoltve(false);
              }}
            >
              <Text
                style={[
                  styles.gameEndButtonText,
                  {
                    fontSize: isSmallScreen ? 14 : 16,
                  },
                ]}
              >
                Rendben
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Eredmény mentése Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmSaveModalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.confirmSaveModal, {
            width: isSmallScreen ? '90%' : '85%',
            maxWidth: 360,
          }]}>
            <MaterialCommunityIcons name="help-circle" size={isSmallScreen ? 60 : 80} color="#2196F3" />
            <Text style={[styles.confirmSaveTitle, {
              fontSize: isSmallScreen ? 20 : 22,
            }]}>{confirmSaveModalInfo.title}</Text>
            <Text style={[styles.confirmSaveText, {
              fontSize: isSmallScreen ? 14 : 16,
            }]}>{confirmSaveModalInfo.content}</Text>
            <Text style={[styles.confirmSaveQuestion, {
              fontSize: isSmallScreen ? 12 : 14,
            }]}>Hozzá szeretné adni a jelenlegi eredményét a többihez?</Text>
            <View style={[styles.confirmSaveButtonContainer, {
              gap: isSmallScreen ? 8 : 10,
            }]}>
              <TouchableOpacity
                style={[styles.confirmSaveButton, styles.noButton, {
                  paddingVertical: isSmallScreen ? 10 : 12,
                }]}
                onPress={() => {
                  setConfirmSaveModalVisible(false);
                  setSzamlalo(0);
                  kerdesekBetoltve(false);
                }}
              >
                <Text style={[styles.confirmSaveButtonText, {
                  fontSize: isSmallScreen ? 12 : 14,
                }]}>Nem</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmSaveButton, styles.yesButton, {
                  paddingVertical: isSmallScreen ? 10 : 12,
                }]}
                onPress={handleConfirmSaveYes}
              >
                <Text style={[styles.confirmSaveButtonText, {
                  fontSize: isSmallScreen ? 12 : 14,
                }]}>Igen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bejelentkezés szükséges Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={loginPromptModalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.loginPromptModal, {
            width: isSmallScreen ? '90%' : '85%',
            maxWidth: 360,
          }]}>
            <MaterialCommunityIcons name="account-lock" size={isSmallScreen ? 60 : 80} color="#FF9800" />
            <Text style={[styles.loginPromptTitle, {
              fontSize: isSmallScreen ? 20 : 22,
            }]}>Bejelentkezés szükséges</Text>
            <Text style={[styles.loginPromptText, {
              fontSize: isSmallScreen ? 12 : 14,
            }]}>Eredmény eltárolva. Jelentkezz be a feltöltéshez!</Text>
            <View style={[styles.loginPromptButtonContainer, {
              gap: isSmallScreen ? 8 : 10,
            }]}>
              <TouchableOpacity
                style={[styles.loginPromptButton, styles.cancelButton, {
                  paddingVertical: isSmallScreen ? 10 : 12,
                }]}
                onPress={() => {
                  setLoginPromptModalVisible(false);
                  setSzamlalo(0);
                  kerdesekBetoltve(false);
                }}
              >
                <Text style={[styles.loginPromptButtonText, {
                  fontSize: isSmallScreen ? 12 : 14,
                }]}>Mégse</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.loginPromptButton, styles.loginButton, {
                  paddingVertical: isSmallScreen ? 10 : 12,
                }]}
                onPress={() => {
                  setLoginPromptModalVisible(false);
                  if (navigateToProfile) navigateToProfile();
                }}
              >
                <Text style={[styles.loginPromptButtonText, {
                  fontSize: isSmallScreen ? 12 : 14,
                }]}>Bejelentkezés</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========== MODÁLIS ABLAKOK ========== */}

      {/* TELEFON SEGÍTSÉG Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={phoneHelpModalVisible}
        onRequestClose={() => setPhoneHelpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.phoneHelpModal,
              {
                width: isSmallScreen ? '90%' : '85%',
                maxWidth: 360,
              },
            ]}
          >
            {/* Icon */}
            <MaterialCommunityIcons
              name="phone"
              size={isSmallScreen ? 60 : 80}
              color="#2196F3"
            />

            {/* Cím */}
            <Text
              style={[
                styles.phoneHelpTitle,
                {
                  fontSize: isSmallScreen ? 20 : 22,
                },
              ]}
            >
              Telefonos segítség
            </Text>

            {/* Tartalom */}
            <View
              style={[
                styles.phoneHelpContent,
                {
                  marginVertical: isSmallScreen ? 10 : 15,
                },
              ]}
            >
              <Text
                style={[
                  styles.phoneHelpLabel,
                  {
                    fontSize: isSmallScreen ? 12 : 14,
                  },
                ]}
              >
                Szerintem a helyes válasz:
              </Text>
              <Text
                style={[
                  styles.phoneHelpAnswer,
                  {
                    fontSize: isSmallScreen ? 16 : 18,
                    paddingVertical: isSmallScreen ? 10 : 12,
                  },
                ]}
              >
                {phoneHelpAnswer}
              </Text>
            </View>

            {/* Gomb */}
            <TouchableOpacity
              style={[
                styles.phoneHelpButton,
                {
                  paddingVertical: isSmallScreen ? 10 : 12,
                },
              ]}
              onPress={() => setPhoneHelpModalVisible(false)}
            >
              <Text
                style={[
                  styles.phoneHelpButtonText,
                  {
                    fontSize: isSmallScreen ? 12 : 14,
                  },
                ]}
              >
                Rendben
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* KILÉPÉS MEGERŐSÍTÉS Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={exitModalVisible}
        onRequestClose={() => setExitModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.exitConfirmModal,
              {
                width: isSmallScreen ? '90%' : '85%',
                maxWidth: 360,
              },
            ]}
          >
            {/* Icon */}
            <MaterialCommunityIcons
              name="door-open"
              size={isSmallScreen ? 60 : 80}
              color="#FF6B6B"
            />

            {/* Cím */}
            <Text
              style={[
                styles.exitConfirmTitle,
                {
                  fontSize: isSmallScreen ? 20 : 22,
                },
              ]}
            >
              Kilépés
            </Text>

            {/* Szöveg */}
            <Text
              style={[
                styles.exitConfirmText,
                {
                  fontSize: isSmallScreen ? 12 : 14,
                },
              ]}
            >
              Biztosan ki szeretnél lépni? Az eddigi haladásod elveszik.
            </Text>

            {/* Gombok */}
            <View
              style={[
                styles.exitConfirmButtonContainer,
                {
                  gap: isSmallScreen ? 8 : 10,
                },
              ]}
            >
              {/* NEM gomb */}
              <TouchableOpacity
                style={[
                  styles.exitConfirmButton,
                  styles.exitCancelButton,
                  {
                    paddingVertical: isSmallScreen ? 10 : 12,
                  },
                ]}
                onPress={() => setExitModalVisible(false)}
              >
                <Text
                  style={[
                    styles.exitConfirmButtonText,
                    {
                      fontSize: isSmallScreen ? 12 : 14,
                    },
                  ]}
                >
                  Mégse
                </Text>
              </TouchableOpacity>

              {/* KILÉPÉS gomb */}
              <TouchableOpacity
                style={[
                  styles.exitConfirmButton,
                  styles.exitDestructiveButton,
                  {
                    paddingVertical: isSmallScreen ? 10 : 12,
                  },
                ]}
                onPress={() => {
                  setExitModalVisible(false);
                  setSzamlalo(0);
                  kerdesekBetoltve(false);
                }}
              >
                <Text
                  style={[
                    styles.exitConfirmDestructiveButtonText,
                    {
                      fontSize: isSmallScreen ? 12 : 14,
                    },
                  ]}
                >
                  Kilépés
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* HIBA JELENTÉS Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={hibajelentesModalVisible}
        onRequestClose={() => setHibajelentesModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.confirmSaveModal,
              {
                width: isSmallScreen ? '95%' : '92%',
                maxWidth: 560,
              },
            ]}
          >
            {/* Icon */}
            <MaterialCommunityIcons
              name="alert-circle"
              size={isSmallScreen ? 50 : 60}
              color="#FF9800"
            />

            {/* Cím */}
            <Text
              style={[
                styles.confirmSaveTitle,
                {
                  fontSize: isSmallScreen ? 18 : 22,
                  color: '#FF9800',
                },
              ]}
            >
              Hibát jelentesz?
            </Text>

            {/* Szöveg */}
            <Text
              style={[
                styles.confirmSaveQuestion,
                {
                  fontSize: isSmallScreen ? 12 : 14,
                  marginVertical: 15,
                },
              ]}
            >
              Segítsd a fejlődést és írd le a hibát, kérlek!
            </Text>

            {/* Input */}
            <TextInput
              style={[
                {
                  width: '100%',
                  borderWidth: 1,
                  borderColor: '#FF9800',
                  borderRadius: 10,
                  padding: 12,
                  marginVertical: 10,
                  minHeight: 80,
                  textAlignVertical: 'top',
                  color: colors.text,
                  backgroundColor: isDark ? '#333' : '#FFF',
                  fontSize: isSmallScreen ? 12 : 14,
                },
              ]}
              placeholder="Pl: A helyes válasz hibás, vagy a kérdés értelmetlen..."
              placeholderTextColor={isDark ? '#999' : '#999'}
              multiline
              numberOfLines={4}
              value={hibaLeiras}
              onChangeText={setHibaLeiras}
            />

            {/* Gombok */}
            <View
              style={[
                styles.confirmSaveButtonContainer,
                {
                  gap: isSmallScreen ? 8 : 10,
                  marginTop: 15,
                },
              ]}
            >
              {/* MÉGSE gomb */}
              <TouchableOpacity
                style={[
                  styles.confirmSaveButton,
                  styles.noButton,
                  {
                    paddingVertical: isSmallScreen ? 10 : 12,
                  },
                ]}
                onPress={() => {
                  setHibajelentesModalVisible(false);
                  setHibaLeiras('');
                }}
              >
                <Text
                  style={[
                    styles.confirmSaveButtonText,
                    {
                      fontSize: isSmallScreen ? 12 : 14,
                    },
                  ]}
                >
                  Mégse
                </Text>
              </TouchableOpacity>

              {/* KÜLDÉS gomb */}
              <TouchableOpacity
                style={[
                  styles.confirmSaveButton,
                  styles.yesButton,
                  {
                    paddingVertical: isSmallScreen ? 10 : 12,
                    backgroundColor: '#FF9800',
                  },
                ]}
                onPress={kuldHibaJelentes}
              >
                <Text
                  style={[
                    styles.confirmSaveButtonText,
                    {
                      fontSize: isSmallScreen ? 12 : 14,
                    },
                  ]}
                >
                  Küldés
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* HIBA VISSZAJELZÉS Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={hibaVisszajelzesModalVisible}
        onRequestClose={() => setHibaVisszajelzesModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.confirmSaveModal, {
            width: isSmallScreen ? '95%' : '92%',
            maxWidth: 480,
          }]}>
            <MaterialCommunityIcons 
              name={hibaVisszajelzesSiker ? "check-circle" : "alert-circle"} 
              size={isSmallScreen ? 60 : 80} 
              color={hibaVisszajelzesSiker ? "#4CAF50" : "#FF6B6B"} 
            />
            <Text style={[styles.confirmSaveTitle, {
              fontSize: isSmallScreen ? 20 : 22,
              color: hibaVisszajelzesSiker ? "#4CAF50" : "#FF6B6B",
              marginBottom: 10
            }]}>
              {hibaVisszajelzesSiker ? "Sikeres küldés!" : "Hiba!"}
            </Text>
            <Text style={[styles.confirmSaveText, {
              fontSize: isSmallScreen ? 14 : 16,
              textAlign: 'center',
              marginBottom: 20
            }]}>
              {hibaVisszajelzesSzoveg}
            </Text>
            
            <TouchableOpacity
              style={{
                flex: 0,
                paddingVertical: isSmallScreen ? 12 : 14,
                paddingHorizontal: 40,
                borderRadius: 10,
                backgroundColor: hibaVisszajelzesSiker ? "#4CAF50" : "#FF6B6B",
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '50%',
                elevation: 3,
              }}
              onPress={() => setHibaVisszajelzesModalVisible(false)}
            >
              <Text style={{
                fontSize: isSmallScreen ? 14 : 16,
                color: '#FFFFFF',
                fontWeight: 'bold',
              }}>Rendben</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      </SafeAreaView>
    );

  } else if (szamlalo >= kerdesekList.length && tolt) {
    const handleSave = async () => {
      await performSave();
      setMentve(true);
    };
    return (
      <SafeAreaView style={styles.centerContainer}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <View style={styles.winnerCard}>
            <MaterialCommunityIcons name="trophy" size={80} color="#FFD700" />
            <Text style={styles.winnerTitle}>Játék Vége!</Text>
            <Text style={styles.winnerPrize}>{pontszam.toLocaleString('hu-HU')} Ft</Text>
            
            {!mentve && !isGyakorlas && szamlalo > 0 ? (
            <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
                <Text style={styles.primaryBtnText}>Eredmény mentése</Text>
            </TouchableOpacity>
            ) : null}
            
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => { setSzamlalo(0); kerdesekBetoltve(false); }}
            >
              <Text style={styles.secondaryBtnText}>Vissza a menübe</Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
        <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#8E24AA" />
            <Text style={{marginTop: 15, color: colors.text, fontSize: 16}}>Betöltés...</Text>
        </View>
    );
  }
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 6,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeoutModal: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    width: '85%',
    maxWidth: 360,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  timeoutTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  timeoutText: {
    fontSize: 16,
    color: colors.text_secondary,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  timeoutButton: {
    backgroundColor: '#FF6B6B',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  timeoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  wrongAnswerModal: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    maxWidth: 320,
    elevation: 10,
  },
  wrongAnswerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginVertical: 15,
    textAlign: 'center',
  },
  correctAnswerBox: {
    backgroundColor: '#FFF3E0',
    borderLeftColor: '#FF6B6B',
    borderLeftWidth: 4,
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    width: '100%',
  },
  correctAnswerLabel: {
    fontSize: 12,
    color: colors.text_secondary,
    marginBottom: 5,
    fontWeight: '600',
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  descriptionBox: {
    backgroundColor: isDark ? colors.background : '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
  },
  descriptionText: {
    fontSize: 14,
    color: colors.text_secondary,
    lineHeight: 20,
    textAlign: 'justify',
  },
  wrongAnswerButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
    width: '100%',
  },
  wrongAnswerButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  wrongAnswerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  gameEndModal: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    maxWidth: 320,
    elevation: 10,
  },
  gameEndTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFB300',
    marginVertical: 15,
    textAlign: 'center',
  },
  gameEndText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: 10,
    textAlign: 'center',
  },
  gameEndButton: {
    backgroundColor: '#FFB300',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    elevation: 3,
  },
  gameEndButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmSaveModal: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    maxWidth: 320,
    elevation: 10,
  },
  confirmSaveTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2196F3',
    marginVertical: 15,
    textAlign: 'center',
  },
  confirmSaveText: {
    fontSize: 16,
    color: colors.text,
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  confirmSaveQuestion: {
    fontSize: 14,
    color: colors.text_secondary,
    marginVertical: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  confirmSaveButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
    width: '100%',
  },
  confirmSaveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  noButton: {
    backgroundColor: '#FF6B6B',
  },
  yesButton: {
    backgroundColor: '#4CAF50',
  },
  confirmSaveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loginPromptModal: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    maxWidth: 320,
    elevation: 10,
  },
  loginPromptTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF9800',
    marginVertical: 15,
    textAlign: 'center',
  },
  loginPromptText: {
    fontSize: 14,
    color: colors.text_secondary,
    marginVertical: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  loginPromptButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
    width: '100%',
  },
  loginPromptButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  loginButton: {
    backgroundColor: '#FF9800',
  },
  loginPromptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  phoneHelpModal: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    maxWidth: 320,
    elevation: 10,
  },
  phoneHelpTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2196F3',
    marginVertical: 15,
    textAlign: 'center',
  },
  phoneHelpContent: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 15,
  },
  phoneHelpLabel: {
    fontSize: 14,
    color: colors.text_secondary,
    marginBottom: 10,
  },
  phoneHelpAnswer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    minWidth: 100,
  },
  phoneHelpButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  phoneHelpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  exitConfirmModal: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    maxWidth: 320,
    elevation: 10,
  },
  exitConfirmTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginVertical: 15,
    textAlign: 'center',
  },
  exitConfirmText: {
    fontSize: 14,
    color: colors.text_secondary,
    marginVertical: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
  exitConfirmButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
    width: '100%',
  },
  exitConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  exitCancelButton: {
    backgroundColor: isDark ? '#4B5563' : '#E0E0E0',
  },
  exitDestructiveButton: {
    backgroundColor: '#FF6B6B',
  },
  exitConfirmButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.text,
  },
  exitConfirmDestructiveButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff',
  },
  newQuestionCard: {
    flex: 1.5,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginHorizontal: 8,
    marginTop: 6,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  newQuestionText: {
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
    lineHeight: 28,
  },
  newAnswersContainer: {
    flex: 3,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  newAnswerBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  newAnswerBtnSelected: {
    backgroundColor: '#EDE9FF',
    borderColor: '#6C5CE7',
  },
  newAnswerBtnCorrect: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  newAnswerBtnWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  newAnswerText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  answerLetterBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EDE9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  answerLetterBoxSelected: {
    backgroundColor: '#6C5CE7',
  },
  answerLetterBoxCorrect: {
    backgroundColor: '#22C55E',
  },
  answerLetterBoxWrong: {
    backgroundColor: '#EF4444',
  },
  answerLetterText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6C5CE7',
  },
  answerLetterTextSelected: {
    color: '#fff',
  },
  answerLetterTextCorrect: {
    color: '#fff',
  },
  answerLetterTextWrong: {
    color: '#fff',
  },
  newAnswerTextSelected: {
    color: '#4C1D95',
  },
  newAnswerTextCorrect: {
    color: '#15803D',
  },
  newAnswerTextWrong: {
    color: '#DC2626',
  },
  newLifelinesContainer: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newLifelinesTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text_secondary,
    marginBottom: 14,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  newLifelinesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  newLifelineBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  newLifelineText5050: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  newHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  newHeaderIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  exitDoorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2',
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 16,
    marginRight: 5,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(239,68,68,0.3)' : '#FECACA',
  },
  exitDoorText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 4,
  },
  exitDoorSpacer: {
    width: 90,
  },
  newHeaderText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  progressDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    gap: 5,
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: isDark ? '#4B5563' : '#E5E7EB',
  },
  progressDotActive: {
    backgroundColor: '#6C5CE7',
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  progressDotCompleted: {
    backgroundColor: '#6C5CE7',
    opacity: 0.4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  winnerCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  winnerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginVertical: 15,
  },
  winnerPrize: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginVertical: 20,
  },
  primaryBtn: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginVertical: 10,
    elevation: 1,
  },
  secondaryBtnText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default Kerdesek;
