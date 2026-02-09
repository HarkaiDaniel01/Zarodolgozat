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
  Animated
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

const Kerdesek = ({ kerdesek, kategoria, kerdesekBetoltve, navigateToProfile, isGyakorlas, isHardcore }) => {
  const { height, width } = useWindowDimensions(); 
  const isLargeScreen = width > 600; 
  
  const [szamlalo, setSzamlalo] = useState(0);
  const [valaszok, setValaszok] = useState([]);
  const [tolt, setTolt] = useState(false);
  const [pontszam, setPontszam] = useState(0);
  const [betuk] = useState(["A", "B", "C", "D"]);
  const [helyesValasz, setHelyesValasz] = useState();
  const [helytelenValaszMarad, setHelytelenValaszMarad] = useState();
  
  const [telefonSegitsegAktiv, setTelefonSegitsegAktiv] = useState(!isHardcore);
  const [felezoSegitsegAktiv, setFelezoSegitsegAktiv] = useState(!isHardcore);
  const [kozonsegSegitsegAktiv, setKozonsegSegitsegAktiv] = useState(!isHardcore);
  const [felezoMegjelol, setFelezoMegjelol] = useState(false);
  const [kozonsegMegjelol, setKozonsegMegjelol] = useState(false);
  const [szazalek, setSzazalek] = useState([]);
  const [megjeloltValasz, setMegjeloltValasz] = useState();
  const [valaszMegjelolve, setValaszMegjelolve] = useState(false);
  const [eredmenyMutat, setEredmenyMutat] = useState(false);
  
  // Nyeremény mentés állapota a végén
  const [mentve, setMentve] = useState(false);
  
  // Animáció a helyes válasz villogásához
  const [blinkAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    let loop;
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
    if (isSpeedrun && szamlalo < kerdesek.length && !valaszMegjelolve) {
      const nehezseg = kerdesek[szamlalo].kerdesek_nehezseg;
      const kezdoIdo = nehezseg === 1 ? 45 : nehezseg === 2 ? 30 : 25;
      setIdo(kezdoIdo);
      setProgress(1);

      const interval = setInterval(() => {
        setIdo(prevIdo => {
          if (prevIdo <= 1) {
            clearInterval(interval);
            eredmenyMentes("Lejárt az idő! ⌛", "Sajnos nem sikerült időben válaszolni.");
            return 0;
          }
          setProgress((prevIdo - 1) / kezdoIdo);
          return prevIdo - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [szamlalo, isSpeedrun, valaszMegjelolve]);
  
  const stripHtml = (html) => (!html ? "" : html.replace(/<[^>]*>?/gm, ''));

  const valaszEllenoriz = async (valasz) => {
    setMegjeloltValasz(valasz);
    setValaszMegjelolve(true);
    setEredmenyMutat(false); // még csak várakozunk

    setTimeout(async () => {
      setEredmenyMutat(true); // eredmények felfedése (színek)

      // Kis várakozás, hogy látszódjon a színkód (piros/zöld) az Alert előtt
      setTimeout(async () => {
        if (valasz === kerdesek[szamlalo].kerdesek_helyesValasz) {
          if (isEndless && szamlalo === kerdesek.length - 1) {
            try {
              const response = await fetch(Cim.Cim + `/endless-kerdesek`, { method: "GET" });
              const ujKerdesek = await response.json();
              if (response.ok) {
                setKerdesek(prev => [...prev, ...ujKerdesek]);
              }
            } catch (error) {
              console.log('Endless kerdesek betoltese hiba:', error);
            }
          }
          // Alert.alert("A Válasz helyes! 😺", "Következő kérdés 🏆", [{ text: "Ok", onPress: () => {
          //    setSzamlalo(szamlalo + 1);
          //    setMegjeloltValasz(null);
          //    setValaszMegjelolve(false);
          //    setEredmenyMutat(false);
          // }}]);
          setSzamlalo(szamlalo + 1);
          setMegjeloltValasz(null);
          setValaszMegjelolve(false);
          setEredmenyMutat(false);
        } else {
          const leiras = stripHtml(kerdesek[szamlalo].kerdesek_leiras || "");
          if (isGyakorlas) {
            Alert.alert("Helytelen! 😿", `A helyes válasz: ${kerdesek[szamlalo].kerdesek_helyesValasz}\n\n${leiras}`, [{ text: "Ok", onPress: () => eredmenyMentes() }]);
          } else {
            eredmenyMentes("Nem nyertél! 😿", `Helyes: ${kerdesek[szamlalo].kerdesek_helyesValasz}\n\n${leiras}`);
          }
        }
      }, 1000); // Még 1mp, hogy lássa a júzer a színeket
    }, 2000); // 2mp várakozás 'sárgán'
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
      Alert.alert("Telefonos segítség", "Szerintem a helyes válasz: " + helyesValasz); 
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
      const helyesIndex = valaszok.indexOf(kerdesek[szamlalo].kerdesek_helyesValasz);
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

  const eredmenyMentes = async (cim, tartalom) => {
    if (isEndless || isSpeedrun || isGyakorlas) {
      Alert.alert(
        "Játék vége!",
        `Elért pontszámod: ${szamlalo}`,
        [
          { text: "Ok", onPress: () => { setSzamlalo(0); kerdesekBetoltve(false); } }
        ]
      );
      return;
    }

    Alert.alert(cim, tartalom + `\nNyeremény: ${pontszam} Ft\nHozzá szeretné adni a jelenlegi eredményét a többihez?`, [
        { text: "Nem", onPress: () => { setSzamlalo(0); kerdesekBetoltve(false); } },
        { 
          text: "Igen", 
          onPress: async () => { 
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
                Alert.alert(
                  "Bejelentkezés szükséges", 
                  "Eredmény eltárolva. Jelentkezz be a feltöltéshez!",
                  [
                    { text: "Mégse", style: 'cancel'},
                    { text: "Bejelentkezés", onPress: () => { if (navigateToProfile) navigateToProfile(); } }
                  ]
                );
              }
            } catch (error) {
              console.log('Eredmeny mentes error:', error);
              Alert.alert("Hiba", "Hiba az eredmény mentése során.");
            }
            
            setSzamlalo(0); 
            kerdesekBetoltve(false);
          }
        }
    ]);
  };

  const valaszKever = () => {
    setFelezoMegjelol(false);
    setKozonsegMegjelol(false);
    setValaszMegjelolve(false);
    if (!kerdesek[szamlalo]) return;
    
    let tomb = [kerdesek[szamlalo].kerdesek_helyesValasz, kerdesek[szamlalo].kerdesek_helytelenValasz1, kerdesek[szamlalo].kerdesek_helytelenValasz2, kerdesek[szamlalo].kerdesek_helytelenValasz3];
    for (let i = tomb.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [tomb[i], tomb[j]] = [tomb[j], tomb[i]]; }
    setValaszok(tomb);
    setHelyesValasz(kerdesek[szamlalo].kerdesek_helyesValasz);
    let randomHelytelen;
    do { randomHelytelen = Math.floor(Math.random() * 4); } while (tomb[randomHelytelen] === kerdesek[szamlalo].kerdesek_helyesValasz);
    setHelytelenValaszMarad(tomb[randomHelytelen]);
    setTolt(true);
    const nyeremenyek = [0, 50000, 100000, 500000, 750000, 1500000, 2000000, 10000000, 15000000, 50000000];
    setPontszam(nyeremenyek[szamlalo] || 0);
  };

  const handleExit = () => {
    Alert.alert(
      "Kilépés",
      "Biztosan ki szeretnél lépni? Az eddigi haladásod elveszik.",
      [
        { text: "Mégse", style: "cancel" },
        { text: "Kilépés", style: "destructive", onPress: () => { setSzamlalo(0); kerdesekBetoltve(false); } }
      ]
    );
  };

  useEffect(() => { 
    if (kerdesek && szamlalo < kerdesek.length) {
      valaszKever(); 
    }
  }, [szamlalo, kerdesek]);

  if (szamlalo < kerdesek.length && tolt && kerdesek[szamlalo]) {
    
    // Gradient definitions for reuse
    const bgGradientColors = ['#AB47BC', '#7B1FA2', '#4A148C']; // Pinkish Purple -> Deep Purple
    const goldGradient = ['#FFD54F', '#FFB300'];
    const pinkBadgeGradient = ['#F48FB1', '#EC407A'];
    const greenGradient = ['#69F0AE', '#00C853']; // Light Green -> Green
    const defaultLetterColor = '#AB47BC';
    const selectedLetterColor = 'rgba(255,255,255,0.3)';

    return (
      <LinearGradient colors={bgGradientColors} style={customStyles.fullScreen} start={{x:0, y:0}} end={{x:1, y:1}}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
        <SafeAreaView style={{flex: 1}}>
          <ScrollView contentContainerStyle={{paddingBottom: 20}} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={customStyles.headerDetailsContainer}>
                {/* Exit Button - Top Left */}
                <TouchableOpacity style={customStyles.headerExitBtn} onPress={handleExit}>
                    <MaterialCommunityIcons name="door-open" size={22} color="#8e24aa" />
                </TouchableOpacity>

                <View style={customStyles.headerStatsContainer}>
                    <View style={customStyles.headerPillLeft}>
                        <MaterialCommunityIcons name="star-four-points-outline" size={16} color="#8e24aa" />
                        <Text style={customStyles.headerPillTextLeft}>
                        {szamlalo + 1}/{isEndless ? '∞' : kerdesek.length}
                        </Text>
                    </View>

                    {!isGyakorlas && !isSpeedrun && (
                        <View style={customStyles.headerPillRight}>
                        <MaterialCommunityIcons name="trophy-outline" size={16} color="#3e2723" />
                        <Text style={customStyles.headerPillTextRight}>
                            {pontszam.toLocaleString('hu-HU')}
                        </Text>
                        </View>
                    )}
                    {isSpeedrun && (
                        <View style={customStyles.headerPillRight}>
                        <MaterialCommunityIcons name="timer-outline" size={16} color="#3e2723" />
                        <Text style={customStyles.headerPillTextRight}>
                            {ido}s
                        </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Question Card */}
            <View style={customStyles.questionCard}>
              <LinearGradient 
                colors={pinkBadgeGradient}
                start={{x:0, y:0}} end={{x:1, y:0}}
                style={customStyles.floatingBadge}
              >
                 <Text style={customStyles.floatingBadgeText}>Kérdés</Text>
              </LinearGradient>
              <Text style={customStyles.questionText}>
                 {kerdesek[szamlalo].kerdesek_kerdes}
              </Text>
            </View>

            {/* Answers */}
            <View style={customStyles.answersContainer}>
               {valaszok.map((elem, index) => {
                 const isHidden = felezoMegjelol && (elem !== helyesValasz && elem !== helytelenValaszMarad);
                 
                 const isSelectedSubstitute = megjeloltValasz === elem;
                 const isCorrect = elem === kerdesek[szamlalo].kerdesek_helyesValasz;
                 
                 let currentGradient = null;
                 let isActiveStyle = false;

                 if (eredmenyMutat) {
                    if (isCorrect) {
                        currentGradient = greenGradient;
                        isActiveStyle = true;
                    } else if (isSelectedSubstitute) {
                        currentGradient = ['#ef5350', '#c62828']; // Red
                        isActiveStyle = true;
                    }
                 } else {
                    if (isSelectedSubstitute) {
                        currentGradient = goldGradient; // Yellow waiting
                        isActiveStyle = true;
                    }
                 }

                 // Wrapper Component to conditionally apply Gradient
                 const Wrapper = isActiveStyle ? LinearGradient : View;
                 const wrapperProps = isActiveStyle 
                    ? { colors: currentGradient, start: {x:0, y:0}, end: {x:1, y:0}, style: [customStyles.answerRow, customStyles.answerRowSelected] }
                    : { style: customStyles.answerRow };
                 
                 const content = (
                    <Wrapper {...wrapperProps}>
                        {/* Letter Box */}
                        <View style={[
                            customStyles.letterBox, 
                            isActiveStyle && { backgroundColor: selectedLetterColor }
                        ]}>
                           <Text style={customStyles.letterText}>{betuk[index]}</Text>
                        </View>

                        {/* Text */}
                        <View style={customStyles.answerTextContainer}>
                          <Text style={[
                              customStyles.answerText, 
                              isActiveStyle && customStyles.answerTextSelected
                          ]}>
                            {elem}
                            {kozonsegMegjelol && szazalek[index] ? `  (${szazalek[index]})` : ''}
                          </Text>
                        </View>
                     </Wrapper>
                 );

                 return (
                   <TouchableOpacity
                      key={index}
                      activeOpacity={0.9}
                      disabled={valaszMegjelolve || isHidden}
                      onPress={() => valaszEllenoriz(elem)}
                      style={{ opacity: isHidden ? 0 : 1 }}
                   >
                     {isCorrect && eredmenyMutat ? (
                       <Animated.View style={{ opacity: blinkAnim }}>
                         {content}
                       </Animated.View>
                     ) : (
                       content
                     )}
                   </TouchableOpacity>
                 );
               })}
            </View>

            {/* Bottom Control Bar */}
            <View style={customStyles.bottomSection}>
              <View style={customStyles.controlBar}>
                {/* Phone */}
                <TouchableOpacity 
                    style={[customStyles.controlItem, !telefonSegitsegAktiv && { opacity: 0.5 }]}
                    onPress={telefonSegitseg}
                    disabled={!telefonSegitsegAktiv}
                >
                    <View style={[customStyles.controlIconCircle, telefonSegitsegAktiv && customStyles.controlIconCircleActive]}>
                      <MaterialCommunityIcons name="phone" size={24} color={telefonSegitsegAktiv ? "#F57C00" : "#B0BEC5"} />
                    </View>
                    <Text style={customStyles.controlText}>Telefon</Text>
                </TouchableOpacity>

                {/* Audience */}
                <TouchableOpacity 
                    style={[customStyles.controlItem, !kozonsegSegitsegAktiv && { opacity: 0.5 }]}
                    onPress={kozonsegSegitseg}
                    disabled={!kozonsegSegitsegAktiv}
                >
                    <View style={[customStyles.controlIconCircle, kozonsegSegitsegAktiv && customStyles.controlIconCircleActive]}>
                       <MaterialCommunityIcons name="account-group" size={24} color={kozonsegSegitsegAktiv ? "#F57C00" : "#B0BEC5"} />
                    </View>
                    <Text style={customStyles.controlText}>Közönség</Text>
                </TouchableOpacity>

                {/* 50:50 */}
                <TouchableOpacity 
                    style={[customStyles.controlItem, !felezoSegitsegAktiv && { opacity: 0.5 }]}
                    onPress={felezoSegitseg}
                    disabled={!felezoSegitsegAktiv}
                >
                    <View style={[customStyles.controlIconCircle, felezoSegitsegAktiv && customStyles.controlIconCircleActive]}>
                       <Text style={{color: felezoSegitsegAktiv ? "#F57C00" : "#B0BEC5", fontWeight: 'bold', fontSize: 16}}>50:50</Text>
                    </View>
                    <Text style={customStyles.controlText}>Felező</Text>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );

  } else if (szamlalo >= kerdesek.length && tolt) {
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
  }
});

export default Kerdesek;
