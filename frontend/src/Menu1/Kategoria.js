import { useState,useEffect } from "react"
import Cim from "../Cim"
import Kerdesek from "./Kerdesek"
//import Swal from "sweetalert2"

const Kategoria=()=>{
    const [adatok,setAdatok]=useState([])
    const [tolt,setTolt]=useState(true)
    const [hiba,setHiba]=useState(false)
    const [kerdesek, setKerdesek] = useState([])
    const [kerdesekBetoltve, setKerdesekBetoltve] = useState(false)
    const [ikonok] = useState(["⚔️", "🌍", "📚", "🎵", "⚽", "🎄", "🎲", "🧠", "🐱‍👤", "🎮"])
    const [kategoria, setKategoria] = useState(0)

 
    const kategoriaValaszt = async (kategoriaId, kategoriaNev) => {
        //alert(`Választott kategória: ${kategoriaId}`)

        if (kategoriaNev === "Vegyes") {
            kategoriaValasztVegyes(kategoriaId)
        } else if (kategoriaNev === "Géniusz") {
            kategoriaValasztNehez(kategoriaId)
        } else {
            setKategoria(kategoriaId)

            const konnyu = await KerdesekLetoltese(kategoriaId, "/kerdesekKonnyu")
            const kozepes = await KerdesekLetoltese(kategoriaId, "/kerdesekKozepes")
            const nehez = await KerdesekLetoltese(kategoriaId, "/kerdesekNehez")

            const kerdesek = [...konnyu, ...kozepes, ...nehez]
            setKerdesek(kerdesek)


            /*{kerdesek.map((elem,index)=>(
                        alert(`${elem.kerdesek_nehezseg} ${elem.kerdesek_kerdes}\n
                            A: ${elem.kerdesek_helyesValasz}\n
                            B: ${elem.kerdesek_helytelenValasz1}\n
                            c: ${elem.kerdesek_helytelenValasz2}\n
                            D: ${elem.kerdesek_helytelenValasz3}`)
                    ))}*/


        
            setKerdesekBetoltve(true)
        
        }
    }

    /*const fejlesztesAlatt = () => {
        
        Swal.fire({
              title: `Fejlesztés alatt`,
              html: ``,
              icon: `info`,
              confirmButtonText: `Oké`
            });
        

    }*/

    const kategoriaValasztVegyes = async (kategoriaId) => {
        //alert(`Választott kategória: ${kategoriaId}`)

        setKategoria(kategoriaId)
        const konnyu = await KerdesekLetolteseVegyes("/kerdesekKonnyuVegyes")
        const kozepes = await KerdesekLetolteseVegyes("/kerdesekKozepesVegyes")
        const nehez = await KerdesekLetolteseVegyes("/kerdesekNehezVegyes")

        const kerdesek = [...konnyu, ...kozepes, ...nehez]
        setKerdesek(kerdesek)


        /*{kerdesek.map((elem,index)=>(
                        alert(`${elem.kerdesek_nehezseg} ${elem.kerdesek_kerdes}\n
                            A: ${elem.kerdesek_helyesValasz}\n
                            B: ${elem.kerdesek_helytelenValasz1}\n
                            c: ${elem.kerdesek_helytelenValasz2}\n
                            D: ${elem.kerdesek_helytelenValasz3}`)
                    ))}*/


        
        setKerdesekBetoltve(true)
        
        

    }

    const kategoriaValasztNehez= async (kategoriaId) => {

        setKategoria(kategoriaId)

        try{

            const response=await fetch(Cim.Cim+ `/nehezVegyes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            })

            const data=await response.json()
            //alert(JSON.stringify(data))
            //console.log(data)
            if (response.ok)
                {
                    
                

                    setKerdesek(data)
                    setKerdesekBetoltve(true)

                    
                }

                    
            else 
                {
                    
                }
            }
            
        catch (error){
            console.log(error)
            
        }
 
        
    
    }

    const KerdesekLetoltese= async(kategoriaId, vegpont)=>{

        try{

            let bemenet = {
                "kategoria" : kategoriaId
            }

            const response=await fetch(Cim.Cim+ vegpont, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bemenet)
            })

            const data=await response.json()
            //alert(JSON.stringify(data))
            //console.log(data)
            if (response.ok)
                {
                    
                    /*{data.map((elem,index)=>(
                        alert(`${elem.kerdesek_nehezseg} ${elem.kerdesek_kerdes}\n
                            A: ${elem.kerdesek_helyesValasz}\n
                            B: ${elem.kerdesek_helytelenValasz1}\n
                            c: ${elem.kerdesek_helytelenValasz2}\n
                            D: ${elem.kerdesek_helytelenValasz3}`)
                    ))}*/

                    return data

                    //if (vegpont === "/kerdesekKonnyu") KerdesekLetoltese(kategoriaId, "/kerdesekKozepes")
                    //if (vegpont === "/kerdesekKozepes") KerdesekLetoltese(kategoriaId, "/kerdesekNehez")
                    
                    }

                    
            else 
                {
                    
                }
            }
            
        catch (error){
            console.log(error)
            
        }
    }

    const KerdesekLetolteseVegyes= async(vegpont)=>{

        try{

            const response=await fetch(Cim.Cim+ vegpont, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            })

            const data=await response.json()
            //alert(JSON.stringify(data))
            //console.log(data)
            if (response.ok)
                {
                    
                    /*{data.map((elem,index)=>(
                        alert(`${elem.kerdesek_nehezseg} ${elem.kerdesek_kerdes}\n
                            A: ${elem.kerdesek_helyesValasz}\n
                            B: ${elem.kerdesek_helytelenValasz1}\n
                            c: ${elem.kerdesek_helytelenValasz2}\n
                            D: ${elem.kerdesek_helytelenValasz3}`)
                    ))}*/

                    return data

                    //if (vegpont === "/kerdesekKonnyu") KerdesekLetoltese(kategoriaId, "/kerdesekKozepes")
                    //if (vegpont === "/kerdesekKozepes") KerdesekLetoltese(kategoriaId, "/kerdesekNehez")
                    
                    }

                    
            else 
                {
                    
                }
            }
            
        catch (error){
            console.log(error)
            
        }
    }




    const leToltes=async ()=>{
        try{
            const response=await fetch(Cim.Cim + "/kategoria")
            const data=await response.json()
            //alert(JSON.stringify(data))
            //console.log(data)
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
            setHiba(true)
        }
        
    }

    useEffect(()=>{
        leToltes()
    }, [])

    if (tolt)
        return (
            <div style={{textAlign:"center"}}>Adatok betöltése folyamatban...</div>
                )
    else if (hiba)
        return (
            <div>Hiba</div>
                )       
    
    else return (


        <div>
            
        {!kerdesekBetoltve ? (<div className="doboz" style={{marginTop:"40px", marginBottom:"40px"}} >

                <h1>Legyen Ön is Szoftverfejlesztő!</h1>
                <h2>Válassz kategóriát!</h2>
                <div className="gombDoboz">
                {adatok.map((elem,index)=>(
                    
                        <button key={index} className="kategoriaGomb" onClick={() => kategoriaValaszt(elem.kategoria_id, elem.kategoria_nev)}>{ikonok[index]} {elem.kategoria_nev}</button>
                    
                ))}

                {/*<button className="gomb" onClick={() => kategoriaValasztVegyes()}>{ikonok[6]} Vegyes</button>
                <button className="gomb" onClick={() => kategoriaValasztNehez()}>{ikonok[7]} Géniusz</button>*/}
                    {/*<button className="kategoriaGomb">Programozás</button>
                    <button className="kategoriaGomb">Környezetvédelem</button>
                    <button className="kategoriaGomb">Informatika</button>
                    <button className="kategoriaGomb">Videójátékok</button>
                    <button className="kategoriaGomb">Időfutam</button>
                    <button className="kategoriaGomb">Tudomány</button>
                    <button className="kategoriaGomb">Filmek</button>
                    <button className="kategoriaGomb">Matematika</button>
                    <button className="kategoriaGomb">Logikai rejtvények</button>
                    <button className="kategoriaGomb">Honismeret</button>*/}
                </div>

                

            </div>) : <Kerdesek kerdesek={kerdesek} kategoria={kategoria} kerdesekBetoltve = {setKerdesekBetoltve}/>}

            
        
            
            

            


            
            



        </div>
    )
}
export default Kategoria