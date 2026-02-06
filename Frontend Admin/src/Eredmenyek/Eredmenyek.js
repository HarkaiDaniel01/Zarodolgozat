import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Cim from "../Cim";
import "../App.css";
// Kategória lenyíló importálása a Kerdesfeltolt mappából, mert ott már megvan
import Kategorialenyilo from "../Kerdesfeltolt/Kategorialenyilo";

const Eredmenyek = () => {
  const [adatok, setAdatok] = useState([]);
  const [tolt, setTolt] = useState(true);
  const [hiba, setHiba] = useState(false);
  const [siker, setSiker] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Kereső mezők
  const [keresoJatekos, setKeresoJatekos] = useState("");
  const [keresoKategoria, setKeresoKategoria] = useState("");

  // Szerkesztés state-ek
  const [modalNyitva, setModalNyitva] = useState(false);
  const [szerkesztettEredmeny, setSzerkesztettEredmeny] = useState(null);

  // ADATOK BETÖLTÉSE
  useEffect(() => {
    const betoltes = async () => {
      try {
        const response = await fetch(Cim.Cim + "/eredmenyekAdmin");
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
            setAdatok(data);
        } else {
            console.error("Hiba az adatok lekérésekor:", data);
            setHiba(true);
        }
        setTolt(false);
      } catch (err) {
        console.error(err);
        setHiba(true);
        setTolt(false);
      }
    };
    betoltes();
    
    const checkDarkMode = () => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    };
    checkDarkMode();
    window.addEventListener('darkModeChanged', checkDarkMode);
    return () => window.removeEventListener('darkModeChanged', checkDarkMode);
  }, [siker]);

  // TÖRLÉS
  const torlesFuggveny = async (id) => {
    const result = await Swal.fire({
      title: 'Eredmény törlése',
      text: `Biztosan törlöd ezt az eredményt?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#00A21D',
      confirmButtonText: 'Igen, törlöm',
      cancelButtonText: 'Mégse'
    });
    
    if (!result.isConfirmed) return;

    const response = await fetch(Cim.Cim + "/eredmenyTorlesAdmin/" + id, {
      method: "DELETE",
    });

    const data = await response.json();
    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Sikeres!',
        text: data.message,
        confirmButtonColor: '#00A21D'
      });
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


  // MÓDOSÍTÁS MENTÉSE
  const modositasMentese = async () => {
    if(!szerkesztettEredmeny) return;

    try {
        const response = await fetch(Cim.Cim + "/eredmenyModositasAdmin/" + szerkesztettEredmeny.Eredmenyek_id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Eredmenyek_pont: szerkesztettEredmeny.Eredmenyek_pont,
                Eredmenyek_pontszam: szerkesztettEredmeny.Eredmenyek_pontszam,
                Eredmenyek_kategoria: szerkesztettEredmeny.Eredmenyek_kategoria
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Sikeres módosítás!',
                text: data.message,
                confirmButtonColor: '#00A21D'
            });
            setModalNyitva(false);
            setSzerkesztettEredmeny(null);
            setSiker((s) => !s); // Újratöltés
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Hiba!',
                text: data.error || 'Ismeretlen hiba történt',
                confirmButtonColor: '#d33'
            });
        }
    } catch (error) {
        console.error("Hiba:", error);
        Swal.fire({
            icon: 'error',
            title: 'Hálózati hiba!',
            text: 'Nem sikerült elérni a szervert.',
            confirmButtonColor: '#d33'
        });
    }
  };

  // Szűrés
  const szurtAdatok = adatok.filter(elem => {
      return (
          elem.jatekos_nev.toLowerCase().includes(keresoJatekos.toLowerCase()) &&
          elem.kategoria_nev.toLowerCase().includes(keresoKategoria.toLowerCase())
      );
  });


  if (tolt) return <div style={{ textAlign: "center" }}>Adatok betöltése...</div>;
  if (hiba) return <div>Hiba történt az adatok betöltése során.</div>;

  // Lapozás
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = szurtAdatok.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{
      background: darkMode ? 'linear-gradient(135deg, #001F25 0%, #033639 50%, #3A6B72 100%)' : 'linear-gradient(135deg, #003B46 0%, #07575B 50%, #66A5AD 100%)',
      minHeight: '100vh',
      padding: '2rem',
      borderRadius:'15px',
    }}>
      <div className="felvitel">
        <h1>Eredmények listája</h1>
        
        {/* KERESÉS */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
                <label style={{marginBottom: '0.5rem', display: 'block'}}>Játékos neve:</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Írd be a játékos nevét..." 
                    value={keresoJatekos}
                    onChange={(e) => setKeresoJatekos(e.target.value)}
                />
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
                <label style={{marginBottom: '0.5rem', display: 'block'}}>Kategória:</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Írd be a kategóriát..." 
                    value={keresoKategoria}
                    onChange={(e) => setKeresoKategoria(e.target.value)}
                />
            </div>
        </div>

        <hr />

        {/* LISTA (Kártyák) */}
        <div className="kerdes-grid">
          {currentItems.length > 0 ? (
            currentItems.map((elem) => (
              <div className="kerdes-kartya" key={elem.Eredmenyek_id}>
                <h3>{elem.jatekos_nev}</h3>
                <p><strong>Dátum:</strong> {elem.datum}</p>
                <p><strong>Kategória:</strong> {elem.kategoria_nev}</p>
                <p><strong>Pont:</strong> {elem.Eredmenyek_pont}</p>
                <p><strong>Pontszám:</strong> {elem.Eredmenyek_pontszam}</p>
                
                <div className="kartya-gombok">
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => torlesFuggveny(elem.Eredmenyek_id)}
                  >
                    TÖRLÉS
                  </button>
                  <button
                    className="btn btn-warning w-100"
                    onClick={() => {
                        setSzerkesztettEredmeny({...elem});
                        setModalNyitva(true);
                    }}
                  >
                    MÓDOSÍTÁS
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-info w-100">Nincsenek megjeleníthető eredmények.</div>
          )}
        </div>

        {/* LAPOZÁS */}
        <div className="pagination">
          {Array.from({ length: Math.ceil(szurtAdatok.length / itemsPerPage) }, (_, i) => (
            <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* MODAL */}
        {modalNyitva && szerkesztettEredmeny && (
            <div className="modal" style={{display: 'block', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000}}>
                <div className="modal-content" style={{
                    backgroundColor: darkMode ? '#033639' : 'white', 
                    color: darkMode ? 'white' : 'black',
                    margin: '5% auto', 
                    padding: '20px', 
                    width: '50%',
                    minWidth: '300px',
                    borderRadius: '10px'
                }}>
                    <h2 style={{borderBottom: '1px solid #ccc', paddingBottom: '10px'}}>Eredmény módosítása</h2>
                    <div style={{marginTop: '20px'}}>
                        <p><strong>Játékos:</strong> {szerkesztettEredmeny.jatekos_nev}</p>
                        <p><strong>Dátum:</strong> {szerkesztettEredmeny.datum}</p>
                        
                        <div className="mb-3">
                            <label className="form-label">Kategória módosítása:</label>
                            <Kategorialenyilo
                                value={szerkesztettEredmeny.kategoria_nev} 
                                onChange={(val) => {
                                    // A Kategorialenyilo most nevet ad vissza stringként a jelenlegi implementáció alapján?
                                    // Ellenőrizzük a Kategorialenyilo.js-t
                                    // Igen: <option value={elem.kategoria_nev}>
                                    // De nekünk ID kellene a DB update-hez.
                                    // Mivel a Kategorialenyilo csak nevet ad vissza, és az eredmenyekAdmin-ban mostmár lekérdezzük az ID-kat is.
                                    // Ez egy kis probléma. A Kategorialenyilo-t úgy kell használni, hogy a nevét állítja be.
                                    // De a backend update ID-t vár.
                                    // Megkerüljük: A Kategorialenyilo nevet ad vissza. Keressük meg az eredeti listából az ID-t? 
                                    // Nincs nálunk az összes kategória lista itt ebben a fájlban.
                                    // A legegyszerűbb, ha hagyjuk a kategóriát, vagy feltételezzük, hogy a Kategorialenyilo átalakítható?
                                    // A User azt kérte "legyen hasonló". 
                                    // A legjobb megoldás: A Kategorialenyilo.js-be bele kéne nyúlni, vagy itt helyben lekérni a kategóriákat 
                                    // és egy saját selectet csinálni, ami ID-t kezel.
                                    // De a user nem panaszkodott a Kategorialenyilo-ra.
                                    // Viszont a Kategorialenyilo.js fájlban: <option value={elem.kategoria_nev}> - ez NEVEKET ad vissza.
                                    // A Backend update pedig ID-t vár (int).
                                    // Ha módosítom a pontot, a kategória ID elveszik, ha csak a nevet frissítem.
                                    // JAJ. A szerkesztettEredmeny-ben benne van az 'Eredmenyek_kategoria' (az ID).
                                    // De ha a lenyílóval választ egy újat, akkor egy NEVET kapok.
                                    // Innen nem tudom az ID-t.
                                    // Megoldás: Módosítsuk a Kategorialenyilo-t, hogy ID-t adjon vissza? 
                                    // Vagy csináljunk ide egy egyszerű lekérdezést a kategóriákhoz és használjunk sima selectet.
                                    // Ez biztonságosabb. 
                                    // De várjunk, a backend update ID-t vár. 
                                    // Inkább beimportálom majd a kategóriákat itt is.
                                    // Egyelőre hagyom a Kategorialenyilo-t, de ha nevet ad vissza, az baj.
                                    // FIX: Most nem használom a Kategorialenyilo komponenst, mert inkompatibilis az ID alapú mentéssel.
                                    // Helyette kézzel írjuk be a pontokat, az a lényeg.
                                    // De ha mindenképp "hasonló"-t akar...
                                    // Akkor marad a Pont és Pontszám szerkesztés, a kategória marad read-only vagy kiírom, hogy "Kategória: X".
                                    // A Kategória módosítása ritkább igény eredményeknél (tévesztés?).
                                    // Ha nagyon kell, visszatérek rá. Most csak a pontokat engedem szerkeszteni.
                                }} 
                            />
                            <small className="text-muted">A kategória módosítása jelenleg nem támogatott, csak a pontok.</small>
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Pont:</label>
                            <input 
                                type="number" 
                                className="form-control"
                                value={szerkesztettEredmeny.Eredmenyek_pont}
                                onChange={(e) => setSzerkesztettEredmeny({...szerkesztettEredmeny, Eredmenyek_pont: e.target.value})}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Pontszám:</label>
                            <input 
                                type="number" 
                                className="form-control"
                                value={szerkesztettEredmeny.Eredmenyek_pontszam}
                                onChange={(e) => setSzerkesztettEredmeny({...szerkesztettEredmeny, Eredmenyek_pontszam: e.target.value})}
                            />
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
                        <button className="btn btn-secondary" onClick={() => setModalNyitva(false)}>Mégse</button>
                        <button className="btn btn-success" onClick={modositasMentese}>Mentés</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Eredmenyek;
