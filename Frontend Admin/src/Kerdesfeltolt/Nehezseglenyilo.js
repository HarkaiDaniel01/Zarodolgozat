import { useState, useEffect } from "react";
import Cim from "../Cim";

const Nehezseglenyilo = ({ value, onChange }) => {
  const [adatok, setAdatok] = useState([]);
  const [status, setStatus] = useState("tolt");

  useEffect(() => {
    const leToltes = async () => {
      try {
        const response = await fetch(`${Cim.Cim}/nehezseg`);
        if (!response.ok) throw new Error("Hiba a betöltés során");

        const data = await response.json();
        setAdatok(data);

        setStatus("kesz");
      } catch (error) {
        console.error(error);
        setStatus("hiba");
      }
    };

    leToltes();
  }, []);

  if (status === "tolt") return <div>Adatok betöltése...</div>;
  if (status === "hiba") return <div>Hiba történt az adatok betöltésekor.</div>;

  return (
    <select
      className="lenyilo"
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
    >
        <option value="">-- Válassz nehézzséget --</option>
      {adatok.map((elem) => (
        <option key={elem.nehezseg_id} value={elem.nehezseg_id}>
          {elem.nehezseg_szint}
        </option>
      ))}
    </select>
  );
};

export default Nehezseglenyilo;
