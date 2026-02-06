import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Cim from "./Cim";

const { width } = Dimensions.get('window');

const Login = ({ onNavigateToRegister, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Kérlek töltsd ki mindkét mezőt!");
      return;
    }

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
      if (data.role) {
        await AsyncStorage.setItem("role", data.role);
      }
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
          Alert.alert("Siker", "Korábbi eredmény feltöltve!");
        } else {
          Alert.alert("Hiba", "Nem sikerült feltölteni a korábbi eredményt.");
        }

        await AsyncStorage.removeItem("taroltEredmeny");
      }

      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      console.log("Login Error:", err);
      setError(err.message);
      Alert.alert("Hiba", err.message);
    }
  };

  const goToRegister = () => {
    if (onNavigateToRegister) onNavigateToRegister();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
       <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="brain" size={80} color="#fff" />
            <Text style={styles.appTitle}>Kvízjáték</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Bejelentkezés</Text>
            
            {error ? (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle" size={20} color="#fff" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Felhasználónév"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Jelszó"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <LinearGradient
                colors={['#2962FF', '#2979FF']}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>BEJELENTKEZÉS</Text>
                <MaterialCommunityIcons name="login" size={20} color="#fff" style={{marginLeft: 10}} />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>VAGY</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={goToRegister}>
              <Text style={styles.registerButtonText}>Még nincs fiókod? Regisztráció</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    ...Platform.select({
      web: {
        textShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)',
      },
      default: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
      }
    })
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    ...Platform.select({
      web: {
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
      }
    })
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#2962FF',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    marginBottom: 20,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontWeight: 'bold',
    fontSize: 12,
  },
  registerButton: {
    alignItems: 'center',
    padding: 10,
  },
  registerButtonText: {
    color: '#666',
    fontSize: 15,
  },
  errorContainer: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  errorText: {
    color: '#fff',
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
});

export default Login;
