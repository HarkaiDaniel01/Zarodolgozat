import { useState, useEffect } from "react";
import Cim from "../Cim";

const Kategoriaalapjankeres = ({ value, onChange }) => {
  const [adatok, setAdatok] = useState([]);
  const [status, setStatus] = useState("tolt");
  const [hiba, setHiba] = useState(null);
  useEffect(() => {
    const leToltes = async () => {
      try {
        const response = await fetch(`${Cim.Cim}/kategoria`);
        if (!response.ok) throw new Error(`Hiba: ${response.status} ${response.statusText}`);
        const data = await response.json();
        setAdatok(data);
        setStatus("kesz");
      } catch (error) {
        setHiba(error.message);
        setStatus("hiba");
      }
    };
    leToltes();
  }, []);
  
  if (status === "tolt") return <div>Adatok betöltése...</div>;
  if (status === "hiba") return <div style={{ color: "red" }}>{hiba}</div>;

  return (
    <select
      className="lenyilo"
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value="">-- Válassz kategóriát --</option>
      {adatok.map((elem) => (
        <option key={elem.kategoria_id} value={elem.kategoria_nev}>
          {elem.kategoria_nev}
        </option>
      ))}
    </select>
  );
};

export default Kategoriaalapjankeres;