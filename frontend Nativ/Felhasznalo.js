import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Cim from './Cim';

const Felhasznalo = ({ onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [eredmenyek, setEredmenyek] = useState([]);
  const [refresh, setRefresh] = useState(0);
  
  // Jelszó változtatás state-ek
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Fiók törlés state-ek
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userid');
        
        if (!token || !userId) {
          if (onLogout) onLogout();
          return;
        }

        const jatekosResponse = await fetch(`${Cim.Cim}/jatekos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jatekosId: userId }),
        });

        const osszesNyeremenyResponse = await fetch(`${Cim.Cim}/osszesNyeremeny`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jatekosId: userId }),
        });

        const eredmenyekResponse = await fetch(`${Cim.Cim}/eredmenyek`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jatekosId: userId }),
        });

        let jatekosNev = 'Ismeretlen';
        let osszesNyeremeny = 0;
        let jatszottJatekok = 0;
        let eredmenyekLista = [];

        if (jatekosResponse.ok) {
          const jatekosData = await jatekosResponse.json();
          console.log('Jatekos adat:', jatekosData);
          if (jatekosData && jatekosData.length > 0) {
            jatekosNev = jatekosData[0].jatekos_nev;
          }
        }

        if (osszesNyeremenyResponse.ok) {
          const nyeremenyData = await osszesNyeremenyResponse.json();
          console.log('Nyeremeny adat:', nyeremenyData);
          if (nyeremenyData && nyeremenyData.length > 0) {
            osszesNyeremeny = nyeremenyData[0].ossz || 0;
          }
        }

        if (eredmenyekResponse.ok) {
          eredmenyekLista = await eredmenyekResponse.json();
          console.log('Eredmenyek adat:', eredmenyekLista);
          jatszottJatekok = eredmenyekLista.length;
        } else {
          console.log('Eredmenyek response hiba:', eredmenyekResponse.status);
        }

        setUserData({
          id: userId,
          nev: jatekosNev,
          osszesNyeremeny: osszesNyeremeny,
          jatszottJatekok: jatszottJatekok,
        });
        setEredmenyek(eredmenyekLista);
      } catch (error) {
        console.log('Felhasznalo Fetch Error:', error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [refresh]);

  const handleLogout = async () => {
   Alert.alert(
      'Kijelentkezés',
      'Biztosan ki szeretnél jelentkezni?',
      [
        { text: 'Mégse', style: 'cancel' },
        {
          text: 'Kijelentkezés',
          onPress: async () => {
            try {
              console.log(`Kijelentkezett felhasználó:${userData?.nev}`);
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('userid');
              await AsyncStorage.removeItem('role');
              
              if (onLogout) onLogout();
            } catch (error) {
              console.error("Logout error", error);
            }
          }
        }
      ]
    );
  };

  const formatDatum = (datum) => {
    if (!datum) return { datum: '', ido: '' };
    const date = new Date(datum);
    const datumStr = date.toLocaleDateString('hu-HU');
    const idoStr = date.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
    return { datum: datumStr, ido: idoStr };
  };

  const formatPontszam = (pont) => {
    if (pont >= 1000000) {
      return (pont / 1000000).toFixed(1).replace('.0', '') + 'M';
    }
    if (pont >= 1000) {
      return (pont / 1000).toFixed(0) + 'k';
    }
    return pont;
  };

  const eredmenyTorles = async (eredmenyId) => {
    try {
      const response = await fetch(`${Cim.Cim}/eredmenyTorles/${eredmenyId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        setRefresh(prev => prev + 1);
      } else {
        console.log('Eredmény törlés hiba:', response.status);
      }
    } catch (error) {
      console.log('Eredmény törlés error:', error);
    }
  };

  // Jelszó változtatás funkció
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Hiba', 'Minden mezőt ki kell tölteni!');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Hiba', 'Az új jelszavak nem egyeznek!');
      return;
    }
    
    if (newPassword.length < 6) {
      Alert.alert('Hiba', 'Az új jelszónak legalább 6 karakter hosszúnak kell lennie!');
      return;
    }
    
    setPasswordLoading(true);
    try {
      const response = await fetch(`${Cim.Cim}/Admin/jelszo-modositas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jatekos_nev: userData?.nev,
          regi_jelszo: currentPassword,
          uj_jelszo: newPassword
        }),
      });
      
      if (response.ok) {
        Alert.alert('Siker', 'Jelszó sikeresen megváltoztatva!');
        setPasswordModalVisible(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const errorData = await response.json();
        Alert.alert('Hiba', errorData.message || 'Hibás jelenlegi jelszó!');
      }
    } catch (error) {
      console.log('Jelszó változtatás error:', error);
      Alert.alert('Hiba', 'Hálózati hiba történt!');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Fiók törlés funkció
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      Alert.alert('Hiba', 'Add meg a jelszavad a törléshez!');
      return;
    }
    
    Alert.alert(
      'Fiók törlése',
      'Biztosan törölni szeretnéd a fiókodat? Ez a művelet nem visszavonható!',
      [
        { text: 'Mégse', style: 'cancel' },
        {
          text: 'Törlés',
          style: 'destructive',
          onPress: async () => {
            setDeleteLoading(true);
            try {
              const userId = await AsyncStorage.getItem('userid');
              
              // Először töröljük az összes eredményt
              for (const eredmeny of eredmenyek) {
                await fetch(`${Cim.Cim}/eredmenyTorles/${eredmeny.Eredmenyek_id}`, {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                });
              }
              
              // Majd töröljük a fiókot
              const response = await fetch(`${Cim.Cim}/Admin/sajat-fiok-torles/${encodeURIComponent(userData?.nev)}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
              });
              
              if (response.ok) {
                Alert.alert('Siker', 'Fiók sikeresen törölve!');
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('userid');
                await AsyncStorage.removeItem('role');
                if (onLogout) onLogout();
              } else {
                const errorData = await response.json();
                Alert.alert('Hiba', errorData.message || 'Hibás jelszó!');
              }
            } catch (error) {
              console.log('Fiók törlés error:', error);
              Alert.alert('Hiba', 'Hálózati hiba történt!');
            } finally {
              setDeleteLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fiók Statisztika</Text>
      
      {/* Profil Beállítások szekció */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Profil Beállítások</Text>
        
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={() => setPasswordModalVisible(true)}
        >
          <Text style={styles.settingsButtonText}>🔐 Jelszó változtatás</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.settingsButton, styles.deleteAccountButton]} 
          onPress={() => setDeleteModalVisible(true)}
        >
          <Text style={styles.deleteAccountText}>🗑️ Fiók törlése</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Kijelentkezés</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.label}>Felhasználónév:</Text>
        <Text style={styles.value}>{userData?.nev}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Összes nyeremény:</Text>
        <Text style={styles.value}>{userData?.osszesNyeremeny?.toLocaleString('hu-HU')} Ft</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Játszott játékok száma:</Text>
        <Text style={styles.value}>{userData?.jatszottJatekok}</Text>
      </View>

      {eredmenyek.length > 0 && (
        <>
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Eredmények grafikonja</Text>
            <View style={styles.chartContainer}>
              {eredmenyek.slice(0, 10).reverse().map((item, index) => {
                const maxPont = Math.max(...eredmenyek.slice(0, 10).map(e => e.Eredmenyek_pont));
                const height = maxPont > 0 ? (item.Eredmenyek_pont / maxPont) * 150 : 0;
                return (
                  <View key={index} style={styles.barContainer}>
                    <View style={styles.barWrapper}>
                      <View style={[styles.bar, { height: Math.max(height, 5) }]}>
                        <Text style={styles.barValue}>{formatPontszam(item.Eredmenyek_pont)}</Text>
                      </View>
                    </View>
                    <Text style={styles.barLabel}>{index + 1}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={styles.chartNote}>Utolsó 10 játék</Text>
          </View>

          <View style={styles.eredmenyekSection}>
            <Text style={styles.sectionTitle}>Részletes eredmények</Text>
          {eredmenyek.map((item) => {
            const { datum, ido } = formatDatum(item.Eredmenyek_datum);
            return (
            <View key={item.Eredmenyek_id} style={styles.eredmenyCard}>
              <View style={styles.eredmenyTop}>
                <Text style={styles.kategoriaText}>{item.kategoria_nev}</Text>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => eredmenyTorles(item.Eredmenyek_id)}
                >
                  <Text style={styles.deleteText}>🗑️ Törlés</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.datumText}>{datum}</Text>
              <Text style={styles.idoText}>{ido}</Text>
              <Text style={styles.pontText}>{item.Eredmenyek_pont?.toLocaleString('hu-HU')} Ft</Text>
            </View>
            );
          })}
          </View>
        </>
      )}

      

      {/* Jelszó változtatás Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Jelszó változtatás</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Jelenlegi jelszó"
              placeholderTextColor="#999"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Új jelszó"
              placeholderTextColor="#999"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Új jelszó megerősítése"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => {
                  setPasswordModalVisible(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                <Text style={styles.modalCancelText}>Mégse</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={handlePasswordChange}
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.modalConfirmText}>Mentés</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Fiók törlés Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Fiók törlése</Text>
            <Text style={styles.modalWarning}>
              ⚠️ Figyelem! A fiók törlése végleges és visszavonhatatlan. Minden adatod törlődik!
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Add meg a jelszavad"
              placeholderTextColor="#999"
              secureTextEntry
              value={deletePassword}
              onChangeText={setDeletePassword}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setDeletePassword('');
                }}
              >
                <Text style={styles.modalCancelText}>Mégse</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalDeleteButton}
                onPress={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.modalConfirmText}>Törlés</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartSection: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
    paddingHorizontal: 5,
    marginVertical: 10,
  },
  chartNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  eredmenyekSection: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  barWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 160,
  },
  bar: {
    width: '90%',
    backgroundColor: '#2962FF',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 3,
  },
  barValue: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  eredmenyCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 15,
  },
  eredmenyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  kategoriaText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2962FF',
    flex: 1,
  },
  datumText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  idoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  pontText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#28a745',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  deleteText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ff9800',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Profil beállítások stílusok
  settingsSection: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    marginBottom: 20,
  },
  settingsButton: {
    backgroundColor: '#2962FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  settingsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteAccountButton: {
    backgroundColor: '#ff4444',
    marginBottom: 0,
  },
  deleteAccountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Modal stílusok
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalWarning: {
    fontSize: 14,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalCancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    marginRight: 10,
  },
  modalCancelText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalConfirmButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#2962FF',
    alignItems: 'center',
    marginLeft: 10,
  },
  modalConfirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalDeleteButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#ff4444',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default Felhasznalo;
