import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Cim from "../Cim";

const Kategoriafeltolt = () => {
  const [kategoria, setKategoria] = useState("");
  const [tolt, setTolt] = useState(true);
  const [hiba, setHiba] = useState(false);
  const [siker, setSiker] = useState(false);
  const [adatok, setAdatok] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const [modalNyitva, setModalNyitva] = useState(false);
  const [szerkesztettKerdes, setSzerkesztettKerdes] = useState({});

  // Inline styles for responsive card design
  const styles = `
    .kategoria-cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      padding: 1rem 0;
    }
    
    @media (max-width: 768px) {
      .kategoria-cards-container {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
      }
    }
    
    @media (max-width: 480px) {
      .kategoria-cards-container {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .kategoria-card-buttons {
        flex-direction: column;
      }
      .kategoria-card-buttons button {
        width: 100%;
      }
    }
  `;

  const leToltes = async () => {
    try {
      const response = await fetch(Cim.Cim + "/kategoriaadmin");
      const data = await response.json();

      if (response.ok) {
        setAdatok(data);
        setTolt(false);
      } else {
        setHiba(true);
        setTolt(false);
      }
    } catch (error) {
      console.log(error);
      setHiba(true);
    }
  };

  useEffect(() => {
    leToltes();
    
    // Dark mode ellenőrzés
    const checkDarkMode = () => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    };
    
    checkDarkMode();
    window.addEventListener('darkModeChanged', checkDarkMode);
    
    return () => window.removeEventListener('darkModeChanged', checkDarkMode);
  }, [siker]);

  // FELVITEL
  const felvitelFuggveny = async (e) => {
    e.preventDefault();

    const response = await fetch(Cim.Cim + "/kategoriaFeltoltes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kategoria_nev: kategoria,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Sikeres!',
        text: data.message,
        confirmButtonColor: '#00A21D'
      });
      setKategoria("");
      setSiker(!siker);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Hiba!',
        text: data.error,
        confirmButtonColor: '#d33'
      });
    }
  };

  // TÖRLÉS
  const torlesFuggveny = async (kategoria_id, kategoria_nev) => {
    const result = await Swal.fire({
      title: 'Kategória törlése',
      text: `Biztosan törölni szeretnéd a(z) ${kategoria_nev} kategóriát?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#00A21D',
      confirmButtonText: 'Igen, törlöm',
      cancelButtonText: 'Mégse'
    });

    if (result.isConfirmed) {
      const response = await fetch(
        Cim.Cim + "/kategoriaTorles/" + kategoria_id,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Sikeres!',
          text: data.message,
          confirmButtonColor: '#00A21D'
        });
        setSiker(!siker);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Hiba!',
          text: data.error,
          confirmButtonColor: '#d33'
        });
      }
    }
  };

  // MÓDOSÍTÁS
  const modositFuggveny = async () => {
    const result = await Swal.fire({
      title: 'Kategória módosítása',
      text: `Biztosan módosítod a(z) ${szerkesztettKerdes.kategoria_nev} kategóriát?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#00A21D',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Igen, módosítom',
      cancelButtonText: 'Mégse'
    });

    if (!result.isConfirmed) return;

    const response = await fetch(
      Cim.Cim + "/kategoriaModositasa/" + szerkesztettKerdes.kategoria_id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(szerkesztettKerdes),
      }
    );

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Sikeres!',
        text: data.message,
        confirmButtonColor: '#00A21D'
      });
      setModalNyitva(false);
      setSiker((s) => !s);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Hiba!',
        text: data.error,
        confirmButtonColor: '#d33'
      });
    }
  };

  if (tolt)
    return (
      <div style={{ textAlign: "center" }}>
        Adatok betöltése folyamatban...
      </div>
    );
  if (hiba) return <div>Hiba történt az adatok betöltése közben.</div>;

  return (
    <div>
      <style>{styles}</style>
      <div style={{
        background: darkMode ? 'linear-gradient(135deg, #001F25 0%, #033639 50%, #3A6B72 100%)' : 'linear-gradient(135deg, #003B46 0%, #07575B 50%, #66A5AD 100%)',
        minHeight: '100vh',
        padding: '1rem',
        borderRadius:'15px',
      }}>
        <div className="felvitel" style={{ 
          maxWidth: '1400px',
          width: '100%', 
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>Kategória kezelése</h1>

        <div className="kategoria-form" style={{
          background: darkMode ? 'linear-gradient(135deg, #001F25 0%, #033639 50%, #3A6B72 100%)' : 'linear-gradient(135deg, #134E5E 0%, #71B1B6 50%, #E0F2F1 100%)',
          minHeight: '1vh',
          padding: '1.5rem',
          borderRadius:'15px',
        }}>
          <form onSubmit={felvitelFuggveny} className="forms" >
            <div className="mb-3">
              <label>Új kategória neve:</label>
              <input
                type="text"
                className="form-control"
                value={kategoria}
                onChange={(e) => setKategoria(e.target.value)}
                required
                placeholder="Pl.: Történelem"
              />
            </div>
            <button className="btn btn-success gomb" type="submit">
              Hozzáadás
            </button>
          </form>
        </div>

        <hr />

        <h2 style={{
          fontSize: 'clamp(1.25rem, 3vw, 2rem)',
          textAlign: 'center',
          margin: '2rem 0 1.5rem'
        }}>Kategóriák listája</h2>
        
        <div className="kategoria-cards-container">
          {adatok.map((elem) => (
            <div
              key={elem.kategoria_id}
              style={{
                backgroundColor: darkMode ? "#001F25" : "#E0F2F1",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: darkMode 
                  ? "0 4px 12px rgba(0, 0, 0, 0.3)" 
                  : "0 2px 8px rgba(0, 0, 0, 0.1)",
                border: darkMode ? "1px solid #4b5563" : "1px solid #e5e7eb",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = darkMode 
                  ? "0 8px 24px rgba(0, 0, 0, 0.4)" 
                  : "0 4px 16px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = darkMode 
                  ? "0 4px 12px rgba(0, 0, 0, 0.3)" 
                  : "0 2px 8px rgba(0, 0, 0, 0.1)";
              }}
            >
              {/* Card Header */}
              <div style={{
                marginBottom: "1rem",
                paddingBottom: "1rem",
                borderBottom: darkMode ? "1px solid #4b5563" : "1px solid #e5e7eb"
              }}>
                <div style={{
                  fontSize: "0.75rem",
                  color: darkMode ? "#9ca3af" : "#6b7280",
                  marginBottom: "0.25rem"
                }}>
                  Kérdések száma: {elem.db}
                </div>
                <div style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: darkMode ? "#e5e7eb" : "#1f2937",
                  wordBreak: "break-word"
                }}>
                  {elem.kategoria_nev}
                </div>
              </div>

              {/* Card Actions */}
              <div className="kategoria-card-buttons" style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap"
              }}>
                <button
                  className="btn btn-warning"
                  style={{
                    flex: "1",
                    minWidth: "100px",
                    fontSize: "0.875rem",
                    padding: "0.5rem 1rem"
                  }}
                  onClick={() => {
                    setSzerkesztettKerdes(elem);
                    setModalNyitva(true);
                  }}
                >
                  ✏️ MÓDOSÍTÁS
                </button>
                <button
                  className="btn btn-danger"
                  style={{
                    flex: "1",
                    minWidth: "100px",
                    fontSize: "0.875rem",
                    padding: "0.5rem 1rem"
                  }}
                  onClick={() =>
                    torlesFuggveny(elem.kategoria_id, elem.kategoria_nev)
                  }
                >
                  🗑️ TÖRLÉS
                </button>
              </div>
            </div>
          ))}
        </div>

        {adatok.length === 0 && (
          <div style={{ 
            textAlign: "center", 
            padding: "2rem", 
            color: darkMode ? "#9ca3af" : "#6B7280",
            fontSize: "1.1rem"
          }}>
            Nincsenek kategóriák.
          </div>
        )}

      {modalNyitva && (
        <div className="modal">
          <div className="modal-content">
            <h2>Kategória módosítása</h2>

            <label>Kategória név:</label>
            <input
              type="text"
              className="form-control"
              value={szerkesztettKerdes.kategoria_nev}
              onChange={(e) =>
                setSzerkesztettKerdes({
                  ...szerkesztettKerdes,
                  kategoria_nev: e.target.value,
                })
              }
            />
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-success"
                style={{ margin: "5px" }}
                onClick={modositFuggveny}
              >
                Mentés
              </button>

              <button
                className="btn btn-danger"
                style={{ margin: "5px" }}
                onClick={() => setModalNyitva(false)}
              >
                Mégse
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default Kategoriafeltolt;
