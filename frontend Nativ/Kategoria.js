import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Switch,
  Alert 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
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

  const [ikonok] = useState(["🏛️", "🌐", "📖", "🎵", "⚽", "🎄", "🎲", "🧠", "🖥️"]);
  
  const [szinek] = useState([
    "#8E24AA", "#00C853", "#FF1744", "#F50057", "#FF6D00", 
    "#009688", "#607D8B", "#795548", "#3F51B5"
  ]);

  const kategoriaValaszt = async (kategoriaId, kategoriaNev) => {
    if (kategoriaNev === "Vegyes") kategoriaValasztVegyes(kategoriaId);
    else if (kategoriaNev === "Géniusz") kategoriaValasztNehez(kategoriaId);
    else if (kategoriaNev === "Speedrun") kategoriaValasztSpeedrun(kategoriaId);
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
  const kategoriaValasztVegyes = async (kategoriaId) => {
    setKategoria(kategoriaId);
    const konnyu = await KerdesekLetolteseVegyes("/kerdesekKonnyuVegyes");
    const kozepes = await KerdesekLetolteseVegyes("/kerdesekKozepesVegyes");
    const nehez = await KerdesekLetolteseVegyes("/kerdesekNehezVegyes");
    setKerdesek([...konnyu, ...kozepes, ...nehez]);
    setKerdesekBetoltve(true);
  };

  const kategoriaValasztNehez = async (kategoriaId) => {
    setKategoria(kategoriaId);
    try {
      const response = await fetch(Cim.Cim + `/nehezVegyes`, { method: "GET" });
      const data = await response.json();
      if (response.ok) { 
        setKerdesek(data); 
        setKerdesekBetoltve(true); 
      }
    } catch (error) { console.log('KategoriaValasztNehez Error:', error); }
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
      Alert.alert("Hardcore Mód", "Hardcore módban nem lehet gyakorolni!");
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
      if (response.ok) { setAdatok(data); }
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
    <SafeAreaView style={styles.container}>
      {!kerdesekBetoltve ? (
        <>
          <View style={styles.hardcoreContainer}>
            <Text style={styles.hardcoreText}>🔥 Hardcore Mód</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#FF6347" }}
              thumbColor={isHardcore ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setIsHardcore(previousState => !previousState)}
              value={isHardcore}
            />
          </View>
        <View style={styles.mainContent}>
          <Text style={styles.headerTitle}>Válassz kategóriát!</Text>
          
          <FlatList
            data={adatok}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[styles.card, {marginBottom: 15}]}
                onPress={() => kategoriaValaszt(item.kategoria_id, item.kategoria_nev)}
              >
                <View style={[styles.iconContainer, { backgroundColor: szinek[index % szinek.length] }]}>
                  <Text style={{fontSize: 24}}>{ikonok[index] || "❓"}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.cardText} numberOfLines={1} adjustsFontSizeToFit>
                        {item.kategoria_nev}
                    </Text>
                </View>
              </TouchableOpacity>
            )}
            
            ListFooterComponent={
              <>
                <View style={styles.separator} />
                <Text style={styles.headerTitle}>Speciális módok (vegyes játék mód)</Text>
                <View style={{gap: 15}}>
                  <TouchableOpacity
                    style={[styles.card, {backgroundColor: '#673AB7'}]}
                    onPress={() => kategoriaValaszt(0, 'Speedrun')}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: '#7E57C2' }]}>
                      <Text style={{fontSize: 24}}>⏱️</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.cardText, {color: 'white'}]} numberOfLines={1} adjustsFontSizeToFit>
                            Speedrun
                        </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.card, {backgroundColor: '#E91E63'}]}
                    onPress={() => kategoriaValaszt(-1, 'Endless')}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: '#F06292' }]}>
                      <Text style={{fontSize: 24}}>♾️</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.cardText, {color: 'white'}]} numberOfLines={1} adjustsFontSizeToFit>
                            Endless Run
                        </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.card, {backgroundColor: '#4CAF50'}]}
                    onPress={() => kategoriaValaszt(-2, 'Gyakorlas')}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: '#81C784' }]}>
                      <Text style={{fontSize: 24}}>🎓</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.cardText, {color: 'white'}]} numberOfLines={1} adjustsFontSizeToFit>
                            Gyakorlás
                        </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            }
          />
        </View>
        </>
      ) : (
        <Kerdesek kerdesek={kerdesek} kategoria={kategoria} kerdesekBetoltve={setKerdesekBetoltve} navigateToProfile={navigateToProfile} isGyakorlas={isGyakorlas} isHardcore={isHardcore}/>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 600, 
    alignSelf: 'center',
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2962FF",
    textAlign: "center",
    marginVertical: 30,
  },
  listContainer: {
    paddingBottom: 20,
    gap: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 5,
    minHeight: 80,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  hardcoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hardcoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 18,
  },
});

export default Kategoria;