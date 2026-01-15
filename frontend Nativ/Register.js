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
import Cim from './Cim';

const Register = ({ onNavigateToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // 1. Validáció: Mezők kitöltése
    if (!username || !password || !passwordAgain) {
      setError('Minden mező kitöltése kötelező!');
      return;
    }

    // 2. Validáció: Jelszavak egyezése
    if (password !== passwordAgain) {
      setError('A jelszavak nem egyeznek!');
      return;
    }

    setError('');

    try {
      const response = await fetch(`${Cim.Cim}/admin/regisztracio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          "jatekos_nev" : username,
          "jatekos_jelszo" : password
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Hiba a regisztráció során');
      }

      // Siker esetén Alert és navigáció
      Alert.alert('Siker', 'Sikeres regisztráció!', [
        { text: 'OK', onPress: () => { if (onNavigateToLogin) onNavigateToLogin(); } }
      ]);
      
    } catch (err) {
      console.log('Register Error:', err);
      setError(err.message);
      Alert.alert("Hiba", err.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Regisztráció</Text>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.form}>
          
          {/* Felhasználónév */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Felhasználónév</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Válassz felhasználónevet"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          {/* Jelszó */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Jelszó</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Add meg a jelszót"
              placeholderTextColor="#999"
            />
          </View>

          {/* Jelszó újra */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Jelszó újra</Text>
            <TextInput
              style={styles.input}
              value={passwordAgain}
              onChangeText={setPasswordAgain}
              secureTextEntry
              placeholder="Ismételd meg a jelszót"
              placeholderTextColor="#999"
            />
          </View>

          {/* Regisztráció Gomb */}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Regisztráció</Text>
          </TouchableOpacity>

          {/* Vissza a Loginhoz Gomb */}
          <TouchableOpacity 
            style={[styles.button, styles.backButton]} 
            onPress={() => { if (onNavigateToLogin) onNavigateToLogin(); }}
          >
            <Text style={styles.buttonText}>Vissza a bejelentkezéshez</Text>
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
    marginBottom: 20,
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
    backgroundColor: '#28a745', // Zöld szín a regisztrációhoz
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    backgroundColor: '#6c757d', // Szürke szín a vissza gombhoz
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

export default Register;