import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Switch,
  Alert,
  StatusBar
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import Cim from "./Cim";
import Kerdesek from "./Kerdesek"; 

const Kategoria = ({ setHideTabBar, navigateToProfile }) => {
  const [adatok, setAdatok] = useState([]);
  const [tolt, setTolt] = useState(true);
  const [hiba, setHiba] = useState(false);
  const [kerdesek, setKerdesek] = useState([]);
  const [kerdesekBetoltve, setKerdesekBetoltve] = useState(false);
  const [kategoria, setKategoria] = useState(0);
  const [isGyakorlas, setIsGyakorlas] = useState(false);
  const [isHardcore, setIsHardcore] = useState(false);

  const getIconName = (index) => {
    const icons = [
      "bank", 
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

  const [szinek] = useState([
    "#8E24AA", "#00C853", "#FF1744", "#F50057", "#FF6D00", 
    "#009688", "#607D8B", "#795548", "#3F51B5"
  ]);
  
  const kategoriaValaszt = async (kategoriaId, kategoriaNev) => {
    if (kategoriaNev === "Speedrun") kategoriaValasztSpeedrun(kategoriaId);
    else if (kategoriaNev === "Endless") kategoriaValasztEndless(kategoriaId);
    else if (kategoriaNev === "Gyakorlas") kategoriaValasztGyakorlas(kategoriaId);
    else { 
      setKategoria(kategoriaId);
      const konnyu = await KerdesekLetoltese(kategoriaId, "/kerdesekKonnyu");
      const kozepes = await KerdesekLetoltese(kategoriaId, "/kerdesekKozepes");
      const nehez = await KerdesekLetoltese(kategoriaId, "/kerdesekNehez");
      setKerdesek([...konnyu, ...kozepes, ...nehez]);
      setKerdesekBetoltve(true);
    }
  };

  const kategoriaValasztSpeedrun = async (kategoriaId) => {
    setKategoria(kategoriaId);
    const konnyu = await KerdesekLetolteseVegyes("/kerdesekKonnyuVegyes");
    const kozepes = await KerdesekLetolteseVegyes("/kerdesekKozepesVegyes");
    const nehez = await KerdesekLetolteseVegyes("/kerdesekNehezVegyes");
    setKerdesek([...konnyu, ...kozepes, ...nehez]);
    setKerdesekBetoltve(true);
  };

  const kategoriaValasztEndless = async (kategoriaId) => {
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

  const kategoriaValasztGyakorlas = async (kategoriaId) => {
    if (isHardcore) {
      Alert.alert("Ultrranehéz Mód", "Ultrranehéz módban nem lehet gyakorolni!");
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

  const KerdesekLetoltese = async (kategoriaId, vegpont) => {
    try {
      const response = await fetch(Cim.Cim + vegpont, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kategoria: kategoriaId }),
      });
      return response.ok ? await response.json() : [];
    } catch (error) { return []; }
  };

  const KerdesekLetolteseVegyes = async (vegpont) => {
    try {
      const response = await fetch(Cim.Cim + vegpont, { method: "GET" });
      return response.ok ? await response.json() : [];
    } catch (error) { console.log('KerdesekLetolteseVegyes Error:', error); return []; }
  };

  const leToltes = async () => {
    try {
      const response = await fetch(Cim.Cim + "/kategoria");
      const data = await response.json();
      if (response.ok) { 
        const szurtAdatok = data.filter(item => item.kategoria_nev !== "Vegyes" );
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

  useEffect(() => {
    setHideTabBar(kerdesekBetoltve);
  }, [kerdesekBetoltve, setHideTabBar]);

  useEffect(() => { leToltes(); }, []);

  if (tolt) return <View style={styles.center}><ActivityIndicator size="large" color="#2962FF" /></View>;
  if (hiba) return <View style={styles.center}><Text>Hiba az adatok letöltésekor.</Text></View>;

  return (
    <View style={styles.container}>
      {!kerdesekBetoltve ? (
        <>
            <LinearGradient
                colors={['#6200EA', '#F50057']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top', 'left', 'right']}>
                    <View style={styles.headerContent}>
                        <View style={styles.headerTopRow}>
                            <View style={styles.titleRow}>
                                <MaterialCommunityIcons name="fire" size={28} color="#FFD740" />
                                <Text style={styles.headerTitle}>Kvízjáték</Text>
                            </View>
                            <View style={styles.hardcoreContainer}>
                                <Text style={styles.hardcoreText}>Ultranehéz Mód</Text>
                                <Switch
                                    trackColor={{ false: "#BDBDBD", true: "#FF3D00" }}
                                    thumbColor={"#fff"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={(val) => {
                                        setIsHardcore(val);
                                        if (val) Alert.alert("Ultranehéz Mód", "Az Ultranehéz mód aktiválva! Összes segitség kikapcsolva. Sok szerencsét! 🧠");
                                    }}
                                    value={isHardcore}
                                />
                            </View>
                        </View>
                        <Text style={styles.subTitle}>Válassz kategóriát!</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <View style={styles.listWrapper}>
                <FlatList
                    data={adatok}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => kategoriaValaszt(item.kategoria_id, item.kategoria_nev)}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: szinek[index % szinek.length] }]}>
                            <MaterialCommunityIcons name={getIconName(index)} size={24} color="#fff" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.cardText} numberOfLines={1} adjustsFontSizeToFit>
                                {item.kategoria_nev}
                            </Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#BDBDBD" />
                    </TouchableOpacity>
                    )}
                    
                    ListFooterComponent={
                    <View style={{marginTop: 20}}>
                        <Text style={styles.sectionTitle}>Speciális módok</Text>
                        <View style={{gap: 15, paddingBottom: 20}}>
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => kategoriaValaszt(0, 'Speedrun')}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: '#7E57C2' }]}>
                                <MaterialCommunityIcons name="timer-outline" size={24} color="#fff" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.cardText}>Gyorsasági kihívás</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDBDBD" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => kategoriaValaszt(-1, 'Endless')}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: '#E91E63' }]}>
                                <MaterialCommunityIcons name="infinity" size={24} color="#fff" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.cardText}>Megállás nélkül</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDBDBD" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => kategoriaValaszt(-2, 'Gyakorlas')}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
                                <MaterialCommunityIcons name="school" size={24} color="#fff" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.cardText}>Gyakorlás</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDBDBD" />
                        </TouchableOpacity>
                        </View>
                    </View>
                    }
                />
            </View>
        </>
      ) : (
        <SafeAreaView style={{flex: 1}}>
             <Kerdesek kerdesek={kerdesek} kategoria={kategoria} kerdesekBetoltve={setKerdesekBetoltve} navigateToProfile={navigateToProfile} isGyakorlas={isGyakorlas} isHardcore={isHardcore}/>
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
    // @ts-ignore
    boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.2)',
    elevation: 6,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  hardcoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  hardcoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  subTitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.95)',
    marginTop: 5,
    fontWeight: '500',
  },
  listWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    // @ts-ignore
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardText: {
    color: "#333",
    fontWeight: "700",
    fontSize: 17,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#444',
      marginBottom: 15,
      marginLeft: 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Kategoria;
