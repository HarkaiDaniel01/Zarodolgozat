import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cim from './Cim';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(Cim.Cim+'/admin/bejelentkezes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          "jatekos_nev" : username, 
          "jatekos_jelszo" : password
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Hibás bejelentkezési adatok');
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userid', data.user.id);

      navigate('/felhasznalo');
    } catch (err) {
      setError(err.message);
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bejelentkezés</h1>
      {error && <p style={styles.error}>{error}</p>}
      
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Felhasználónév</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
            placeholder="Írd be a felhasználóneved"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Jelszó</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            placeholder="Írd be a jelszavad"
          />
        </div>

        <button type="submit" style={styles.button}>Bejelentkezés</button>

        {/* 🔥 REGISZTRÁCIÓ GOMB */}
        <button
          type="button"
          onClick={goToRegister}
          style={{ ...styles.button, backgroundColor: '#28a745', marginTop: '10px' }}
        >
          Regisztráció
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '60px auto',
    padding: '30px',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#f9f9f9',
  },
  title: {
    marginBottom: '20px',
    fontSize: '2rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
};

export default Login;
