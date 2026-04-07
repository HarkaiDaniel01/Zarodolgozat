import { useState,useRef, useEffect } from "react"
import Cim from "../Cim"
import Kerdesek from "./Kerdesek"
import Swal from "sweetalert2"

const Kategoria=()=>{
    const [adatok,setAdatok]=useState([])
    const [tolt,setTolt]=useState(true)
    const [hiba,setHiba]=useState(false)
    const [kerdesek, setKerdesek] = useState([])
    const [kerdesekBetoltve, setKerdesekBetoltve] = useState(false)
    const [ikonok] = useState(["⚔️", "🌍", "📚", "🎵", "⚽", "🎄", "🎲", "🧠", "🐱‍👤", "🎮"])
    const [kategoria, setKategoria] = useState(0)
    const isFetching = useRef(false);
    const [kerdesLekeres, setKerdesLekeres] = useState(false)

    const kategoriaValaszt = async (kategoriaId, kategoriaNev) => {

        if (isFetching.current) return
        if (kerdesLekeres) return
        isFetching.current = true;
        setKerdesLekeres(true);

        try {

             if (kategoriaNev === "Vegyes") {
                await kategoriaValasztVegyes(kategoriaId)
            } else if (kategoriaNev === "Géniusz") {
                await kategoriaValasztNehez(kategoriaId)
            } else {
                setKategoria(kategoriaId)

                const [konnyu, kozepes, nehez] = await Promise.all([
                    KerdesekLetoltese(kategoriaId, "/kerdesekKonnyu"),
                    KerdesekLetoltese(kategoriaId, "/kerdesekKozepes"),
                    KerdesekLetoltese(kategoriaId, "/kerdesekNehez")
                ])

                /*const konnyu = await KerdesekLetoltese(kategoriaId, "/kerdesekKonnyu")
                const kozepes = await KerdesekLetoltese(kategoriaId, "/kerdesekKozepes")
                const nehez = await KerdesekLetoltese(kategoriaId, "/kerdesekNehez")*/

                const kerdesek = [...konnyu, ...kozepes, ...nehez]
                setKerdesek(kerdesek)

                setKerdesekBetoltve(true)
            } 

        } catch (error) {
            Swal.fire({
                title: `Hiba!`,
                html: error.message || `Adatbázis hiba!`,
                icon: `error`,
                confirmButtonText: `Rendben!`,
                });

        } finally {
            isFetching.current = false;
            setKerdesLekeres(false)
        }

    }

    const kategoriaValasztVegyes = async (kategoriaId) => {

            setKategoria(kategoriaId)

            const [konnyu, kozepes, nehez] = await Promise.all([
                    KerdesekLetolteseVegyes("/kerdesekKonnyuVegyes"),
                    KerdesekLetolteseVegyes("/kerdesekKozepesVegyes"),
                    KerdesekLetolteseVegyes("/kerdesekNehezVegyes")
            ])

            /*const konnyu = await KerdesekLetolteseVegyes("/kerdesekKonnyuVegyes")
            const kozepes = await KerdesekLetolteseVegyes("/kerdesekKozepesVegyes")
            const nehez = await KerdesekLetolteseVegyes("/kerdesekNehezVegyes")*/

            const kerdesek = [...konnyu, ...kozepes, ...nehez]
            setKerdesek(kerdesek)
            setKerdesekBetoltve(true)
    }

    const kategoriaValasztNehez= async (kategoriaId) => {

        setKategoria(kategoriaId)

        const response=await fetch(Cim.Cim+ `/nehezVegyes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })

        if (!response.ok){
              throw new Error("Szerver hiba!")  
        }  
            
        const data=await response.json()
        setKerdesek(data)
        setKerdesekBetoltve(true)

    }

    const KerdesekLetoltese= async(kategoriaId, vegpont)=>{

        let bemenet = {
            "kategoria" : kategoriaId
        }

        const response = await fetch(Cim.Cim+ vegpont, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bemenet)
        });

        if (!response.ok)
            {
                throw new Error(`Hálózati hiba: ${response.status}`)
            }

        const data=await response.json()
        return data
    }

    const KerdesekLetolteseVegyes= async(vegpont)=>{

        const response=await fetch(Cim.Cim+ vegpont, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })

        if (!response.ok)
            {
                throw new Error(`Hálozati hiba: ${response.status}`)
            }

        const data=await response.json()
        return data
    }

    const leToltes=async ()=>{
        try{
            const response=await fetch(Cim.Cim + "/kategoria")
            const data=await response.json()

            if (response.ok)
                {
                    setAdatok(data)
                    setTolt(false)
                }
            else 
                {
                    setHiba(true)
                    setTolt(false)
                }
            }
        catch (error){
            console.log(error)
            setTolt(false)
            setHiba(true)
        }
        
    }

    useEffect(()=>{
        leToltes()
    }, [])

    if (tolt)
        return (
            <div className="doboz"><p className="figyelmeztetes">Adatok betöltése folyamatban...</p></div>
                )
    else if (hiba)
        return (
            <div className="doboz"><p className="figyelmeztetes">Hiba</p></div>
                )       
    else return (

        <div>
            
        {!kerdesekBetoltve ? (<div className="doboz" style={{marginTop:"40px", marginBottom:"40px"}} >
                
                <h1>A Tudás Torna!</h1>
                <h2>Válassz kategóriát!</h2>
                <div className="gombDoboz">
                {adatok.map((elem,index)=>(
                    
                        <button key={index} disabled={kerdesLekeres} className="kategoriaGomb" onClick={() => kategoriaValaszt(elem.kategoria_id, elem.kategoria_nev)}>{index < ikonok.length ? ikonok[index] : "❔"} {elem.kategoria_nev}</button>
                    
                ))} 

                </div>

                <p className="figyelmeztetes"><b>Figyelem</b>: a játékban lévő nyeremények <b>csak játékpénz</b>ben értendők, valódi pénzt nem lehet nyerni!</p>

            </div>) : <Kerdesek kerdesek={kerdesek} kategoria={kategoria} kerdesekBetoltve = {setKerdesekBetoltve}/>}

        </div>
    )
}
export default Kategoria