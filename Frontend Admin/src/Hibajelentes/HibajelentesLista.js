import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Cim from "../Cim";
import "../App.css";

const HibajelentesLista = () => {
  const [hibajelentések, setHibajelentések] = useState([]);
  const [szűrés, setSzűrés] = useState('összes');
  const [tolt, setTolt] = useState(true);
  const [hiba, setHiba] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Kereső mezők
  const [keresoSzoveg, setKeresoSzoveg] = useState("");

  // Szerkesztés state-ek (Modal)
  const [modalNyitva, setModalNyitva] = useState(false);
  const [szerkesztettElem, setSzerkesztettElem] = useState(null);
  const [ujStatus, setUjStatus] = useState("");
  const [ujMegjegyzes, setUjMegjegyzes] = useState("");

  // ADATOK BETÖLTÉSE
  useEffect(() => {
    lekérezHibajelentések();
    
    const checkDarkMode = () => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    };
    checkDarkMode();
    window.addEventListener('darkModeChanged', checkDarkMode);
    return () => window.removeEventListener('darkModeChanged', checkDarkMode);
  }, []);

  const lekérezHibajelentések = async () => {
    try {
      setTolt(true);
      const response = await fetch(`${Cim.Cim}/adminhibajelentes`);
      if (!response.ok) throw new Error('Hiba a lekérdezéskor');
      const data = await response.json();
      setHibajelentések(data);
      setHiba(false);
    } catch (error) {
      console.error('Hiba:', error);
      setHiba(true);
    } finally {
      setTolt(false);
    }
  };

  // TÖRLÉS
  const torlesFuggveny = async (id) => {
    const result = await Swal.fire({
      title: 'Hibajelentés törlése',
      text: `Biztosan törlöd ezt a hibajelentést?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#00A21D',
      confirmButtonText: 'Igen, törlöm',
      cancelButtonText: 'Mégse'
    });
    
    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${Cim.Cim}/hibajelentestorlese/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        lekérezHibajelentések();
        Swal.fire({
            icon: 'success',
            title: 'Sikeres!',
            text: 'Hibajelentés törölve.',
            confirmButtonColor: '#00A21D'
        });
      } else {
        throw new Error('Hiba a törlés során');
      }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Hiba!',
            text: 'Nem sikerült a törlés.',
            confirmButtonColor: '#d33'
        });
    }
  };


  // MÓDOSÍTÁS MENTÉSE
  const modositasMentese = async () => {
    if (!szerkesztettElem) return;

    try {
        const adminId = localStorage.getItem('jatekos_id'); 
        const response = await fetch(`${Cim.Cim}/hibajelentesmodosit/${szerkesztettElem.hibajelentes_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: ujStatus,
                admin_megjegyzes: ujMegjegyzes,
                admin_id: adminId 
            }),
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Sikeres módosítás!',
                confirmButtonColor: '#00A21D'
            });
            setModalNyitva(false);
            lekérezHibajelentések();
        } else {
            throw new Error('Hiba a mentés során');
        }
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Hiba!',
            text: 'Nem sikerült a mentés.',
            confirmButtonColor: '#d33'
        });
    }
  };

  // Szűrés
  const szurtAdatok = hibajelentések.filter(h => {
    const statusMatch = szűrés === 'összes' || h.hibajelentes_status === szűrés;
    const textMatch = keresoSzoveg === "" || 
        (h.hibajelentes_leiras && h.hibajelentes_leiras.toLowerCase().includes(keresoSzoveg.toLowerCase())) ||
        (h.kerdesek_kerdes && h.kerdesek_kerdes.toLowerCase().includes(keresoSzoveg.toLowerCase())) ||
        (h.jatekos_nev && h.jatekos_nev.toLowerCase().includes(keresoSzoveg.toLowerCase()));
    return statusMatch && textMatch;
  });

  if (tolt) return <div style={{ textAlign: "center", padding: "20px" }}>Adatok betöltése...</div>;
  if (hiba) return <div style={{ textAlign: "center", padding: "20px", color: "red" }}>Hiba történt az adatok betöltése során.</div>;

  // Lapozás
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = szurtAdatok.slice(indexOfFirstItem, indexOfLastItem);
  
  // Bug fix: prevent page overflow when filtering results in fewer items
  if (currentPage > Math.ceil(szurtAdatok.length / itemsPerPage) && szurtAdatok.length > 0) {
      setCurrentPage(1);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{
      background: darkMode ? 'linear-gradient(135deg, #001F25 0%, #033639 50%, #3A6B72 100%)' : 'linear-gradient(135deg, #003B46 0%, #07575B 50%, #66A5AD 100%)',
      minHeight: '100vh',
      padding: '2rem',
      borderRadius:'15px',
      color: darkMode ? 'white' : 'black'
    }}>
      <div className="felvitel">
        <h1 style={{color: 'white', textShadow: '1px 1px 2px black', marginBottom: '20px'}}>🐛 Felhasználói Hibajelentések</h1>
        
        {/* SZŰRÉS ÉS KERESÉS */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{marginBottom: '0.5rem', display: 'block', color:'white', fontWeight: 'bold'}}>Keresés (szöveg, kérdés, név):</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Írj be valamit..." 
                    value={keresoSzoveg}
                    onChange={(e) => setKeresoSzoveg(e.target.value)}
                    style={{backgroundColor: darkMode ? '#333' : 'white', color: darkMode ? 'white' : 'black', border: '1px solid #ccc'}}
                />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{marginBottom: '0.5rem', display: 'block', color:'white', fontWeight: 'bold'}}>Státusz szűrés:</label>
                <select 
                    className="form-control"
                    value={szűrés} 
                    onChange={(e) => setSzűrés(e.target.value)}
                    style={{backgroundColor: darkMode ? '#333' : 'white', color: darkMode ? 'white' : 'black', border: '1px solid #ccc'}}
                >
                    <option value="összes">Összes</option>
                    <option value="új">Új</option>
                    <option value="vizsgálat alatt">Vizsgálat alatt</option>
                    <option value="megoldva">Megoldva</option>
                    <option value="elutasítva">Elutasítva</option>
                </select>
            </div>
        </div>

        <hr style={{borderColor:'white', opacity: 0.3}} />

        {/* LISTA (Kártyák) */}
        <div className="kerdes-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
          {currentItems.length > 0 ? (
            currentItems.map((elem) => (
              <div className="kerdes-kartya" key={elem.hibajelentes_id} style={{
                  backgroundColor: darkMode ? '#1a1a1a' : 'white', 
                  color: darkMode ? 'white' : '#333',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
              }}>
                <div style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px'}}>
                    <h3 style={{fontSize: '1.2rem', margin: 0, color: darkMode ? '#4db6ac' : '#00796b'}}>{elem.jatekos_nev}</h3>
                    <small style={{color: '#888'}}>{elem.hibajelentes_datum}</small>
                </div>
                
                <div style={{flex: 1}}>
                    <p style={{marginBottom: '5px'}}><strong>Kérdés:</strong> {elem.kerdesek_kerdes}</p>
                    <p style={{marginBottom: '5px'}}><strong>Helyes válasz:</strong> <span style={{color: 'green'}}>{elem.kerdesek_helyesValasz}</span></p>
                    <div style={{backgroundColor: darkMode ? '#333' : '#f0f0f0', padding: '8px', borderRadius: '5px', marginBottom: '10px', fontStyle: 'italic'}}>
                        "{elem.hibajelentes_leiras}"
                    </div>
                </div>

                <div style={{marginTop: 'auto'}}>
                    <div style={{marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <strong>Státusz: </strong> 
                        <span 
                            className={`badge ${
                                elem.hibajelentes_status === 'új' ? 'bg-primary' : 
                                elem.hibajelentes_status === 'megoldva' ? 'bg-success' : 
                                elem.hibajelentes_status === 'elutasítva' ? 'bg-danger' : 
                                'bg-warning text-dark'
                            }`}
                            style={{fontSize: '0.9em', padding: '8px 12px'}}
                        >
                            {elem.hibajelentes_status}
                        </span>
                    </div>
                    
                    {elem.hibajelentes_admin_megjegyzes && (
                        <div style={{marginBottom: '15px', padding: '10px', borderLeft: '4px solid #007bff', backgroundColor: darkMode ? '#2c3e50' : '#e3f2fd', borderRadius: '0 5px 5px 0'}}>
                            <strong style={{display: 'block', marginBottom: '4px', fontSize: '0.9em', color: '#007bff'}}>Admin válasza:</strong>
                            {elem.hibajelentes_admin_megjegyzes}
                        </div>
                    )}
                    
                    <div className="kartya-gombok" style={{display: 'flex', gap: '10px'}}>
                    <button
                        className="btn btn-warning w-100"
                        style={{fontWeight: 'bold'}}
                        onClick={() => {
                            setSzerkesztettElem({...elem});
                            setUjStatus(elem.hibajelentes_status || 'új');
                            setUjMegjegyzes(elem.hibajelentes_admin_megjegyzes || '');
                            setModalNyitva(true);
                        }}
                    >
                        KEZELÉS
                    </button>
                    <button
                        className="btn btn-danger w-100"
                        style={{fontWeight: 'bold'}}
                        onClick={() => torlesFuggveny(elem.hibajelentes_id)}
                    >
                        TÖRLÉS
                    </button>
                    </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-info w-100" style={{gridColumn: '1 / -1', textAlign: 'center'}}>Nincsenek megjeleníthető hibajelentések.</div>
          )}
        </div>

        {/* LAPOZÁS */}
        {szurtAdatok.length > itemsPerPage && (
            <div className="pagination" style={{marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '5px'}}>
            {Array.from({ length: Math.ceil(szurtAdatok.length / itemsPerPage) }, (_, i) => (
                <button 
                    key={i + 1} 
                    onClick={() => paginate(i + 1)} 
                    className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-light'}`}
                    style={{minWidth: '40px'}}
                >
                {i + 1}
                </button>
            ))}
            </div>
        )}

        {/* MODAL */}
        {modalNyitva && szerkesztettElem && (
            <div className="modal" style={{display: 'block', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, overflowY: 'auto'}}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{
                        backgroundColor: darkMode ? '#222' : 'white', 
                        color: darkMode ? 'white' : 'black',
                        border: darkMode ? '1px solid #444' : '1px solid #ccc'
                    }}>
                        <div className="modal-header" style={{borderBottom: darkMode ? '1px solid #444' : '1px solid #dee2e6'}}>
                            <h5 className="modal-title">Hibajelentés kezelése # {szerkesztettElem.hibajelentes_id}</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setModalNyitva(false)} style={{filter: darkMode ? 'invert(1)' : 'none'}}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label" style={{fontWeight: 'bold'}}>Státusz:</label>
                                <select 
                                    className="form-control" 
                                    value={ujStatus} 
                                    onChange={(e) => setUjStatus(e.target.value)}
                                    style={{backgroundColor: darkMode ? '#333' : 'white', color: darkMode ? 'white' : 'black', border: darkMode ? '1px solid #555' : '1px solid #ced4da'}}
                                >
                                    <option value="új">Új</option>
                                    <option value="vizsgálat alatt">Vizsgálat alatt</option>
                                    <option value="megoldva">Megoldva</option>
                                    <option value="elutasítva">Elutasítva</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" style={{fontWeight: 'bold'}}>Admin Megjegyzés/Válasz:</label>
                                <textarea 
                                    className="form-control" 
                                    rows="4"
                                    value={ujMegjegyzes}
                                    onChange={(e) => setUjMegjegyzes(e.target.value)}
                                    placeholder="Ide írhatsz választ a felhasználónak..."
                                    style={{backgroundColor: darkMode ? '#333' : 'white', color: darkMode ? 'white' : 'black', border: darkMode ? '1px solid #555' : '1px solid #ced4da'}}
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer" style={{borderTop: darkMode ? '1px solid #444' : '1px solid #dee2e6'}}>
                            <button type="button" className="btn btn-secondary" onClick={() => setModalNyitva(false)}>Mégse</button>
                            <button type="button" className="btn btn-success" onClick={modositasMentese}>Mentés</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default HibajelentesLista;
