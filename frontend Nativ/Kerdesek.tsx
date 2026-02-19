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
  Modal
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Cim from "./Cim";

// Stílusok a "Design alapján"
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
    marginRight: 15,
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
  const [loginPromptModalVisible, setLoginPromptModalVisible] = useState(false);
  const [phoneHelpModalVisible, setPhoneHelpModalVisible] = useState(false);
  const [phoneHelpAnswer, setPhoneHelpAnswer] = useState('');
  const [exitModalVisible, setExitModalVisible] = useState(false);

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
        if (valasz === kerdesekList[szamlalo].kerdesek_helyesValasz) {
          if (isEndless && szamlalo === kerdesekList.length - 1) {
            try {
              const response = await fetch(Cim.Cim + `/endless-kerdesek`, { method: "GET" });
              const ujKerdesek = await response.json();
              if (response.ok) {
                setKerdesekList(prev => [...prev, ...ujKerdesek]);
              }
            } catch (error) {
              console.log('Endless kerdesek betoltese hiba:', error);
            }
          }
          setSzamlalo(szamlalo + 1);
          setMegjeloltValasz(null);
          setValaszMegjelolve(false);
          setEredmenyMutat(false);
        } else {
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
    if (isEndless || isSpeedrun || isGyakorlas) {
      setGameEndMessage(`Elért pontszámod: ${szamlalo}`);
      setGameEndModalVisible(true);
      return;
    }

    setConfirmSaveModalInfo({
      title: cim,
      content: tartalom + `\nNyeremény: ${pontszam} Ft`
    });
    setConfirmSaveModalVisible(true);
  };

  const handleConfirmSaveYes = async () => {
    setConfirmSaveModalVisible(false);
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

  useEffect(() => { 
    if (kerdesekList && szamlalo < kerdesekList.length) {
      valaszKever(); 
    }
  }, [szamlalo, kerdesekList]);

  if (szamlalo < kerdesekList.length && tolt && kerdesekList[szamlalo]) {
    
    // Responsive sizing
    const isSmallScreen = width < 350;
    const isMediumScreen = width >= 350 && width < 600;
    const isTablet = width >= 600 && width < 900;
    const isLargeTablet = width >= 900;
    
    // Gradient definitions for reuse
    const bgGradientColors = ['#AB47BC', '#7B1FA2', '#4A148C'] as const; // Pinkish Purple -> Deep Purple
    const goldGradient = ['#FFD54F', '#FFB300'] as const;
    const pinkBadgeGradient = ['#F48FB1', '#EC407A'] as const;
    const greenGradient = ['#69F0AE', '#00C853'] as const; // Light Green -> Green
    const redGradient = ['#ef5350', '#c62828'] as const; // Red
    const defaultLetterColor = '#AB47BC';
    const selectedLetterColor = 'rgba(255,255,255,0.3)';
    
    // Responsive font sizes
    const responsiveFontSizes = {
      headerPill: isSmallScreen ? 12 : isMediumScreen ? 13 : 14,
      question: isSmallScreen ? 16 : isMediumScreen ? 18 : isTablet ? 20 : 22,
      answerText: isSmallScreen ? 14 : isMediumScreen ? 15 : isTablet ? 16 : 17,
      controlText: isSmallScreen ? 9 : isMediumScreen ? 10 : 11,
    };
    
    // Responsive spacing
    const responsivePadding = {
      headerHorizontal: isSmallScreen ? 12 : isMediumScreen ? 15 : isTablet ? 20 : 25,
      headerVertical: isSmallScreen ? 8 : 10,
      questionPadding: isSmallScreen ? 20 : isMediumScreen ? 24 : isTablet ? 28 : 30,
      questionMargin: isSmallScreen ? 12 : isMediumScreen ? 15 : isTablet ? 20 : 25,
      answerMargin: isSmallScreen ? 8 : isMediumScreen ? 10 : isTablet ? 12 : 14,
      answerPadding: isSmallScreen ? 14 : isMediumScreen ? 16 : isTablet ? 18 : 20,
      answerHeight: isSmallScreen ? 60 : isMediumScreen ? 65 : isTablet ? 70 : 75,
      bottomPadding: isSmallScreen ? 15 : isMediumScreen ? 20 : isTablet ? 25 : 30,
    };
    
    // Responsive control bar
    const controlSize = isSmallScreen ? 36 : isMediumScreen ? 40 : isTablet ? 45 : 50;
    const controlIconSize = isSmallScreen ? 20 : isMediumScreen ? 22 : isTablet ? 24 : 26;

    return (
      <LinearGradient colors={bgGradientColors} style={customStyles.fullScreen} start={{x:0, y:0}} end={{x:1, y:1}}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
        <SafeAreaView style={{flex: 1}}>
          <ScrollView contentContainerStyle={{paddingBottom: 20}} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={[customStyles.headerDetailsContainer, {
              paddingHorizontal: responsivePadding.headerHorizontal,
              marginTop: responsivePadding.headerVertical,
              marginBottom: responsivePadding.headerVertical,
            }]}>
                {/* Exit Button - Top Left */}
                <TouchableOpacity 
                  style={[customStyles.headerExitBtn, {
                    width: isSmallScreen ? 36 : 40,
                    height: isSmallScreen ? 36 : 40,
                    borderRadius: isSmallScreen ? 18 : 20,
                  }]} 
                  onPress={handleExit}
                >
                    <MaterialCommunityIcons name="door-open" size={isSmallScreen ? 18 : 22} color="#8e24aa" />
                </TouchableOpacity>

                <View style={customStyles.headerStatsContainer}>
                    <View style={[customStyles.headerPillLeft, {
                      paddingVertical: responsivePadding.headerVertical,
                    }]}>
                        <MaterialCommunityIcons name="star-four-points-outline" size={isSmallScreen ? 12 : 16} color="#8e24aa" />
                        <Text style={[customStyles.headerPillTextLeft, {
                          fontSize: responsiveFontSizes.headerPill,
                        }]}>
                        {szamlalo + 1}/{isEndless ? '∞' : kerdesekList.length}
                        </Text>
                    </View>

                    {!isGyakorlas && !isSpeedrun && (
                        <View style={[customStyles.headerPillRight, {
                          paddingVertical: responsivePadding.headerVertical,
                        }]}>
                        <MaterialCommunityIcons name="trophy-outline" size={isSmallScreen ? 12 : 16} color="#3e2723" />
                        <Text style={[customStyles.headerPillTextRight, {
                          fontSize: responsiveFontSizes.headerPill,
                        }]}>
                            {pontszam.toLocaleString('hu-HU')}
                        </Text>
                        </View>
                    )}
                    {isSpeedrun && (
                        <View style={[customStyles.headerPillRight, {
                          paddingVertical: responsivePadding.headerVertical,
                        }]}>
                        <MaterialCommunityIcons name="timer-outline" size={isSmallScreen ? 12 : 16} color="#3e2723" />
                        <Text style={[customStyles.headerPillTextRight, {
                          fontSize: responsiveFontSizes.headerPill,
                        }]}>
                            {ido}s
                        </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Question Card */}
            <View style={[customStyles.questionCard, {
              padding: responsivePadding.questionPadding,
              marginHorizontal: responsivePadding.questionMargin,
              marginTop: responsivePadding.questionMargin,
              marginBottom: responsivePadding.questionMargin,
              minHeight: isSmallScreen ? 120 : isMediumScreen ? 140 : isTablet ? 160 : 180,
            }]}>
              <LinearGradient 
                colors={pinkBadgeGradient}
                start={{x:0, y:0}} end={{x:1, y:0}}
                style={customStyles.floatingBadge}
              >
                 <Text style={customStyles.floatingBadgeText}>Kérdés</Text>
              </LinearGradient>
              <Text style={[customStyles.questionText, {
                fontSize: responsiveFontSizes.question,
              }]}>
                 {kerdesekList[szamlalo].kerdesek_kerdes}
              </Text>
            </View>

            {/* Answers */}
            <View style={[customStyles.answersContainer, {
              paddingHorizontal: responsivePadding.questionMargin,
              gap: responsivePadding.answerMargin,
              marginBottom: responsivePadding.bottomPadding,
            }]}>
               {valaszok.map((elem, index) => {
                 const isHidden = felezoMegjelol && (elem !== helyesValasz && elem !== helytelenValaszMarad);
                 const isSelectedSubstitute = megjeloltValasz === elem;
                 const isCorrect = elem === kerdesekList[szamlalo].kerdesek_helyesValasz;
                 
                 // Determine which gradient/style to apply
                 let gradientColors: readonly [string, string, ...string[]] | null = null;
                 let useGradient = false;

                 if (eredmenyMutat) {
                    if (isCorrect) {
                        gradientColors = greenGradient;
                        useGradient = true;
                    } else if (isSelectedSubstitute) {
                        gradientColors = redGradient;
                        useGradient = true;
                    }
                 } else {
                    if (isSelectedSubstitute) {
                        gradientColors = goldGradient;
                        useGradient = true;
                    }
                 }

                 const answerContent = (
                    <>
                      <View style={[
                          customStyles.letterBox, 
                          {
                            width: isSmallScreen ? 50 : isMediumScreen ? 55 : 60,
                          },
                          useGradient && { backgroundColor: selectedLetterColor }
                      ]}>
                         <Text style={[customStyles.letterText, {
                           fontSize: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
                         }]}>{betuk[index]}</Text>
                      </View>
                      <View style={customStyles.answerTextContainer}>
                        <Text style={[
                            customStyles.answerText, 
                            {
                              fontSize: responsiveFontSizes.answerText,
                            },
                            useGradient && customStyles.answerTextSelected
                        ]}>
                          {elem}
                          {kozonsegMegjelol && szazalek[index] ? `  (${szazalek[index]})` : ''}
                        </Text>
                      </View>
                    </>
                 );

                 return (
                   <TouchableOpacity
                      key={index}
                      activeOpacity={0.9}
                      disabled={valaszMegjelolve || isHidden}
                      onPress={() => valaszEllenoriz(elem)}
                      style={{ opacity: isHidden ? 0 : 1 }}
                   >
                     {useGradient && gradientColors ? (
                       <Animated.View style={{ 
                         opacity: isCorrect && eredmenyMutat ? blinkAnim : 1 
                       }}>
                         <LinearGradient 
                           colors={gradientColors}
                           start={{x:0, y:0}} 
                           end={{x:1, y:0}} 
                           style={[
                             customStyles.answerRow, 
                             customStyles.answerRowSelected,
                             {
                               height: responsivePadding.answerHeight,
                               marginBottom: responsivePadding.answerMargin,
                             }
                           ]}
                         >
                           {answerContent}
                         </LinearGradient>
                       </Animated.View>
                     ) : (
                       <View style={[customStyles.answerRow, {
                         height: responsivePadding.answerHeight,
                         marginBottom: responsivePadding.answerMargin,
                       }]}>
                         {answerContent}
                       </View>
                     )}
                   </TouchableOpacity>
                 );
               })}
            </View>

            {/* Bottom Control Bar */}
            <View style={[customStyles.bottomSection, {
              paddingHorizontal: responsivePadding.questionMargin,
              paddingBottom: responsivePadding.bottomPadding,
            }]}>
              <View style={[customStyles.controlBar, {
                paddingVertical: isSmallScreen ? 8 : 10,
                paddingHorizontal: isSmallScreen ? 8 : 10,
              }]}>
                {/* Phone */}
                <TouchableOpacity 
                    style={[customStyles.controlItem, !telefonSegitsegAktiv && { opacity: 0.5 }]}
                    onPress={telefonSegitseg}
                    disabled={!telefonSegitsegAktiv}
                >
                    <View style={[customStyles.controlIconCircle, {
                      width: controlSize,
                      height: controlSize,
                      borderRadius: controlSize / 2,
                    }, telefonSegitsegAktiv && customStyles.controlIconCircleActive]}>
                      <MaterialCommunityIcons name="phone" size={controlIconSize} color={telefonSegitsegAktiv ? "#F57C00" : "#B0BEC5"} />
                    </View>
                    <Text style={[customStyles.controlText, {
                      fontSize: responsiveFontSizes.controlText,
                    }]}>Telefon</Text>
                </TouchableOpacity>

                {/* Audience */}
                <TouchableOpacity 
                    style={[customStyles.controlItem, !kozonsegSegitsegAktiv && { opacity: 0.5 }]}
                    onPress={kozonsegSegitseg}
                    disabled={!kozonsegSegitsegAktiv}
                >
                    <View style={[customStyles.controlIconCircle, {
                      width: controlSize,
                      height: controlSize,
                      borderRadius: controlSize / 2,
                    }, kozonsegSegitsegAktiv && customStyles.controlIconCircleActive]}>
                       <MaterialCommunityIcons name="account-group" size={controlIconSize} color={kozonsegSegitsegAktiv ? "#F57C00" : "#B0BEC5"} />
                    </View>
                    <Text style={[customStyles.controlText, {
                      fontSize: responsiveFontSizes.controlText,
                    }]}>Közönség</Text>
                </TouchableOpacity>

                {/* 50:50 */}
                <TouchableOpacity 
                    style={[customStyles.controlItem, !felezoSegitsegAktiv && { opacity: 0.5 }]}
                    onPress={felezoSegitseg}
                    disabled={!felezoSegitsegAktiv}
                >
                    <View style={[customStyles.controlIconCircle, {
                      width: controlSize,
                      height: controlSize,
                      borderRadius: controlSize / 2,
                    }, felezoSegitsegAktiv && customStyles.controlIconCircleActive]}>
                       <Text style={{color: felezoSegitsegAktiv ? "#F57C00" : "#B0BEC5", fontWeight: 'bold', fontSize: isSmallScreen ? 10 : 12}}>50:50</Text>
                    </View>
                    <Text style={[customStyles.controlText, {
                      fontSize: responsiveFontSizes.controlText,
                    }]}>Felező</Text>
                </TouchableOpacity>
              </View>
            </View>

        </ScrollView>
      </SafeAreaView>

      {/* Idő lejárt Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={idoLejartMutat}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.timeoutModal, {
            width: isSmallScreen ? '90%' : '85%',
            maxWidth: isTablet ? 400 : 360,
          }]}>
            <MaterialCommunityIcons name="clock-alert" size={isSmallScreen ? 60 : 80} color="#FF6B6B" />
            <Text style={[styles.timeoutTitle, {
              fontSize: isSmallScreen ? 24 : 28,
            }]}>Idő lejárt! ⏰</Text>
            <Text style={[styles.timeoutText, {
              fontSize: isSmallScreen ? 14 : 16,
            }]}>Sajnos nem sikerült időben válaszolni.</Text>
            <TouchableOpacity
              style={[styles.timeoutButton, {
                paddingVertical: isSmallScreen ? 12 : 14,
              }]}
              onPress={() => {
                setIdoLejartMutat(false);
                eredmenyMentes("Nem nyertél! 😿", "Az idő lejárt!");
              }}
            >
              <Text style={[styles.timeoutButtonText, {
                fontSize: isSmallScreen ? 14 : 16,
              }]}>Rendben</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Hibás válasz Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showWrongAnswerModal}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.wrongAnswerModal, {
            width: isSmallScreen ? '90%' : '85%',
            maxWidth: 360,
          }]}>
            <MaterialCommunityIcons name="close-circle" size={isSmallScreen ? 60 : 80} color="#FF6B6B" />
            <Text style={[styles.wrongAnswerTitle, {
              fontSize: isSmallScreen ? 22 : 24,
            }]}>Helytelen! 😿</Text>
            <View style={[styles.correctAnswerBox, {
              padding: isSmallScreen ? 12 : 15,
            }]}>
              <Text style={[styles.correctAnswerLabel, {
                fontSize: isSmallScreen ? 11 : 12,
              }]}>A helyes válasz:</Text>
              <Text style={[styles.correctAnswerText, {
                fontSize: isSmallScreen ? 14 : 16,
              }]}>{wrongAnswerInfo.rightAnswer}</Text>
            </View>
            {wrongAnswerInfo.description ? (
              <View style={[styles.descriptionBox, {
                padding: isSmallScreen ? 12 : 15,
              }]}>
                <Text style={[styles.descriptionText, {
                  fontSize: isSmallScreen ? 12 : 14,
                }]}>{wrongAnswerInfo.description}</Text>
              </View>
            ) : null}
            <View style={[styles.wrongAnswerButtonContainer, {
              gap: isSmallScreen ? 8 : 10,
            }]}>
              <TouchableOpacity
                style={[styles.wrongAnswerButton, {
                  paddingVertical: isSmallScreen ? 10 : 12,
                }]}
                onPress={() => {
                  setShowWrongAnswerModal(false);
                  setSzamlalo(0);
                  kerdesekBetoltve(false);
                }}
              >
                <Text style={[styles.wrongAnswerButtonText, {
                  fontSize: isSmallScreen ? 12 : 14,
                }]}>Vissza</Text>
              </TouchableOpacity>
              {!wrongAnswerInfo.isTraining && (
                <TouchableOpacity
                  style={[styles.wrongAnswerButton, styles.saveButton, {
                    paddingVertical: isSmallScreen ? 10 : 12,
                  }]}
                  onPress={() => {
                    eredmenyMentes("Nem nyertél! 😿", `Helyes: ${wrongAnswerInfo.rightAnswer}\n\n${wrongAnswerInfo.description}`);
                  }}
                >
                  <Text style={[styles.wrongAnswerButtonText, {
                    fontSize: isSmallScreen ? 12 : 14,
                  }]}>Mentés</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Játék vége Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={gameEndModalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.gameEndModal, {
            width: isSmallScreen ? '90%' : '85%',
            maxWidth: 360,
          }]}>
            <MaterialCommunityIcons name="flag-checkered" size={isSmallScreen ? 60 : 80} color="#FFB300" />
            <Text style={[styles.gameEndTitle, {
              fontSize: isSmallScreen ? 22 : 24,
            }]}>Játék vége! 🏁</Text>
            <Text style={[styles.gameEndText, {
              fontSize: isSmallScreen ? 16 : 18,
            }]}>{gameEndMessage}</Text>
            <TouchableOpacity
              style={[styles.gameEndButton, {
                paddingVertical: isSmallScreen ? 10 : 12,
              }]}
              onPress={() => {
                setGameEndModalVisible(false);
                setSzamlalo(0);
                kerdesekBetoltve(false);
              }}
            >
              <Text style={[styles.gameEndButtonText, {
                fontSize: isSmallScreen ? 14 : 16,
              }]}>Rendben</Text>
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

      {/* Telefonos segítség Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={phoneHelpModalVisible}
        onRequestClose={() => setPhoneHelpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.phoneHelpModal, {
            width: isSmallScreen ? '90%' : '85%',
            maxWidth: 360,
          }]}>
            <MaterialCommunityIcons name="phone" size={isSmallScreen ? 60 : 80} color="#2196F3" />
            <Text style={[styles.phoneHelpTitle, {
              fontSize: isSmallScreen ? 20 : 22,
            }]}>Telefonos segítség</Text>
            <View style={[styles.phoneHelpContent, {
              marginVertical: isSmallScreen ? 10 : 15,
            }]}>
              <Text style={[styles.phoneHelpLabel, {
                fontSize: isSmallScreen ? 12 : 14,
              }]}>Szerintem a helyes válasz:</Text>
              <Text style={[styles.phoneHelpAnswer, {
                fontSize: isSmallScreen ? 16 : 18,
                paddingVertical: isSmallScreen ? 10 : 12,
              }]}>{phoneHelpAnswer}</Text>
            </View>
            <TouchableOpacity
              style={[styles.phoneHelpButton, {
                paddingVertical: isSmallScreen ? 10 : 12,
              }]}
              onPress={() => setPhoneHelpModalVisible(false)}
            >
              <Text style={[styles.phoneHelpButtonText, {
                fontSize: isSmallScreen ? 12 : 14,
              }]}>Rendben</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Kilépés megerősítés Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={exitModalVisible}
        onRequestClose={() => setExitModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.exitConfirmModal, {
            width: isSmallScreen ? '90%' : '85%',
            maxWidth: 360,
          }]}>
            <MaterialCommunityIcons name="door-open" size={isSmallScreen ? 60 : 80} color="#FF6B6B" />
            <Text style={[styles.exitConfirmTitle, {
              fontSize: isSmallScreen ? 20 : 22,
            }]}>Kilépés</Text>
            <Text style={[styles.exitConfirmText, {
              fontSize: isSmallScreen ? 12 : 14,
            }]}>Biztosan ki szeretnél lépni? Az eddigi haladásod elveszik.</Text>
            <View style={[styles.exitConfirmButtonContainer, {
              gap: isSmallScreen ? 8 : 10,
            }]}>
              <TouchableOpacity
                style={[styles.exitConfirmButton, styles.exitCancelButton, {
                  paddingVertical: isSmallScreen ? 10 : 12,
                }]}
                onPress={() => setExitModalVisible(false)}
              >
                <Text style={[styles.exitConfirmButtonText, {
                  fontSize: isSmallScreen ? 12 : 14,
                }]}>Mégse</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.exitConfirmButton, styles.exitDestructiveButton, {
                  paddingVertical: isSmallScreen ? 10 : 12,
                }]}
                onPress={() => {
                  setExitModalVisible(false);
                  setSzamlalo(0);
                  kerdesekBetoltve(false);
                }}
              >
                <Text style={[styles.exitConfirmDestructiveButtonText, {
                  fontSize: isSmallScreen ? 12 : 14,
                }]}>Kilépés</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </LinearGradient>
    );

  } else if (szamlalo >= kerdesekList.length && tolt) {
    const handleSave = async () => {
      await eredmenyMentes("Gratulálok, nyertél! 🏆", "Végigvitted a játékot!");
      setMentve(true);
    };
    return (
      <LinearGradient
          colors={['#AB47BC', '#7B1FA2', '#4A148C']}
          style={styles.centerContainer}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.winnerCard}>
            <MaterialCommunityIcons name="trophy" size={80} color="#FFD700" />
            <Text style={styles.winnerTitle}>Játék Vége!</Text>
            <Text style={styles.winnerPrize}>{pontszam.toLocaleString('hu-HU')} Ft</Text>
            
            {!mentve && !isGyakorlas ? (
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
      </LinearGradient>
    );
  } else {
    return (
        <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{marginTop: 15, color: '#fff', fontSize: 16}}>Betöltés...</Text>
        </View>
    );
  }
};

const styles = StyleSheet.create({
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
    padding: 20,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  exitBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  prizeBadge: {
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  prizeText: {
    fontWeight: 'bold',
    color: '#3e2723',
    fontSize: 15,
  },
  
  // Question
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a237e',
    textAlign: 'center',
    lineHeight: 30,
  },

  // Answers
  answersContainer: {
    gap: 14,
    marginBottom: 30,
  },
  answerBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  answerBtnSelected: {
    backgroundColor: '#FFF9C4',
    borderColor: '#FFD700',
    transform: [{scale: 0.98}],
  },
  letterBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3949AB', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    elevation: 2,
  },
  letterText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  answerText: {
    flex: 1,
    fontSize: 17,
    color: '#333',
    fontWeight: '600',
  },
  percentageText: {
    color: '#3949AB',
    fontWeight: '800',
    marginLeft: 5,
  },
  
  // Helpers
  helpersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  helperWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  helperBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  helperBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    elevation: 0,
  },
  helperIconText: {
    fontSize: 22, 
    fontWeight: '900', 
    color: '#3949AB'
  },
  helperLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },

  // Loading/Winner
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerCard: {
    backgroundColor: '#fff',
    width: '85%',
    maxWidth: 360,
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  winnerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A148C', // Deep Purple
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  winnerPrize: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffc107', // Amber/Gold matches top pill
    marginBottom: 30,
  },
  primaryBtn: {
    backgroundColor: '#8e24aa', // Purple
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryBtn: {
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#e1bee7', // Light purple
    fontSize: 16,
    fontWeight: '500',
  },

  // Speedrun
  timerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  timerText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeoutModal: {
    backgroundColor: '#fff',
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
    color: '#666',
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
    backgroundColor: '#fff',
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
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  descriptionBox: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
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
    backgroundColor: '#fff',
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
    color: '#333',
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
    backgroundColor: '#fff',
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
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  confirmSaveQuestion: {
    fontSize: 14,
    color: '#666',
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
    backgroundColor: '#fff',
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
    color: '#666',
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
    backgroundColor: '#fff',
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
    color: '#666',
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
    backgroundColor: '#fff',
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
    color: '#666',
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
    backgroundColor: '#E0E0E0',
  },
  exitDestructiveButton: {
    backgroundColor: '#FF6B6B',
  },
  exitConfirmButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  exitConfirmDestructiveButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff',
  }
});

export default Kerdesek;
