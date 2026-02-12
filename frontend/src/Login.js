import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cim from './Cim';
import Swal from 'sweetalert2';

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

      const taroltEredmeny = localStorage.getItem("taroltEredmeny");

      if (taroltEredmeny) {
        const {ePont, ePontozas, eKat} = JSON.parse(taroltEredmeny);

        const bemenet={
          "nyeremeny" : ePont,
          "pontszam" : ePontozas,
          "jatekos" : data.user.id,
          "kategoria": eKat
        }
        
        const response=await fetch(Cim.Cim+"/eredmenyFelvitel", {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bemenet)
        })

        let cim = ""
        let szoveg = ""
        let ikon = ""
        let gomb = ""
        
        if (response.ok) {
          cim = "Sikeres mentés!"
          szoveg = "Eredmény sikeresen mentve!"
          ikon = "success"
          gomb = "Rendben"
        } else {
          cim = "Hiba!"
          szoveg = "Hiba történt az eredmény mentésekor!"
          ikon = "warning"
          gomb = "Rendben"
        }

        Swal.fire({
          title: `${cim}`,
          html: `${szoveg}`,
          icon: `${ikon}`,
          confirmButtonText: `${gomb}`,
        });


        localStorage.removeItem("taroltEredmeny")
      }



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

        <button type="submit" style={styles.button}>🎮 Bejelentkezés</button>

        {/* 🔥 REGISZTRÁCIÓ GOMB */}
        <button
          type="button"
          onClick={goToRegister}
          style={{ ...styles.button, backgroundColor: '#7B5CFF', marginTop: '10px' }}
        >
          ✨ Regisztráció
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
    backgroundColor: 'rgba(10, 10, 20, 0.8)',
    marginTop : "150px",
    boxShadow: "5px 5px 5px"
    
  },
  title: {
    marginBottom: '20px',
    fontSize: '2rem',
    color:" #F2F2F2"
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
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: "#2A2F3A",
    color: "#F2F2F2"
  },
  button: {
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#4DA3FF',
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
