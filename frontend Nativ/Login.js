import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Cim from './Cim';

const Login = ({ onNavigateToRegister, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Kérlek töltsd ki mindkét mezőt!');
      return;
    }

    setError('');
    
    try {
      const response = await fetch(Cim.Cim + '/admin/bejelentkezes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          "jatekos_nev": username, 
          "jatekos_jelszo": password
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Hibás bejelentkezési adatok');
      }

      const data = await response.json();

      // AsyncStorage használata localStorage helyett (minden await-es!)
      await AsyncStorage.setItem('token', data.token);
      if (data.role) {
        await AsyncStorage.setItem('role', data.role);
      }
      await AsyncStorage.setItem('userid', String(data.user.id)); 

      const taroltEredmeny = await AsyncStorage.getItem("taroltEredmeny");

      if (taroltEredmeny) {
        const { ePont, eKat } = JSON.parse(taroltEredmeny);

        const maiDatum = new Date().toISOString();
        const bemenet = {
          "nyeremeny": ePont,
          "jatekos": data.user.id,
          "kategoria": eKat,
          "datum": maiDatum
        };
        
        const resEredmeny = await fetch(Cim.Cim + "/eredmenyFelvitel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bemenet)
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
      console.log('Login Error:', err);
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
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Bejelentkezés</Text>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Felhasználónév</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername} 
              placeholder="Írd be a felhasználóneved"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Jelszó</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Írd be a jelszavad"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Bejelentkezés</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={goToRegister}
          >
            <Text style={styles.buttonText}>Regisztráció</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f9f9f9',
  },
  title: {
    marginBottom: 30,
    fontSize: 32,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#555',
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#007bff',
    alignItems: 'center',
    marginTop: 10,
    // Árnyék Androidra
    elevation: 3, 
    // Árnyék iOS-re
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  registerButton: {
    backgroundColor: '#28a745',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Login;