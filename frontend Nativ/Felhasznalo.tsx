import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Modal, StatusBar, Platform, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cim from './Cim';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FelhasznaloProps {
  onLogout: () => void;
  onNavigateToWinnings: () => void;
}

interface UserData {
  id: string;
  nev: string;
  osszesNyeremeny: number;
  jatszottJatekok: number;
}

interface EredmenyItem {
  [key: string]: any;
}

const Felhasznalo: React.FC<FelhasznaloProps> = ({ onLogout, onNavigateToWinnings }) => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [eredmenyek, setEredmenyek] = useState<EredmenyItem[]>([]);
  const [refresh, setRefresh] = useState<number>(0);
  
  // Jelszó változtatás state-ek
  const [passwordModalVisible, setPasswordModalVisible] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  
  // Fiók törlés state-ek
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deletePassword, setDeletePassword] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Általános alert Modal state-ek
  const [alertModalVisible, setAlertModalVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error' | 'warning'>('info');

  // Kijelentkezés megerősítés Modal
  const [logoutConfirmModalVisible, setLogoutConfirmModalVisible] = useState<boolean>(false);

  // Level logic
  const calculateLevelInfo = (totalGames: number | undefined) => {
    if (!totalGames) return { level: 0, currentXp: 0, maxXp: 100 };
    
    let lvl = 0;
    let gamesNeeded = 10;
    let gamesLeft = totalGames;
    
    while (gamesLeft >= gamesNeeded) {
      gamesLeft -= gamesNeeded;
      lvl++;
      gamesNeeded += 2; 
    }
    
    return {
      level: lvl,
      currentXp: gamesLeft * 10,
      maxXp: gamesNeeded * 10
    };
  };

  const { level, currentXp, maxXp } = calculateLevelInfo(userData?.jatszottJatekok);

  const getRankName = (lvl: number): string => {
    if (lvl >= 30) return 'Szuperhős 🦸‍♂️';
    if (lvl >= 25) return 'Legenda 👑';
    if (lvl >= 20) return 'Mester 🎓';
    if (lvl >= 15) return 'Profi 🏆';
    if (lvl >= 10) return 'Haladó ⭐';
    if (lvl >= 5) return 'Amatőr 🌿';
    if (lvl >= 2) return 'Kezdő 🌱';
    return 'Friss kezdő 🐣';
  };

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
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
        let eredmenyekLista: EredmenyItem[] = [];

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

  const handleLogout = async (): Promise<void> => {
    setLogoutConfirmModalVisible(true);
  };

  const handleChangePassword = async (): Promise<void> => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setAlertTitle('Hiba');
      setAlertMessage('Kérlek tölts ki minden mezőt!');
      setAlertType('error');
      setAlertModalVisible(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertTitle('Hiba');
      setAlertMessage('Az új jelszavak nem egyeznek!');
      setAlertType('error');
      setAlertModalVisible(true);
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
        setAlertTitle('Siker');
        setAlertMessage('Jelszó sikeresen megváltoztatva!');
        setAlertType('success');
        setAlertModalVisible(true);
        setPasswordModalVisible(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const errorData = await response.json();
        setAlertTitle('Hiba');
        setAlertMessage(errorData.error || 'Hiba történt a jelszó változtatás során.');
        setAlertType('error');
        setAlertModalVisible(true);
      }
    } catch (error) {
      console.log(error);
      setAlertTitle('Hiba');
      setAlertMessage('Hálózati hiba történt.');
      setAlertType('error');
      setAlertModalVisible(true);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async (): Promise<void> => {
     if (!deletePassword) {
      setAlertTitle('Hiba');
      setAlertMessage('Kérlek add meg a jelszavad a törléshez!');
      setAlertType('error');
      setAlertModalVisible(true);
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch(`${Cim.Cim}/Admin/sajat-fiok-torles/${encodeURIComponent(userData?.nev || '')}`, {
        method: 'DELETE',
         headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jelszo: deletePassword
        })
      });

      if (response.ok) {
        setAlertTitle('Siker');
        setAlertMessage('Fiók sikeresen törölve.');
        setAlertType('success');
        setAlertModalVisible(true);
        setDeleteModalVisible(false);
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userid');
        if (onLogout) onLogout();
      } else {
         const errorData = await response.json();
        setAlertTitle('Hiba');
        setAlertMessage(errorData.error || 'Hiba történt a törlés során.');
        setAlertType('error');
        setAlertModalVisible(true);
      }
    } catch (error) {
       console.log(error);
       setAlertTitle('Hiba');
       setAlertMessage('Hálózati hiba történt.');
       setAlertType('error');
       setAlertModalVisible(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 100 : insets.bottom + 80 }}
      >
        <SafeAreaView edges={['top']} style={styles.headerArea}>
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Profil</Text>
                <TouchableOpacity style={styles.settingsButton} onPress={() => setPasswordModalVisible(true)}>
                    <MaterialCommunityIcons name="cog-outline" size={18} color="#666" />
                    <Text style={styles.settingsText}>Jelszó változtatás</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfoContainer}>
                <Text style={styles.userName}>{userData?.nev || 'Betöltés...'}</Text>
                <View style={styles.titleBadge}>
                    <MaterialCommunityIcons name="medal-outline" size={14} color="#8E24AA" />
                    <Text style={styles.titleText}>{userData?.nev === 'Admin' ? 'Adminisztrátor' : 'Felhasználó'}</Text>
                </View>
            </View>
        </SafeAreaView>

        <View style={styles.contentContainer}>
          
          {/* Stats Row */}
          <View style={styles.totalXpCard}>
              <View style={styles.xpIconContainer}>
                  <MaterialCommunityIcons name="lightning-bolt" size={24} color="#FF9800" />
              </View>
              <View style={styles.xpTextContainer}>
                  <Text style={styles.xpLabel}>Total XP</Text>
                  <Text style={styles.xpValue}>{currentXp.toLocaleString()}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
          </View>

          <View style={styles.statsRow}>
              <View style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#F3E5F5' }]}>
                      <MaterialCommunityIcons name="trophy-outline" size={24} color="#8E24AA" />
                  </View>
                  <Text style={styles.statLabel}>Összes nyeremény</Text>
                  <Text style={styles.statValue}>{userData?.osszesNyeremeny?.toLocaleString('hu-HU')} Ft</Text>
              </View>
              
              <View style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
                      <MaterialCommunityIcons name="gamepad-variant-outline" size={24} color="#2196F3" />
                  </View>
                  <Text style={styles.statLabel}>Játszott játékok</Text>
                  <Text style={styles.statValue}>{userData?.jatszottJatekok}</Text>
              </View>
          </View>

          <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.actionIconButton} onPress={onNavigateToWinnings}>
                  <MaterialCommunityIcons name="history" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIconButton} onPress={() => setDeleteModalVisible(true)}>
                  <MaterialCommunityIcons name="delete-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionIconButton, styles.primaryActionButton]} onPress={handleLogout}>
                  <MaterialCommunityIcons name="logout" size={28} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionIconButton}>
                  <MaterialCommunityIcons name="download" size={24} color="#fff" />
              </TouchableOpacity>
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

      {/* Kijelentkezés megerősítés Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutConfirmModalVisible}
        onRequestClose={() => setLogoutConfirmModalVisible(false)}
      >
        <View style={styles.alertModalOverlay}>
          <View style={styles.alertModal}>
            <MaterialCommunityIcons name="logout" size={60} color="#FF9800" />
            <Text style={[styles.alertTitle, { color: '#FF9800' }]}>Kijelentkezés</Text>
            <Text style={styles.alertMessage}>Biztosan ki szeretnél jelentkezni?</Text>
            <View style={styles.alertButtonContainer}>
              <TouchableOpacity 
                style={[styles.alertButton, styles.cancelButton]}
                onPress={() => setLogoutConfirmModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Mégse</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.alertButton, styles.confirmButton]}
                onPress={async () => {
                  setLogoutConfirmModalVisible(false);
                  await AsyncStorage.removeItem('token');
                  await AsyncStorage.removeItem('userid');
                  if (onLogout) onLogout();
                }}
              >
                <Text style={styles.confirmButtonText}>Kijelentkezés</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Általános Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertModalVisible}
        onRequestClose={() => setAlertModalVisible(false)}
      >
        <View style={styles.alertModalOverlay}>
          <View style={styles.alertModal}>
            {alertType === 'error' && (
              <MaterialCommunityIcons name="alert-circle" size={60} color="#F44336" />
            )}
            {alertType === 'success' && (
              <MaterialCommunityIcons name="check-circle" size={60} color="#4CAF50" />
            )}
            {alertType === 'warning' && (
              <MaterialCommunityIcons name="alert" size={60} color="#FF9800" />
            )}
            {alertType === 'info' && (
              <MaterialCommunityIcons name="information" size={60} color="#2196F3" />
            )}
            <Text style={[styles.alertTitle, { 
              color: alertType === 'error' ? '#F44336' : alertType === 'success' ? '#4CAF50' : alertType === 'warning' ? '#FF9800' : '#2196F3'
            }]}>{alertTitle}</Text>
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <TouchableOpacity 
              style={[styles.alertButton, { 
                backgroundColor: alertType === 'error' ? '#F44336' : alertType === 'success' ? '#4CAF50' : alertType === 'warning' ? '#FF9800' : '#2196F3'
              }]}
              onPress={() => setAlertModalVisible(false)}
            >
              <Text style={styles.alertButtonText}>Rendben</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FAFAFA',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  iconButton: {
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
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingsText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  profileInfoContainer: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E1BEE7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginBottom: 15,
  },
  titleText: {
    color: '#8E24AA',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  bioText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  totalXpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  xpIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  xpTextContainer: {
    flex: 1,
  },
  xpLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  xpValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    flex: 1, 
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 30,
    padding: 10,
    marginBottom: 25,
  },
  actionIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8E24AA',
    marginTop: -20,
    elevation: 4,
    shadowColor: '#8E24AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  achievementsContainer: {
    gap: 15,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementTextContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#666',
  },
  achievementProgress: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginLeft: 10,
  },
  achievementProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
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
    backgroundColor: '#8E24AA',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  alertModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertModal: {
    width: '85%',
    maxWidth: 300,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 15,
    lineHeight: 20,
  },
  alertButtonContainer: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
    width: '100%',
  },
  alertButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  confirmButton: {
    backgroundColor: '#8E24AA',
  },
  cancelButtonText: {
    fontWeight: 'bold',
    color: '#555',
  },
  confirmButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  alertButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  }
});

export default Felhasznalo;
