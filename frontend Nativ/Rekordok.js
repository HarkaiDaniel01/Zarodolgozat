import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import Cim from './Cim';

const Rekordok = () => {
  const [rekordok, setRekordok] = useState([]);
  const [tolt, setTolt] = useState(true);
  const [hiba, setHiba] = useState(null);
  const [frissites, setFrissites] = useState(false);

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
        <ActivityIndicator size="large" color="#2962FF" />
        <Text>Ranglista betöltése...</Text>
      </View>
    );
  }

  if (hiba) {
    return (
      <View style={styles.center}>
        <Text style={styles.hibaText}>Hiba történt: {hiba}</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }) => (
    <View style={styles.rekordSor}>
      <Text style={[styles.helyezes, index < 3 && styles.topHelyezes]}>{index + 1}.</Text>
      <Text style={styles.nev}>{item.jatekos_nev}</Text>
      <Text style={styles.pont}>{item.eredmeny.toLocaleString('hu-HU')} Ft</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.cim}>🏆 Ranglista 🏆</Text>
      <FlatList
        data={rekordok}
        renderItem={renderItem}
        keyExtractor={(item) => item.jatekos_id.toString()}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={frissites} onRefresh={onRefresh} colors={["#2962FF"]} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  cim: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  lista: {
    paddingHorizontal: 15,
  },
  rekordSor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  helyezes: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    width: 40,
  },
  topHelyezes: {
    color: '#FFD700',
    fontSize: 20,
  },
  nev: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 10,
  },
  pont: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2962FF',
  },
  hibaText: {
    fontSize: 16,
    color: 'red',
  },
});

export default Rekordok;

