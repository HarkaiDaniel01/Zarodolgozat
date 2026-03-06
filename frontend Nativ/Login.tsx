import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Modal
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Cim from "./Cim";
import { useTheme } from './ThemeContext';
import { rf } from './theme';

interface LoginProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onNavigateToRegister, onLoginSuccess }) => {
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 380;
  const isTablet = width >= 600;
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark, width);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [alertModalVisible, setAlertModalVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>('info');

  const handleLogin = async (): Promise<void> => {
    let valid = true;
    setUsernameError("");
    setPasswordError("");
    setError("");

    if (username === "20030826") {
      const unlocked = await AsyncStorage.getItem("geniuszUnlocked");
      if (unlocked === "true") {
        await AsyncStorage.removeItem("geniuszUnlocked");
        setAlertTitle('🔒 Géniusz Mód');
        setAlertMessage('A Géniusz Mód ki lett kapcsolva! 🧠');
        setAlertType('error');
      } else {
        await AsyncStorage.setItem("geniuszUnlocked", "true");
        setAlertTitle('🎉 Easter Egg 🎉');
        setAlertMessage('Gratulálok, megtaláltad a titkos üzenetet! 🐣\n\nA Géniusz Mód most már fel lett oldva! 🧠🌟');
        setAlertType('info');
      }
      setAlertModalVisible(true);
      return;
    }

    if (!username || !password) {
      if (!username) setUsernameError("A felhasználónév megadása kötelező!");
      if (!password) setPasswordError("A jelszó megadása kötelező!");
      return;
    }

    if (username.length < 3) {
      setUsernameError("A felhasználónév legalább 3 karakter legyen!");
      valid = false;
    }
    if (password.length < 4) {
      setPasswordError("A jelszó legalább 4 karakter legyen!");
      valid = false;
    }
    if (!valid) return;

    setError("");

    try {
      const response = await fetch(Cim.Cim + "/admin/bejelentkezes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jatekos_nev: username,
          jatekos_jelszo: password,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Hibás bejelentkezési adatok");
      }

      const data = await response.json();

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("role", Number(data.jatekos_admin) === 1 ? "admin" : "user");
      await AsyncStorage.setItem("userid", String(data.user.id));

      const taroltEredmeny = await AsyncStorage.getItem("taroltEredmeny");

      if (taroltEredmeny) {
        const { ePont, eKat } = JSON.parse(taroltEredmeny);

        const maiDatum = new Date().toISOString();
        const bemenet = {
          nyeremeny: ePont,
          jatekos: data.user.id,
          kategoria: eKat,
          datum: maiDatum,
        };

        const resEredmeny = await fetch(Cim.Cim + "/eredmenyFelvitel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bemenet),
        });

        if (resEredmeny.ok) {
          setAlertTitle('Siker');
          setAlertMessage('Korábbi eredmény feltöltve!');
          setAlertType('success');
          setAlertModalVisible(true);
        } else {
          setAlertTitle('Hiba');
          setAlertMessage('Nem sikerült feltölteni a korábbi eredményt.');
          setAlertType('error');
          setAlertModalVisible(true);
        }

        await AsyncStorage.removeItem("taroltEredmeny");
      }

      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ismeretlen hiba";
      console.log("Login Error:", err);
      setUsernameError("Hibás felhasználónév vagy jelszó!");
      setPasswordError("Hibás felhasználónév vagy jelszó!");
      setAlertTitle('Hiba');
      setAlertMessage(errorMessage);
      setAlertType('error');
      setAlertModalVisible(true);
    }
  };

  const goToRegister = (): void => {
    if (onNavigateToRegister) onNavigateToRegister();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={[styles.scrollContainer, { alignItems: 'center' }]} showsVerticalScrollIndicator={false}>
          
          <View style={styles.logoContainer}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="brain" size={isSmallScreen ? 34 : 40} color="#fff" />
            </View>
            <Text style={[styles.appTitle, { fontSize: isSmallScreen ? 12 : 24, textAlign: 'center' }]}>A tudás torna!</Text>
            <Text style={[styles.appSubtitle, { textAlign: 'center' }]}>Teszteld a tudásod!</Text>
          </View>

          <View style={[styles.card, { width: isTablet ? 480 : '100%', maxWidth: 480 }]}>
            <Text style={[styles.title, { fontSize: isSmallScreen ? 20 : 24 , textAlign: 'center' }]}>Üdvözlünk újra!</Text>
            <Text style={[styles.subtitle, { textAlign: 'center' }]}>Kérlek add meg a bejelentkezési adataid</Text>

            {error ? (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>FELHASZNÁLÓNÉV</Text>
              <View style={[styles.inputContainer, usernameError ? styles.inputContainerError : null]}>
                <MaterialCommunityIcons name="account-outline" size={20} color={usernameError ? "#EF4444" : "#9CA3AF"} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Felhasználónév"
                  placeholderTextColor="#9CA3AF"
                  value={username}
                  onChangeText={(t) => { setUsername(t); setUsernameError(""); }}
                  autoCapitalize="none"
                />
              </View>
              {usernameError ? <Text style={styles.fieldError}>{usernameError}</Text> : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>JELSZÓ</Text>
              <View style={[styles.inputContainer, passwordError ? styles.inputContainerError : null]}>
                <MaterialCommunityIcons name="lock-outline" size={20} color={passwordError ? "#EF4444" : "#9CA3AF"} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Jelszó"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={(t) => { setPassword(t); setPasswordError(""); }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <MaterialCommunityIcons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.fieldError}>{passwordError}</Text> : null}
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Bejelentkezés</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>VAGY</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={goToRegister} activeOpacity={0.7}>
              <Text style={styles.registerText}>Még nincs fiókod? </Text>
              <Text style={styles.registerTextBold}>Fiók létrehozása</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Alert Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={alertModalVisible}
          onRequestClose={() => setAlertModalVisible(false)}
        >
          <View style={styles.alertOverlay}>
            <View style={styles.alertContainer}>
              {alertType === 'error' && <MaterialCommunityIcons name="alert-circle" size={56} color="#EF4444" />}
              {alertType === 'success' && <MaterialCommunityIcons name="check-circle" size={56} color="#22C55E" />}
              {alertType === 'info' && <MaterialCommunityIcons name="information" size={56} color="#6C5CE7" />}
              <Text style={[styles.alertTitle, {
                color: alertType === 'error' ? '#EF4444' : alertType === 'success' ? '#22C55E' : '#6C5CE7'
              }]}>{alertTitle}</Text>
              <Text style={styles.alertMessage}>{alertMessage}</Text>
              <TouchableOpacity
                style={[styles.alertButton, {
                  backgroundColor: alertType === 'error' ? '#EF4444' : alertType === 'success' ? '#22C55E' : '#6C5CE7'
                }]}
                onPress={() => setAlertModalVisible(false)}
              >
                <Text style={styles.alertButtonText}>Rendben</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const PRIMARY = '#6C5CE7';

const getStyles = (colors: any, isDark: boolean, width: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    ...Platform.select({
      default: {
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
      }
    })
  },
  appTitle: {
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
  appSubtitle: {
    color: colors.text_secondary,
    fontSize: rf(15, width),
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 28,
    ...Platform.select({
      web: { boxShadow: '0px 4px 24px rgba(108, 92, 231, 0.08)' },
      default: {
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 6,
      }
    })
  },
  title: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    color: colors.text_secondary,
    fontSize: rf(14, width),
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: rf(11, width),
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: 7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? colors.surface : '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: rf(15, width),
  },
  inputContainerError: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
    backgroundColor: '#FEF2F2',
  },
  fieldError: {
    color: '#EF4444',
    fontSize: rf(12, width),
    fontWeight: '500',
    marginTop: 5,
    marginLeft: 4,
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 22,
    ...Platform.select({
      default: {
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
      }
    })
  },
  buttonText: {
    color: '#fff',
    fontSize: rf(16, width),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    fontSize: rf(12, width),
    letterSpacing: 0.5,
  },
  registerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: colors.text_secondary,
    fontSize: rf(14, width),
  },
  registerTextBold: {
    color: PRIMARY,
    fontSize: rf(14, width),
    fontWeight: '700',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    marginLeft: 8,
    flex: 1,
    fontSize: rf(13, width),
    fontWeight: '500',
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: '85%',
    maxWidth: 320,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  alertTitle: {
    fontSize: rf(19, width),
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 12,
  },
  alertMessage: {
    fontSize: rf(14, width),
    color: colors.text_secondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  alertButton: {
    paddingVertical: 13,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  alertButtonText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: rf(15, width),
  },
  // legacy kept
  forgotPassword: { alignSelf: 'flex-end' },
  forgotPasswordText: { color: PRIMARY, fontSize: rf(13, width) },
  registerButtonText: { color: PRIMARY, fontSize: rf(14, width) },
  gradientButton: { paddingVertical: 15 },
});

export default Login;
