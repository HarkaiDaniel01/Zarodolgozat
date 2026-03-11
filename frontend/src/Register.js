import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cim from './Cim';
import Swal from 'sweetalert2';


const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordAgain) {
      setError('A jelszavak nem egyeznek!');
      return;
    }

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

      Swal.fire({
                title: `Sikeres regisztráció!`,
                html: `Sikeres regisztráció`,
                icon: `success`,
                confirmButtonText: `Rendben`,
              });

      navigate('/login'); // vissza a login oldalra
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Regisztráció</h1>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleRegister} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Felhasználónév</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
            placeholder="Felhasználónév"
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
            placeholder="Jelszó"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Jelszó újra</label>
          <input
            type="password"
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
            required
            style={styles.input}
            placeholder="Jelszó ismét"
          />
        </div>

        <button type="submit" style={styles.button}>
          ✨ Regisztráció
        </button>

        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{ ...styles.button, backgroundColor: '#4DA3FF', marginTop: '10px' }}
        >
          🎮 Vissza a bejelentkezéshez
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
    borderRadius: '10px',
    //boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(10, 10, 20, 0.8)',
    marginTop : "150px",
    boxShadow: "5px 5px 5px"
  },
  title: {
    marginBottom: '20px',
    fontSize: '2rem',
    //color: '#333',
    color: "#F2F2F2"
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
    color:" #F2F2F2"
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '2px solid #ccc',
    fontSize: '1rem',
    backgroundColor: "#2A2F3A",
    color: "#F2F2F2"
  },
  button: {
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#7B5CFF',
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

export default Register;
