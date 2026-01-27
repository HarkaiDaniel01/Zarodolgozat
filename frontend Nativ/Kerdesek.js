import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  useWindowDimensions 
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Cim from "./Cim";

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
  const [jatekosId, setJatekosId] = useState(null);
  // Nyeremény mentés állapota a végén
  const [mentve, setMentve] = useState(false);

  // Speedrun state-ek
  const [ido, setIdo] = useState(60);
  const [progress, setProgress] = useState(1);
  const isSpeedrun = kategoria === 0;
  const isEndless = kategoria === -1;
  
  useEffect(() => {
    if (isSpeedrun && szamlalo < kerdesek.length) {
      const nehezseg = kerdesek[szamlalo].kerdesek_nehezseg;
      const kezdoIdo = nehezseg === 1 ? 60 : nehezseg === 2 ? 45 : 30;
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
  }, [szamlalo, isSpeedrun]);
  
  const stripHtml = (html) => (!html ? "" : html.replace(/<[^>]*>?/gm, ''));

  const valaszEllenoriz = async (valasz) => {
    setMegjeloltValasz(valasz);
    setValaszMegjelolve(true);
    setTimeout(async () => {
      if (valasz === kerdesek[szamlalo].kerdesek_helyesValasz) {
        if (isEndless && szamlalo === kerdesek.length - 1) {
          // Ha az utolsó kérdésnél vagyunk, töltsünk be újakat
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
        Alert.alert("A Válasz helyes! 😺", "Következő kérdés 🏆", [{ text: "Ok", onPress: () => setSzamlalo(szamlalo + 1) }]);
      } else {
        const leiras = stripHtml(kerdesek[szamlalo].kerdesek_leiras || "");
        if (isGyakorlas) {
          Alert.alert("Helytelen! 😿", `A helyes válasz: ${kerdesek[szamlalo].kerdesek_helyesValasz}\n\n${leiras}`, [{ text: "Ok", onPress: () => setSzamlalo(szamlalo + 1) }]);
        } else {
          eredmenyMentes("Nem nyertél! 😿", `Helyes: ${kerdesek[szamlalo].kerdesek_helyesValasz}\n\n${leiras}`);
        }
      }
      setMegjeloltValasz(null);
      setValaszMegjelolve(false);
    }, 1000);
  };

  const telefonSegitseg = () => { 
    if(telefonSegitsegAktiv) { 
      if (!isGyakorlas) setTelefonSegitsegAktiv(false); 
      Alert.alert("Telefon", "Szerintem: " + helyesValasz); 
    }
  };
  const kozonsegSegitseg = () => { 
    if(kozonsegSegitsegAktiv) { 
      if (!isGyakorlas) setKozonsegSegitsegAktiv(false); 
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
      if (!isGyakorlas) setFelezoSegitsegAktiv(false); 
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

    Alert.alert(cim, tartalom + `\nNyeremény: ${pontszam} Ft\nHozzá szeretné adni a jelenlegi eredményét a többi hez?`, [
        { text: "Nem", onPress: () => { setSzamlalo(0); kerdesekBetoltve(false); } },
        { 
          text: "Igen", 
          onPress: async () => { 
            try {
              const userId = await AsyncStorage.getItem('userid');
              const token = await AsyncStorage.getItem('token');

              if (token && userId) {
                // Bejelentkezett felhasználó - azonnal feltöltjük
                const maiDatum = new Date().toISOString();
                const response = await fetch(`${Cim.Cim}/eredmenyFelvitel`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    nyeremeny: pontszam,
                    jatekos: userId,
                    kategoria: kategoria,
                    datum: maiDatum
                  }),
                });

                if (response.ok) {
                  Alert.alert("Siker", "Eredmény sikeresen mentve!");
                } else {
                  Alert.alert("Hiba", "Nem sikerült menteni az eredményt.");
                }
              } else {
                // Nincs bejelentkezve - eltároljuk és átirányítjuk login oldalra
                await AsyncStorage.setItem("taroltEredmeny", JSON.stringify({
                  ePont: pontszam,
                  eKat: kategoria
                }));
                Alert.alert(
                  "Bejelentkezés szükséges", 
                  "Eredmény eltárolva. Jelentkezz be a feltöltéshez!",
                  [
                    { 
                      text: "Mégse", 
                      style: 'cancel'
                    },
                    { 
                      text: "Bejelentkezés", 
                      onPress: () => {
                        if (navigateToProfile) navigateToProfile();
                      }
                    }
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

  useEffect(() => { 
    if (szamlalo < kerdesek.length) {
      valaszKever(); 
    }
  }, [szamlalo]);

  if (szamlalo < kerdesek.length && tolt) {
    const DynamicContainer = height < 700 ? ScrollView : View;
    const containerProps = height < 700 ? { contentContainerStyle: styles.scrollContent } : { style: styles.fullHeightContainer };

    return (
      <View style={styles.screenWrapper}>
        <DynamicContainer {...containerProps}>
            {/* Felső rész: Nyeremény + Kérdés */}
            <View style={styles.topSection}>
                {!isSpeedrun && !isEndless && !isGyakorlas && (
                  <View style={styles.prizePill}>
                      <Text style={styles.prizeText}>Jelenlegi nyeremény: {pontszam} Ft</Text>
                  </View>
                )}

                {isSpeedrun && (
                  <View style={styles.speedrunContainer}>
                    <View style={styles.timerContainer}>
                      <Text style={styles.timerText}>⏱️ {ido}s</Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                    </View>
                  </View>
                )}

                <View style={styles.questionBox}>
                    <Text style={styles.questionText}>{kerdesek[szamlalo].kerdesek_kerdes}</Text>
                </View>
            </View>
            {/* Középső rész: Válaszok */}
            <View style={styles.middleSection}>
                {valaszok.map((elem, index) => {
                    const isHidden = felezoMegjelol && (elem !== helyesValasz && elem !== helytelenValaszMarad);
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.answerBtn, megjeloltValasz === elem && {backgroundColor: '#FFEB3B'}, isHidden && {opacity: 0}]}
                            onPress={() => valaszEllenoriz(elem)}
                            disabled={valaszMegjelolve || isHidden}
                        >
                            <View style={styles.circle}>
                                <Text style={styles.circleText}>{betuk[index]}</Text>
                            </View>
                            <View style={styles.answerTextContainer}>
                                <Text style={styles.answerText}>
                                    {elem}
                                    {kozonsegMegjelol && szazalek[index] ? <Text style={{color: '#2962FF', fontWeight: 'bold'}}> ({szazalek[index]})</Text> : ""}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
            {/* Alsó rész: Segítségek + Kilépés */}
            <View style={styles.bottomSection}>
                <View style={styles.helpersRow}>
                    <TouchableOpacity style={[styles.helperBtn, !telefonSegitsegAktiv && styles.disabledHelper, {gap: isLargeScreen ? 15 : 10, maxWidth: isLargeScreen ? 140 : 100}]} onPress={telefonSegitseg} disabled={!telefonSegitsegAktiv}>
                        <Text style={[styles.helperEmoji, {fontSize: isLargeScreen ? 32 : 24}]}>📞</Text>
                        <Text style={[styles.helperLabel, {fontSize: isLargeScreen ? 13 : 11}]}>Telefon</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.helperBtn, !kozonsegSegitsegAktiv && styles.disabledHelper, {gap: isLargeScreen ? 15 : 10, maxWidth: isLargeScreen ? 140 : 100}]} onPress={kozonsegSegitseg} disabled={!kozonsegSegitsegAktiv}>
                        <Text style={[styles.helperEmoji, {fontSize: isLargeScreen ? 32 : 24}]}>👥</Text>
                        <Text style={[styles.helperLabel, {fontSize: isLargeScreen ? 13 : 11}]}>Közönség</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.helperBtn, !felezoSegitsegAktiv && styles.disabledHelper, {gap: isLargeScreen ? 15 : 10, maxWidth: isLargeScreen ? 140 : 100}]} onPress={felezoSegitseg} disabled={!felezoSegitsegAktiv}>
                        <Text style={[styles.helperEmoji, {fontSize: isLargeScreen ? 32 : 24}]}>%</Text>
                        <Text style={[styles.helperLabel, {fontSize: isLargeScreen ? 13 : 11}]}>50:50</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.exitBtn, {padding: isLargeScreen ? 20 : 15}]} onPress={() => kerdesekBetoltve(false)}>
                    <Text style={[styles.exitText, {fontSize: isLargeScreen ? 18 : 16}]}>✖ Kilépés</Text>
                </TouchableOpacity>
            </View>

        </DynamicContainer>
      </View>
    );
  } else if (szamlalo >= kerdesek.length && tolt) {
    // Játékos végigment, nyert
    const handleSave = async () => {
      await eredmenyMentes("Gratulálok, nyertél! 🏆", "Végigvitted a játékot!");
      setMentve(true);
    };
    return (
      <View style={styles.center}>
        <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 10}}>Gratulálok, nyertél! 🏆</Text>
        <Text style={{fontSize: 18, marginBottom: 20}}>Nyeremény: {pontszam} Ft</Text>
        {!mentve ? (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Eredmény mentése</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.exitBtnStyled}
          activeOpacity={0.8}
          onPress={() => { setSzamlalo(0); kerdesekBetoltve(false); }}
        >
          <Text style={styles.exitTextStyled}>🏠 Vissza a főmenübe</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return <View style={styles.center}><Text>Töltés...</Text></View>;
  }
};
//stilusok
const styles = StyleSheet.create({
  saveBtn: {
      backgroundColor: '#4CAF50',
      borderRadius: 30,
      paddingVertical: 15,
      paddingHorizontal: 30,
      marginBottom: 15,
      alignItems: 'center',
      elevation: 2,
    },
    saveText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  screenWrapper: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  fullHeightContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  scrollContent: {
    padding: 20,
    minHeight: '100%',
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  prizePill: {
    backgroundColor: '#FFD740',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 50,
    marginBottom: 15,
    elevation: 2,
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2}
  },
  prizeText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16
  },
  questionBox: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    minHeight: 100,
  },
  questionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    lineHeight: 24
  },
  middleSection: {
    width: '100%',
    gap: 10,
    marginVertical: 10,
  },
  answerBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    width: '100%',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2962FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    flexShrink: 0,
  },
  circleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  answerTextContainer: {
    flex: 1,
  },
  answerText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  bottomSection: {
    width: '100%',
    marginTop: 10,
  },
  helpersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  helperBtn: {
    backgroundColor: '#fff',
    flex: 1,
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2}
  },
  disabledHelper: {
    backgroundColor: '#EEEEEE',
    opacity: 0.6
  },
  helperEmoji: {
    marginBottom: 5
  },
  helperLabel: {
    color: '#555',
    textAlign: 'center'
  },
  exitBtn: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee'
  },
  exitText: {
    color: '#333',
    fontWeight: 'bold',
  },
  // Speedrun stílusok
  speedrunContainer: {
    width: '100%',
    marginBottom: 15,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarContainer: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2962FF',
    borderRadius: 5,
  },
  exitBtnStyled: {
    backgroundColor: '#2196F3',
    width: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    borderWidth: 0,
    paddingVertical: 18,
    marginTop: 10,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    marginBottom: 5,
  },
  exitTextStyled: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});

export default Kerdesek;