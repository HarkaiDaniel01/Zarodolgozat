import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Modal, StatusBar, Platform, useWindowDimensions, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cim from './Cim';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './ThemeContext';
import { FONT_WEIGHTS, SPACING, BORDER_RADIUS, rf } from './theme';

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
  const isTablet = width >= 600;
  const insets = useSafeAreaInsets();
  const { isDark, colors, setIsDark } = useTheme();
  const styles = getStyles(colors, isDark, width);

  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [eredmenyek, setEredmenyek] = useState<EredmenyItem[]>([]);
  const [refresh, setRefresh] = useState<number>(0);
  
  const [passwordModalVisible, setPasswordModalVisible] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deletePassword, setDeletePassword] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [alertModalVisible, setAlertModalVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error' | 'warning'>('info');

  const [logoutConfirmModalVisible, setLogoutConfirmModalVisible] = useState<boolean>(false);

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
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.gradient_end} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 100 : insets.bottom + 80 }}
      >
        <LinearGradient colors={[colors.gradient_start, colors.gradient_mid, colors.gradient_end]} style={styles.headerGradient}>
          <SafeAreaView edges={['top']} style={[styles.headerArea, isTablet && { maxWidth: 700, alignSelf: 'center', width: '100%' }]}>
            <View style={styles.headerTopRow}>
              <Text style={styles.headerTitle}>Profil</Text>
              <TouchableOpacity style={styles.settingsButton} onPress={() => setPasswordModalVisible(true)}>
                <MaterialCommunityIcons name="cog-outline" size={20} color={colors.text_inverted} />
              </TouchableOpacity>
            </View>

            <View style={styles.avatarSection}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>
                  {(userData?.nev || '?')[0].toUpperCase()}
                </Text>
              </View>
              <Text style={styles.userName}>{userData?.nev || 'Betöltés...'}</Text>
              <View style={styles.rankBadge}>
                <MaterialCommunityIcons name="medal" size={13} color={colors.accent} />
                <Text style={styles.rankText}>{getRankName(level)}</Text>
              </View>
            </View>

            <View style={styles.xpBarContainer}>
              <View style={styles.xpBarRow}>
                <Text style={styles.xpLabel}>Szint {level}</Text>
                <Text style={styles.xpLabel}>{currentXp} / {maxXp} XP</Text>
              </View>
              <View style={styles.xpTrack}>
                <View style={[styles.xpFill, { width: `${Math.min(100, (currentXp / maxXp) * 100)}%` }]} />
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={[styles.contentContainer, isTablet && { maxWidth: 700, alignSelf: 'center', width: '100%' }]}>
          
          <View style={styles.themeSwitcherRow}>
            <Text style={styles.themeSwitcherText}>Sötét Mód</Text>
            <Switch
              trackColor={{ false: "#767577", true: colors.primary_light }}
              thumbColor={isDark ? colors.primary : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setIsDark}
              value={isDark}
            />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: `${colors.primary}30` }]}>
                <MaterialCommunityIcons name="trophy-outline" size={22} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{userData?.osszesNyeremeny?.toLocaleString('hu-HU')} Ft</Text>
              <Text style={styles.statLabel}>Összes Nyeremény</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: `${colors.secondary}30` }]}>
                <MaterialCommunityIcons name="gamepad-variant-outline" size={22} color={colors.secondary} />
              </View>
              <Text style={styles.statValue}>{userData?.jatszottJatekok ?? 0}</Text>
              <Text style={styles.statLabel}>Játszott Játékok</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: `${colors.accent}30` }]}>
                <MaterialCommunityIcons name="star-outline" size={22} color={colors.accent} />
              </View>
              <Text style={styles.statValue}>{level}</Text>
              <Text style={styles.statLabel}>szint</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={onNavigateToWinnings}>
              <View style={[styles.actionBtnIcon, { backgroundColor: `${colors.primary}30` }]}>
                <MaterialCommunityIcons name="history" size={22} color={colors.primary} />
              </View>
              <Text style={[styles.actionBtnLabel, { color: colors.primary }]}>Előzmények</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleLogout}>
              <View style={[styles.actionBtnIcon, { backgroundColor: `${colors.warning}30` }]}>
                <MaterialCommunityIcons name="logout" size={22} color={colors.warning} />
              </View>
              <Text style={[styles.actionBtnLabel, { color: colors.warning }]}>Kilépés</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={() => setDeleteModalVisible(true)}>
              <View style={[styles.actionBtnIcon, { backgroundColor: `${colors.error}30` }]}>
                <MaterialCommunityIcons name="delete-outline" size={22} color={colors.error} />
              </View>
              <Text style={[styles.actionBtnLabel, { color: colors.error }]}>Fiók Törlése</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Legutóbbi 5 játék</Text>
          {loading ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }}/> : eredmenyek.length === 0 ? (
            <View style={styles.emptyGames}>
              <MaterialCommunityIcons name="gamepad-variant-outline" size={48} color={colors.text_secondary} />
              <Text style={styles.emptyGamesText}>Még nincs játszott játékod.</Text>
            </View>
          ) : (
            eredmenyek.slice(0, 5).map((item, index) => {
              const colorsArray = [colors.primary, colors.secondary, '#00838F', colors.warning, '#2E7D32'];
              const col = colorsArray[index % colorsArray.length];
              return (
                <View key={index} style={[styles.gameCard, { borderLeftColor: col }]}>
                  <View style={[styles.gameIconWrap, { backgroundColor: `${col}30` }]}>
                    <MaterialCommunityIcons name="trophy-variant-outline" size={20} color={col} />
                  </View>
                  <View style={styles.gameInfo}>
                    <Text style={styles.gamePont}>{item.kategoria_nev || 'Ismeretlen kategória'}</Text>
                    <Text style={styles.gameDate}>
                      {item.Eredmenyek_datum ? item.Eredmenyek_datum.split('T')[0] : 'Ismeretlen dátum'}
                    </Text>
                  </View>
                  <View style={[styles.gameBadge, { backgroundColor: `${col}30` }]}>
                    <Text style={[styles.gameBadgeText, { color: col }]}>{item.Eredmenyek_pont ?? 0} Ft</Text>
                  </View>
                </View>
              );
            })
          )}

        </View>
      </ScrollView>

      {/* Jelszó változtatás Modal */}
      <Modal animationType="fade" transparent visible={passwordModalVisible} onRequestClose={() => setPasswordModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons name="lock-reset" size={40} color={colors.primary} />
            <Text style={styles.modalTitle}>Jelszó Változtatás</Text>
            <TextInput style={styles.modalInput} placeholder="Jelenlegi jelszó" placeholderTextColor={colors.text_secondary} secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />
            <TextInput style={styles.modalInput} placeholder="Új Jelszó" placeholderTextColor={colors.text_secondary} secureTextEntry value={newPassword} onChangeText={setNewPassword} />
            <TextInput style={styles.modalInput} placeholder="Új Jelszó megerősitése" placeholderTextColor={colors.text_secondary} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => { setPasswordModalVisible(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}>
                <Text style={styles.modalCancelText}>Mégse</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={handleChangePassword} disabled={passwordLoading}>
                {passwordLoading ? <ActivityIndicator color={colors.text_inverted} size="small" /> : <Text style={styles.modalButtonText}>Mentés</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Fiók törlés Modal */}
      <Modal animationType="fade" transparent visible={deleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons name="delete-alert" size={40} color={colors.error} />
            <Text style={styles.modalTitle}>Fiók törlése</Text>
            <Text style={styles.modalWarning}>⚠️ Figyelem! A fiók törlése végleges és visszavonhatatlan. Minden adatod törlődik!</Text>
            <TextInput style={styles.modalInput} placeholder="Add meg a jelszavad" placeholderTextColor={colors.text_secondary} secureTextEntry value={deletePassword} onChangeText={setDeletePassword} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => { setDeleteModalVisible(false); setDeletePassword(''); }}>
                <Text style={styles.modalCancelText}>Mégse</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalConfirmButton, { backgroundColor: colors.error }]} onPress={handleDeleteAccount} disabled={deleteLoading}>
                {deleteLoading ? <ActivityIndicator color={colors.text_inverted} size="small" /> : <Text style={styles.modalButtonText}>Törlés</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Kijelentkezés megerősítés Modal */}
      <Modal animationType="fade" transparent visible={logoutConfirmModalVisible} onRequestClose={() => setLogoutConfirmModalVisible(false)}>
        <View style={styles.alertModalOverlay}>
          <View style={styles.alertModal}>
            <MaterialCommunityIcons name="logout" size={60} color={colors.warning} />
            <Text style={[styles.alertTitle, { color: colors.warning }]}>Kijelentkezés</Text>
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
            {alertType === 'error' && <MaterialCommunityIcons name="alert-circle" size={60} color={colors.error} />}
            {alertType === 'success' && <MaterialCommunityIcons name="check-circle" size={60} color={colors.success} />}
            {alertType === 'warning' && <MaterialCommunityIcons name="alert" size={60} color={colors.warning} />}
            {alertType === 'info' && <MaterialCommunityIcons name="information" size={60} color={colors.primary} />}
            <Text style={[styles.alertTitle, { color: alertType === 'error' ? colors.error : alertType === 'success' ? colors.success : alertType === 'warning' ? colors.warning : colors.primary }]}>{alertTitle}</Text>
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <TouchableOpacity style={[styles.alertButton, { backgroundColor: alertType === 'error' ? colors.error : alertType === 'success' ? colors.success : alertType === 'warning' ? colors.warning : colors.primary }]} onPress={() => setAlertModalVisible(false)}>
              <Text style={styles.alertButtonText}>Rendben</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean, width: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerGradient: {
    borderBottomLeftRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
    ...Platform.select({
      default: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 12,
      }
    })
  },
  headerArea: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: rf(22, width),
    fontWeight: FONT_WEIGHTS.bold as 'bold',
    color: colors.text_inverted,
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
    marginBottom: SPACING.md,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 3,
    borderColor: colors.text_inverted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarInitial: {
    fontSize: rf(34, width),
    fontWeight: FONT_WEIGHTS.bold as 'bold',
    color: colors.text_inverted,
  },
  userName: {
    fontSize: rf(22, width),
    fontWeight: FONT_WEIGHTS.bold as 'bold',
    color: colors.text_inverted,
    marginBottom: SPACING.xs,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },
  rankText: {
    fontSize: rf(12, width),
    color: colors.text_inverted,
    fontWeight: '500',
  },
  xpBarContainer: {
    marginTop: SPACING.xs,
  },
  xpBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  xpLabel: {
    fontSize: rf(12, width),
    color: 'rgba(255,255,255,0.8)',
    fontWeight: FONT_WEIGHTS.medium as '500',
  },
  xpTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: BORDER_RADIUS.sm,
  },
  contentContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },
  themeSwitcherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  themeSwitcherText: {
    fontSize: rf(16, width),
    fontWeight: FONT_WEIGHTS.medium as '500',
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: `0px 2px 12px ${colors.primary}14` },
      default: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.08,
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
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: rf(10, width),
    fontWeight: FONT_WEIGHTS.black as '900',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: rf(11, width),
    color: colors.text_secondary,
    textAlign: 'center',
    fontWeight: FONT_WEIGHTS.medium as '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: `0px 2px 12px ${colors.primary}14` },
      default: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.08,
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
    marginBottom: SPACING.sm,
  },
  actionBtnLabel: {
    fontSize: rf(12, width),
    fontWeight: FONT_WEIGHTS.bold as 'bold',
  },
  sectionTitle: {
    fontSize: rf(17, width),
    fontWeight: FONT_WEIGHTS.black as '900',
    color: colors.text,
    marginBottom: SPACING.sm,
    paddingHorizontal: 2,
  },
  emptyGames: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  emptyGamesText: {
    marginTop: SPACING.sm,
    fontSize: rf(14, width),
    color: colors.text_secondary,
  },
  gameCard: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    ...Platform.select({
      web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.15 : 0.06,
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
    marginRight: SPACING.sm,
  },
  gameInfo: {
    flex: 1,
  },
  gamePont: {
    fontSize: rf(15, width),
    fontWeight: FONT_WEIGHTS.bold as 'bold',
    color: colors.text,
    marginBottom: 3,
  },
  gameDate: {
    fontSize: rf(12, width),
    color: colors.text_secondary,
  },
  gameBadge: {
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    minWidth: 54,
  },
  gameBadgeText: {
    fontWeight: FONT_WEIGHTS.bold as 'bold',
    fontSize: rf(15, width),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '88%',
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: rf(20, width),
    fontWeight: FONT_WEIGHTS.bold as 'bold',
    textAlign: 'center',
    marginVertical: SPACING.sm,
    color: colors.text,
  },
  modalWarning: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontSize: rf(13, width),
    lineHeight: 18,
  },
  modalInput: {
    backgroundColor: colors.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: rf(15, width),
    marginBottom: SPACING.sm,
    color: colors.text,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: colors.background,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  modalCancelText: {
    fontWeight: FONT_WEIGHTS.bold as 'bold',
    color: colors.text_secondary,
  },
  modalConfirmButton: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: colors.primary,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  modalButtonText: {
    fontWeight: FONT_WEIGHTS.bold as 'bold',
    color: colors.text_inverted,
  },
  alertModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertModal: {
    width: '85%',
    maxWidth: 320,
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    elevation: 10,
  },
  alertTitle: {
    fontSize: rf(20, width),
    fontWeight: FONT_WEIGHTS.bold as 'bold',
    textAlign: 'center',
    marginVertical: SPACING.sm,
  },
  alertMessage: {
    fontSize: rf(14, width),
    color: colors.text_secondary,
    textAlign: 'center',
    marginVertical: SPACING.sm,
    lineHeight: 20,
  },
  alertButtonContainer: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    gap: SPACING.sm,
    width: '100%',
  },
  alertButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    fontWeight: FONT_WEIGHTS.bold as 'bold',
    color: colors.text_secondary,
  },
  confirmButtonText: {
    fontWeight: FONT_WEIGHTS.bold as 'bold',
    color: colors.text_inverted,
  },
  alertButtonText: {
    fontWeight: FONT_WEIGHTS.bold as 'bold',
    color: colors.text_inverted,
  },
});

export default Felhasznalo;