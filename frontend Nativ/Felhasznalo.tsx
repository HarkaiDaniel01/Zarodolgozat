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
  const isTablet = width >= 600; // Adjusted for tablet breakpoint
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [eredmenyek, setEredmenyek] = useState<EredmenyItem[]>([]);
  const [refresh, setRefresh] = useState<number>(0);
  
  // JelszÃ³ vÃ¡ltoztatÃ¡s state-ek
  const [passwordModalVisible, setPasswordModalVisible] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  
  // FiÃ³k tÃ¶rlÃ©s state-ek
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deletePassword, setDeletePassword] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // ÃltalÃ¡nos alert Modal state-ek
  const [alertModalVisible, setAlertModalVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error' | 'warning'>('info');

  // KijelentkezÃ©s megerÅ‘sÃ­tÃ©s Modal
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
    if (lvl >= 30) return 'Szuperhős 🦸';
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
      <StatusBar barStyle="light-content" backgroundColor="#8E24AA" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 100 : insets.bottom + 80 }}
      >
        {/* Purple gradient header */}
        <LinearGradient colors={['#6C5CE7', '#5A4BD1', '#4A148C']} style={styles.headerGradient}>
          <SafeAreaView edges={['top']} style={[styles.headerArea, isTablet && { maxWidth: 700, alignSelf: 'center', width: '100%' }]}>
            <View style={styles.headerTopRow}>
              <Text style={styles.headerTitle}>Profil</Text>
              <TouchableOpacity style={styles.settingsButton} onPress={() => setPasswordModalVisible(true)}>
                <MaterialCommunityIcons name="cog-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Avatar + name */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>
                  {(userData?.nev || '?')[0].toUpperCase()}
                </Text>
              </View>
              <Text style={styles.userName}>{userData?.nev || 'Betöltés...'}</Text>
              <View style={styles.rankBadge}>
                <MaterialCommunityIcons name="medal" size={13} color="#FFD700" />
                <Text style={styles.rankText}>{getRankName(level)}</Text>
              </View>
            </View>

            {/* XP bar inside header */}
            <View style={styles.xpBarContainer}>
              <View style={styles.xpBarRow}>
                <Text style={styles.xpLabel}>Szint {level}</Text>
                <Text style={styles.xpLabel}>{currentXp} / {maxXp} XP</Text>
              </View>
              <View style={styles.xpTrack}>
                <View style={[styles.xpFill, { width: `${Math.min(100, (currentXp / maxXp) * 100)}%` as any }]} />
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={[styles.contentContainer, isTablet && { maxWidth: 700, alignSelf: 'center', width: '100%' }]}>

          {/* Stat cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: '#F3E5F5' }]}>
                <MaterialCommunityIcons name="trophy-outline" size={22} color="#8E24AA" />
              </View>
              <Text style={styles.statValue}>{userData?.osszesNyeremeny?.toLocaleString('hu-HU')}</Text>
              <Text style={styles.statLabel}>Összes Nyeremény</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: '#E3F2FD' }]}>
                <MaterialCommunityIcons name="gamepad-variant-outline" size={22} color="#2196F3" />
              </View>
              <Text style={styles.statValue}>{userData?.jatszottJatekok ?? 0}</Text>
              <Text style={styles.statLabel}>Játszott Játékok</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: '#FFF3E0' }]}>
                <MaterialCommunityIcons name="star-outline" size={22} color="#FF9800" />
              </View>
              <Text style={styles.statValue}>{level}</Text>
              <Text style={styles.statLabel}>szint</Text>
            </View>
          </View>

          {/* Action buttons row */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={onNavigateToWinnings}>
              <View style={[styles.actionBtnIcon, { backgroundColor: '#E8EAF6' }]}>
                <MaterialCommunityIcons name="history" size={22} color="#3F51B5" />
              </View>
              <Text style={[styles.actionBtnLabel, { color: '#3F51B5' }]}>Játék előmények</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleLogout}>
              <View style={[styles.actionBtnIcon, { backgroundColor: '#FFF3E0' }]}>
                <MaterialCommunityIcons name="logout" size={22} color="#FF9800" />
              </View>
              <Text style={[styles.actionBtnLabel, { color: '#FF9800' }]}>Kilépés</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={() => setDeleteModalVisible(true)}>
              <View style={[styles.actionBtnIcon, { backgroundColor: '#FFEBEE' }]}>
                <MaterialCommunityIcons name="delete-outline" size={22} color="#F44336" />
              </View>
              <Text style={[styles.actionBtnLabel, { color: '#F44336' }]}>Fioók Törlése</Text>
            </TouchableOpacity>
          </View>

          {/* Recent games */}
          <Text style={styles.sectionTitle}>Legutóbbi 5 játék</Text>
          {eredmenyek.length === 0 ? (
            <View style={styles.emptyGames}>
              <MaterialCommunityIcons name="gamepad-variant-outline" size={48} color="#E1BEE7" />
              <Text style={styles.emptyGamesText}>Még nincs játszott játékod.</Text>
            </View>
          ) : (
            eredmenyek.slice(0, 5).map((item, index) => {
              const colors = ['#8E24AA', '#3F51B5', '#00838F', '#E65100', '#2E7D32'];
              const col = colors[index % colors.length];
              const bgs = ['#F3E5F5', '#E8EAF6', '#E0F7FA', '#FFF3E0', '#E8F5E9'];
              const bg = bgs[index % bgs.length];
              return (
                <View key={index} style={[styles.gameCard, { borderLeftColor: col }]}>
                  <View style={[styles.gameIconWrap, { backgroundColor: bg }]}>
                    <MaterialCommunityIcons name="trophy-variant-outline" size={20} color={col} />
                  </View>
                  <View style={styles.gameInfo}>
                    <Text style={styles.gamePont}>{item.kategoria_nev || 'Ismeretlen kategória'}</Text>
                    <Text style={styles.gameDate}>
                      {item.Eredmenyek_datum ? item.Eredmenyek_datum.split('T')[0] : 'Ismeretlen dátum'}
                    </Text>
                  </View>
                  <View style={[styles.gameBadge, { backgroundColor: bg }]}>
                    <Text style={[styles.gameBadgeText, { color: col }]}>{item.Eredmenyek_pont ?? 0}</Text>
                    <Text style={[styles.gameBadgeUnit, { color: col }]}>pont</Text>
                  </View>
                </View>
              );
            })
          )}

        </View>
      </ScrollView>

      {/* JelszÃ³ vÃ¡ltoztatÃ¡s Modal */}
      <Modal animationType="fade" transparent visible={passwordModalVisible} onRequestClose={() => setPasswordModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons name="lock-reset" size={40} color="#8E24AA" />
            <Text style={styles.modalTitle}>Jelszó Változtatás</Text>
            <TextInput style={styles.modalInput} placeholder="Jelenlegi jelszó" placeholderTextColor="#999" secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />
            <TextInput style={styles.modalInput} placeholder="Új Jelszó" placeholderTextColor="#999" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
            <TextInput style={styles.modalInput} placeholder="Új Jelszó megerősitése" placeholderTextColor="#999" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => { setPasswordModalVisible(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}>
                <Text style={styles.modalCancelText}>Mégse</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={handleChangePassword} disabled={passwordLoading}>
                {passwordLoading ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.modalButtonText}>Mentés</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Fiók törlés Modal */}
      <Modal animationType="fade" transparent visible={deleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons name="delete-alert" size={40} color="#F44336" />
            <Text style={styles.modalTitle}>Fiók törlése</Text>
            <Text style={styles.modalWarning}>⚠️ Figyelem! A fiók törlése végleges és visszavonhatatlan. Minden adatod törlődik!</Text>
            <TextInput style={styles.modalInput} placeholder="Add meg a jelszavad" placeholderTextColor="#999" secureTextEntry value={deletePassword} onChangeText={setDeletePassword} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => { setDeleteModalVisible(false); setDeletePassword(''); }}>
                <Text style={styles.modalCancelText}>Mégse</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalConfirmButton, { backgroundColor: '#F44336' }]} onPress={handleDeleteAccount} disabled={deleteLoading}>
                {deleteLoading ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.modalButtonText}>Törlés</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Kijelentkezés megerősítés Modal */}
      <Modal animationType="fade" transparent visible={logoutConfirmModalVisible} onRequestClose={() => setLogoutConfirmModalVisible(false)}>
        <View style={styles.alertModalOverlay}>
          <View style={styles.alertModal}>
            <MaterialCommunityIcons name="logout" size={60} color="#FF9800" />
            <Text style={[styles.alertTitle, { color: '#FF9800' }]}>Kijelentkezés</Text>
            <Text style={styles.alertMessage}>Biztosan ki szeretnél jelentkezni?</Text>
            <View style={styles.alertButtonContainer}>
              <TouchableOpacity style={[styles.alertButton, styles.cancelButton]} onPress={() => setLogoutConfirmModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Mégse</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.alertButton, styles.confirmButton]} onPress={async () => { setLogoutConfirmModalVisible(false); await AsyncStorage.removeItem('token'); await AsyncStorage.removeItem('userid'); if (onLogout) onLogout(); }}>
                <Text style={styles.confirmButtonText}>Kilépés</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Általános Alert Modal */}
      <Modal animationType="fade" transparent visible={alertModalVisible} onRequestClose={() => setAlertModalVisible(false)}>
        <View style={styles.alertModalOverlay}>
          <View style={styles.alertModal}>
            {alertType === 'error' && <MaterialCommunityIcons name="alert-circle" size={60} color="#F44336" />}
            {alertType === 'success' && <MaterialCommunityIcons name="check-circle" size={60} color="#4CAF50" />}
            {alertType === 'warning' && <MaterialCommunityIcons name="alert" size={60} color="#FF9800" />}
            {alertType === 'info' && <MaterialCommunityIcons name="information" size={60} color="#2196F3" />}
            <Text style={[styles.alertTitle, { color: alertType === 'error' ? '#F44336' : alertType === 'success' ? '#4CAF50' : alertType === 'warning' ? '#FF9800' : '#2196F3' }]}>{alertTitle}</Text>
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <TouchableOpacity style={[styles.alertButton, { backgroundColor: alertType === 'error' ? '#F44336' : alertType === 'success' ? '#4CAF50' : alertType === 'warning' ? '#FF9800' : '#2196F3' }]} onPress={() => setAlertModalVisible(false)}>
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
    backgroundColor: '#F4F6FB',
  },
  headerGradient: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    ...Platform.select({
      default: {
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 12,
      }
    })
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarInitial: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  rankText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  xpBarContainer: {
    marginTop: 4,
  },
  xpBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  xpTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 2px 12px rgba(108,92,231,0.08)' },
      default: {
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }
    })
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 2px 12px rgba(108,92,231,0.08)' },
      default: {
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }
    })
  },
  actionBtnIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionBtnLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  emptyGames: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyGamesText: {
    marginTop: 10,
    fontSize: 14,
    color: '#bbb',
  },
  gameCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    ...Platform.select({
      web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 5,
        elevation: 2,
      }
    })
  },
  gameIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gameInfo: {
    flex: 1,
  },
  gamePont: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginBottom: 3,
  },
  gameDate: {
    fontSize: 12,
    color: '#999',
  },
  gameBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    minWidth: 54,
  },
  gameBadgeText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  gameBadgeUnit: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 22,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
    color: '#333',
  },
  modalWarning: {
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 13,
    lineHeight: 18,
  },
  modalInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 10,
    color: '#333',
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    padding: 13,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontWeight: 'bold',
    color: '#555',
  },
  modalConfirmButton: {
    flex: 1,
    padding: 13,
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
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
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 26,
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
    marginVertical: 10,
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
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  confirmButton: {
    backgroundColor: '#6C5CE7',
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
  },
  // legacy stubs (unused but kept to avoid import errors)
  iconButton: { width: 0, height: 0 },
  profileInfoContainer: { alignItems: 'center' },
  avatarWrapper: {},
  avatarContainer: { width: 0, height: 0 },
  onlineIndicator: {},
  titleBadge: {},
  titleText: {},
  bioText: {},
  totalXpCard: {},
  xpIconContainer: {},
  xpTextContainer: {},
  xpValue: {},
  headerRow: {},
  settingsText: {},
  achievementsContainer: {},
  achievementItem: {},
  achievementIcon: {},
  achievementTextContainer: {},
  achievementTitle: {},
  achievementDesc: {},
  achievementProgress: {},
  achievementProgressFill: {},
  actionButtonsContainer: {},
  actionIconButton: {},
  primaryActionButton: {},
});

export default Felhasznalo;