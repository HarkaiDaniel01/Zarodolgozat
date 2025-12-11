import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Cim from "../Cim";

const Kategoriafeltolt = () => {
  const [kategoria, setKategoria] = useState("");
  const [tolt, setTolt] = useState(true);
  const [hiba, setHiba] = useState(false);
  const [siker, setSiker] = useState(false);
  const [adatok, setAdatok] = useState([]);

  const [modalNyitva, setModalNyitva] = useState(false);
  const [szerkesztettKerdes, setSzerkesztettKerdes] = useState({});

  const leToltes = async () => {
    try {
      const response = await fetch(Cim.Cim + "/kategoria");
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
    <div style={{
      background: 'linear-gradient(135deg, #00A21D 0%, #FFEA64 50%, #FFC0CB 100%)',
      minHeight: '100vh',
      padding: '2rem',
      borderRadius:'15px',
    }}>
      <div className="felvitel" style={{ maxWidth: '1400px',minWidth:'400px', margin: '0 auto' }}>
        <h1>Kategória kezelése</h1>

      <div className="kategoria-form" style={{
      background: 'linear-gradient(135deg, #00A21D 0%, #FFEA64 50%)',
      minHeight: '1vh',
      padding: '2rem',
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

      <h2>Kategóriák listája</h2>
      <div className="tabla-container" style={{ maxWidth: '1000px',minWidth:'400px', margin: '0 auto' }}>
        <table className="kategoria-tabla">
          <thead>
            <tr>
              <th className="kategoriafejlec">Kategória név</th>
              <th className="kategoriafejlec">Módosítás</th>
              <th className="kategoriafejlec">Törlés</th>
            </tr>
          </thead>
          <tbody>
            {adatok.map((elem) => (
              <tr key={elem.kategoria_id}>
                <td>{elem.kategoria_nev}</td>
                <td>
                  <button
                    className="btn btn-warning w-100"
                    onClick={() => {
                      setSzerkesztettKerdes(elem);
                      setModalNyitva(true);
                    }}
                  >
                    MÓDOSÍTÁS
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger w-100"
                    onClick={() =>
                      torlesFuggveny(elem.kategoria_id, elem.kategoria_nev)
                    }
                  >
                    TÖRLÉS
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
  );
};

export default Kategoriafeltolt;
