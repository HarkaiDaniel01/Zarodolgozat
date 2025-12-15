import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Cim from "../Cim";
import "../App.css";
import Kategorialenyilo from "./Kategorialenyilo";
import Nehezseglenyilo from "./Nehezseglenyilo";
import Kategoriaalapjankeres from "./Kategoriaalapjankeres";
import Nehezsegalapjankeres from "./Nehezsegalapjankeres";

const Kerdesfeltolt = () => {
  // Kérdés adatainak state-je
  const [kerdesek_kerdes, setKerdes] = useState("");
  const [kerdesek_helyesValasz, setHelyesValasz] = useState("");
  const [kerdesek_helytelenValasz1, setHelytelen1] = useState("");
  const [kerdesek_helytelenValasz2, setHelytelen2] = useState("");
  const [kerdesek_helytelenValasz3, setHelytelen3] = useState("");
  const [kerdesek_leiras, setKerdesek_leiras] = useState("");

  // Dinamikus adatok a lenyílókhoz
  const [kategoriak, setKategoriak] = useState([]);
  const [nehezsegek, setNehezsegek] = useState([]);

  // Kiválasztott értékek
  const [kategoriaKivalasztott, setKategoriaKivalasztott] = useState("");
  const [nehezsegKivalasztott, setNehezsegKivalasztott] = useState("");

  // További UI state
  const [modalNyitva, setModalNyitva] = useState(false);
  const [szerkesztettKerdes, setSzerkesztettKerdes] = useState(null);
  const [tolt, setTolt] = useState(true);
  const [hiba, setHiba] = useState(false);
  const [siker, setSiker] = useState(false);
  const [szurtAdatok, setSzurtAdatok] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // ADATOK BETÖLTÉSE
  useEffect(() => {
    const betoltes = async () => {
      try {
        // Kérdések
        const resKerdes = await fetch(Cim.Cim + "/kerdes");
        const dataKerdes = await resKerdes.json();
        setSzurtAdatok(dataKerdes);

        // Kategóriák
        const resKategoria = await fetch(Cim.Cim + "/kategoria");
        const dataKategoria = await resKategoria.json();
        setKategoriak(dataKategoria);

        // Nehézség
        const resNehezseg = await fetch(Cim.Cim + "/nehezseg");
        const dataNehezseg = await resNehezseg.json();
        setNehezsegek(dataNehezseg);

        setTolt(false);
      } catch (err) {
        console.error(err);
        setHiba(true);
        setTolt(false);
      }
    };
    betoltes();
    
    // Dark mode ellenőrzés
    const checkDarkMode = () => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    };
    
    checkDarkMode();
    window.addEventListener('darkModeChanged', checkDarkMode);
    
    return () => window.removeEventListener('darkModeChanged', checkDarkMode);
  }, [siker]);

  // KÉRDÉS FELVITELE
  const felvitelFuggveny = async (e) => {
    e.preventDefault();

    const response = await fetch(Cim.Cim + "/kerdesFeltoltes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kerdesek_kerdes,
        kerdesek_helyesValasz,
        kerdesek_helytelenValasz1,
        kerdesek_helytelenValasz2,
        kerdesek_helytelenValasz3,
        kerdesek_kategoria: kategoriaKivalasztott,
        kerdesek_leiras,
        kerdesek_nehezseg: nehezsegKivalasztott,
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
      setKerdes("");
      setHelyesValasz("");
      setHelytelen1("");
      setHelytelen2("");
      setHelytelen3("");
      setKerdesek_leiras("");
      setKategoriaKivalasztott("");
      setNehezsegKivalasztott("");
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

  // TÖRLÉS
  const torlesFuggveny = async (kerdesek_id, kerdes) => {
    const result = await Swal.fire({
      title: 'Kérdés törlése',
      text: `Biztosan törlöd a(z) "${kerdes}" kérdést?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#00A21D',
      confirmButtonText: 'Igen, törlöm',
      cancelButtonText: 'Mégse'
    });
    
    if (!result.isConfirmed) return;

    const response = await fetch(Cim.Cim + "/kerdesTorles/" + kerdesek_id, {
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

  // MÓDOSÍTÁS
  const modositFuggveny = async () => {
    const result = await Swal.fire({
      title: 'Kérdés módosítása',
      text: `Biztosan módosítod a(z) "${szerkesztettKerdes.kerdesek_kerdes}" kérdést?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#00A21D',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Igen, módosítom',
      cancelButtonText: 'Mégse'
    });
    
    if (!result.isConfirmed) return;

    const response = await fetch(
      Cim.Cim + "/kerdesModositasa/" + szerkesztettKerdes.kerdesek_id,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

  // SZŰRÉS GOMBNYOMÁSRA
  const szuresFuggveny = async () => {
  try {
    const res = await fetch(`${Cim.Cim}/kerdesekkeres`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kategoria_nev: kategoriaKivalasztott,
        nehezseg_szint: nehezsegKivalasztott,
      }),
    });
    const data = await res.json();
    setSzurtAdatok(data);
  } catch (err) {
    console.error(err);
  }
};

  if (tolt) return <div style={{ textAlign: "center" }}>Adatok betöltése...</div>;
  if (hiba) return <div>Hiba történt az adatok betöltése során.</div>;

  return (
    <div style={{
      background: darkMode ? 'linear-gradient(135deg, #4CAF50, #8B4513)' : 'linear-gradient(135deg, #00A21D 0%, #FFEA64 50%, #FFC0CB 100%)',
      minHeight: '100vh',
      padding: '2rem',
      borderRadius:'15px',
    }}>
      <div className="felvitel">
        <h1>Kérem adja meg a felvinni kívánt kérdés adatait!</h1>

      {/* FELVITEL */}
      <form className="forms" onSubmit={felvitelFuggveny}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label>Kérdés neve:</label>
                <input
                  type="text"
                  className="form-control"
                  value={kerdesek_kerdes}
                  onChange={(e) => setKerdes(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Helyes válasz:</label>
                <input
                  type="text"
                  className="form-control"
                  value={kerdesek_helyesValasz}
                  onChange={(e) => setHelyesValasz(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Kategória:</label>
                <Kategorialenyilo
                  value={kategoriaKivalasztott}
                  onChange={(ertek) => setKategoriaKivalasztott(ertek)}
                />
              </div>
              <div className="mb-3">
                <label>Nehézség:</label>
                <Nehezseglenyilo
                  value={nehezsegKivalasztott}
                  onChange={(ertek) => setNehezsegKivalasztott(ertek)}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label>Helytelen válasz 1:</label>
                <input
                  type="text"
                  className="form-control"
                  value={kerdesek_helytelenValasz1}
                  onChange={(e) => setHelytelen1(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Helytelen válasz 2:</label>
                <input
                  type="text"
                  className="form-control"
                  value={kerdesek_helytelenValasz2}
                  onChange={(e) => setHelytelen2(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Helytelen válasz 3:</label>
                <input
                  type="text"
                  className="form-control"
                  value={kerdesek_helytelenValasz3}
                  onChange={(e) => setHelytelen3(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Kérdés leírás:</label>
                <input
                  type="text"
                  className="form-control"
                  value={kerdesek_leiras}
                  onChange={(e) => setKerdesek_leiras(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button type="submit" className="gomb btn btn-success">
              Hozzáadás
            </button>
          </div>
        </div>
      </form>

      <hr />

      {/* SZŰRÉS */}
      <div className="szures-container">
        <h2>Kérdés lista</h2>
        <div className="szures-controls">
          <div className="szuro-elem">
            <label>Kategória alapján:</label>
            <Kategoriaalapjankeres
              value={kategoriaKivalasztott}
              onChange={(ertek) => setKategoriaKivalasztott(ertek)}
            />
          </div>
          <div className="szuro-elem">
            <label>Nehézség alapján:</label>
            <Nehezsegalapjankeres
              value={nehezsegKivalasztott}
              onChange={(ertek) => setNehezsegKivalasztott(ertek)}
            />
          </div>
          <button className="gombszures btn btn-primary" onClick={szuresFuggveny}>
            Szűrés
          </button>
        </div>
      </div>

      {/* LISTA */}
      <div className="row">
        <div className="col-12">
          <div className="tabla-container">
            <table className="kerdes-tabla">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Kérdés</th>
                  <th>A</th>
                  <th>B</th>
                  <th>C</th>
                  <th>D</th>
                  <th>Kategória</th>
                  <th>Leírás</th>
                  <th>Nehézség</th>
                  <th>Törlés</th>
                  <th>Módosítás</th>
                </tr>
              </thead>
              <tbody>
                {szurtAdatok.map((elem) => (
                  <tr key={elem.kerdesek_id}>
                    <td data-label="Id">{elem.kerdesek_id}</td>
                    <td data-label="Kérdés">{elem.kerdesek_kerdes}</td>
                    <td data-label="A">{elem.kerdesek_helyesValasz}</td>
                    <td data-label="B">{elem.kerdesek_helytelenValasz1}</td>
                    <td data-label="C">{elem.kerdesek_helytelenValasz2}</td>
                    <td data-label="D">{elem.kerdesek_helytelenValasz3}</td>
                    <td data-label="Kategória">{elem.kategoria_nev}</td>
                    <td data-label="Leírás">{elem.kerdesek_leiras}</td>
                    <td data-label="Nehézség">{elem.nehezseg_szint}</td>
                    <td data-label="Törlés">
                      <button
                        className="btn btn-danger w-100"
                        onClick={() =>
                          torlesFuggveny(elem.kerdesek_id, elem.kerdesek_kerdes)
                        }
                      >
                        TÖRLÉS
                      </button>
                    </td>
                    <td data-label="Módosítás">
                      <button
                        className="btn btn-warning w-100"
                        onClick={() => {
                          // Megkeressük a kategória ID-t a név alapján
                          const kategoriaObj = kategoriak.find(k => k.kategoria_nev === elem.kategoria_nev);
                          const nehezsegObj = nehezsegek.find(n => n.nehezseg_szint === elem.nehezseg_szint);
                          
                          setSzerkesztettKerdes({
                            ...elem,
                            kerdesek_kategoria: kategoriaObj ? kategoriaObj.kategoria_id : "",
                            kerdesek_nehezseg: nehezsegObj ? nehezsegObj.nehezseg_id : ""
                          });
                          setModalNyitva(true);
                        }}
                      >
                        MÓDOSÍTÁS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalNyitva && szerkesztettKerdes && (
        <div className="modal">
          <div className="modal-content">
            <h2>Kérdés módosítása</h2>

            <label>Kérdés:</label>
            <input
              type="text"
              value={szerkesztettKerdes.kerdesek_kerdes}
              onChange={(e) =>
                setSzerkesztettKerdes({
                  ...szerkesztettKerdes,
                  kerdesek_kerdes: e.target.value,
                })
              }
            />

            <label>Helyes válasz:</label>
            <input
              type="text"
              value={szerkesztettKerdes.kerdesek_helyesValasz}
              onChange={(e) =>
                setSzerkesztettKerdes({
                  ...szerkesztettKerdes,
                  kerdesek_helyesValasz: e.target.value,
                })
              }
            />

            <label>Helytelen válasz 1:</label>
            <input
              type="text"
              value={szerkesztettKerdes.kerdesek_helytelenValasz1}
              onChange={(e) =>
                setSzerkesztettKerdes({
                  ...szerkesztettKerdes,
                  kerdesek_helytelenValasz1: e.target.value,
                })
              }
            />

            <label>Helytelen válasz 2:</label>
            <input
              type="text"
              value={szerkesztettKerdes.kerdesek_helytelenValasz2}
              onChange={(e) =>
                setSzerkesztettKerdes({
                  ...szerkesztettKerdes,
                  kerdesek_helytelenValasz2: e.target.value,
                })
              }
            />

            <label>Helytelen válasz 3:</label>
            <input
              type="text"
              value={szerkesztettKerdes.kerdesek_helytelenValasz3}
              onChange={(e) =>
                setSzerkesztettKerdes({
                  ...szerkesztettKerdes,
                  kerdesek_helytelenValasz3: e.target.value,
                })
              }
            />

            <label>Kategória:</label>
            <Kategorialenyilo
              value={szerkesztettKerdes.kerdesek_kategoria}
              onChange={(ertek) =>
                setSzerkesztettKerdes({
                  ...szerkesztettKerdes,
                  kerdesek_kategoria: Number(ertek),
                })
              }
            />

            <label>Leírás:</label>
            <input
              type="text"
              value={szerkesztettKerdes.kerdesek_leiras}
              onChange={(e) =>
                setSzerkesztettKerdes({
                  ...szerkesztettKerdes,
                  kerdesek_leiras: e.target.value,
                })
              }
            />

            <label>Nehézség:</label>
            <Nehezseglenyilo
              value={szerkesztettKerdes.kerdesek_nehezseg}
              onChange={(ertek) =>
                setSzerkesztettKerdes({
                  ...szerkesztettKerdes,
                  kerdesek_nehezseg: Number(ertek),
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
  );
};

export default Kerdesfeltolt;
