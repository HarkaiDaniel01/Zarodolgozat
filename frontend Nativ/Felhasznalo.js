import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Modal, Alert, StatusBar, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cim from './Cim';

const Felhasznalo = ({ onLogout, onNavigateToWinnings }) => {
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

  // Level logic (derived or state)
  const level = userData ? Math.floor(userData.jatszottJatekok / 10) + 1 : 1;
  const xp = userData ? (userData.jatszottJatekok % 10) * 10 : 0;

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

        // If user is deleted (404), logout immediately
        if (jatekosResponse.status === 404) {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userid');
          if (onLogout) onLogout();
          return;
        }

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
          if (jatekosData && jatekosData.length > 0) {
            jatekosNev = jatekosData[0].jatekos_nev;
          }
        }

        if (osszesNyeremenyResponse.ok) {
          const nyeremenyData = await osszesNyeremenyResponse.json();
          if (nyeremenyData && nyeremenyData.length > 0) {
            osszesNyeremeny = nyeremenyData[0].ossz || 0;
          }
        }

        if (eredmenyekResponse.ok) {
          eredmenyekLista = await eredmenyekResponse.json();
          jatszottJatekok = eredmenyekLista.length;
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
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userid');
            if (onLogout) onLogout();
          }
        }
      ]
    );
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Hiba', 'Kérlek tölts ki minden mezőt!');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hiba', 'Az új jelszavak nem egyeznek!');
      return;
    }

    setPasswordLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userid');
      
      const response = await fetch(`${Cim.Cim}/Admin/jelszo-modositas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
           id: userId,
           regiJelszo: currentPassword,
           ujJelszo: newPassword
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
        Alert.alert('Hiba', errorData.error || 'Hiba történt a jelszó változtatás során.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Hiba', 'Hálózati hiba történt.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
     if (!deletePassword) {
      Alert.alert('Hiba', 'Kérlek add meg a jelszavad a törléshez!');
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch(`${Cim.Cim}/Admin/sajat-fiok-torles/${encodeURIComponent(userData?.nev)}`, {
        method: 'DELETE', // Assuming DELETE, but sometimes POST
         headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jelszo: deletePassword
        })
      });

      if (response.ok) {
        Alert.alert('Siker', 'Fiók sikeresen törölve.');
        setDeleteModalVisible(false);
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userid');
        if (onLogout) onLogout();
      } else {
         const errorData = await response.json();
        Alert.alert('Hiba', errorData.error || 'Hiba történt a törlés során.');
      }
    } catch (error) {
       console.log(error);
       Alert.alert('Hiba', 'Hálózati hiba történt.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6200EA" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Gradient */}
        <LinearGradient
          colors={['#6200EA', '#AA00FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={['top']} style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="account" size={50} color="#6200EA" />
            </View>
            <Text style={styles.headerUserName}>{userData?.nev || 'Betöltés...'}</Text>
            <Text style={styles.headerUserLabel}>Játékos</Text>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.contentContainer}>
          
          {/* Stats Row */}
          <View style={styles.statsRow}>
              <TouchableOpacity style={styles.statCard} onPress={onNavigateToWinnings}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#E0F7FA' }]}>
                      <MaterialCommunityIcons name="wallet" size={24} color="#00BCD4" />
                  </View>
                  <Text style={styles.statLabel}>Összes nyeremény</Text>
                  <Text style={styles.statValue}>{userData?.osszesNyeremeny?.toLocaleString('hu-HU')} Ft</Text>
              </TouchableOpacity>
              
              <View style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
                      <MaterialCommunityIcons name="gamepad-variant" size={24} color="#448AFF" />
                  </View>
                  <Text style={styles.statLabel}>Játszott játékok</Text>
                  <Text style={styles.statValue}>{userData?.jatszottJatekok}</Text>
              </View>
          </View>

          <Text style={styles.sectionTitle}>Játék Előzmények</Text>
          <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#00BCD4'}]} onPress={onNavigateToWinnings}>
              <View style={styles.actionIcon}>
                  <MaterialCommunityIcons name="trophy-outline" size={22} color="#fff" />
              </View>
              <Text style={styles.actionText}>Nyeremények megtekintése</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Profil Beállítások</Text>

          <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#2979FF'}]} onPress={() => setPasswordModalVisible(true)}>
              <View style={styles.actionIcon}>
                  <MaterialCommunityIcons name="lock-reset" size={22} color="#fff" />
              </View>
              <Text style={styles.actionText}>Jelszó változtatás</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#F50057'}]} onPress={() => setDeleteModalVisible(true)}>
              <View style={styles.actionIcon}>
                  <MaterialCommunityIcons name="delete" size={22} color="#fff" />
              </View>
              <Text style={styles.actionText}>Fiók törlése</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#FF6D00'}]} onPress={handleLogout}>
              <View style={styles.actionIcon}>
                  <MaterialCommunityIcons name="logout" size={22} color="#fff" />
              </View>
              <Text style={styles.actionText}>Kijelentkezés</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Fejlődésed</Text>
          
          <View style={styles.levelCard}>
              <View style={[styles.iconContainer, {backgroundColor: '#EDE7F6', marginRight: 15}]}>
                  <MaterialCommunityIcons name="trending-up" size={28} color="#7E57C2" />
              </View>
              <View style={{flex: 1}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                      <Text style={styles.levelTitle}>{level >= 5 ? 'Profi' : 'Kezdő'}</Text>
                      <Text style={styles.xpText}>{xp} / 100 XP</Text>
                  </View>
                  <Text style={{color: '#666', marginBottom: 8}}>Szint {level}</Text>
                  <View style={styles.progressBarBackground}>
                      <View style={[styles.progressBarFill, {width: `${xp}%`}]} />
                  </View>
              </View>
          </View>

        </View>
      </ScrollView>

      {/* Jelszó változtatás Modal */}
      <Modal
        animationType="fade"
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
                onPress={handleChangePassword}
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.modalButtonText}>Mentés</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Fiók törlés Modal */}
      <Modal
        animationType="fade"
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
                style={[styles.modalConfirmButton, {backgroundColor: '#F44336'}]}
                onPress={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.modalButtonText}>Törlés</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    paddingBottom: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 15px rgba(98, 0, 234, 0.3)',
      },
      default: {
        shadowColor: "#6200EA",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
      }
    })
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    })
  },
  headerUserName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    ...Platform.select({
      web: {
        textShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
      },
      default: {
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      }
    })
  },
  headerUserLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  contentContainer: {
    padding: 20,
    marginTop: -40,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 16,
    padding: 15,
    alignItems: 'flex-start',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }
    })
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }
    })
  },
  actionIcon: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  levelCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }
    })
  },
  iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 15,
      justifyContent: 'center', 
      alignItems: 'center',
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  xpText: {
    fontSize: 14,
    color: '#2962FF',
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7E57C2',
    borderRadius: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  modalWarning: {
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    fontWeight: 'bold',
    color: '#555',
  },
  modalConfirmButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#2962FF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  }
});

export default Felhasznalo;
