import { useState,useEffect } from "react"
import Cim from "./Cim"

const BejegyzesLista=({frissit})=>{
    const [adatok,setAdatok]=useState([])
    const [tolt,setTolt]=useState(true)
    const [hiba,setHiba]=useState(false)
    const [rendezes,setRendezes]=useState(0)

    const novekvoKattint=()=>{
        //alert("Hello")
        setRendezes(0)
    }

    const csokkenoKattint=()=>{
        //alert("Hello")
        setRendezes(1)
    }
    const leToltes=async ()=>{
        try{
            let response=[]
            if (rendezes===0)
                response=await fetch(Cim.Cim+"bejegyzes")
            else if (rendezes===1)
                response=await fetch(Cim.Cim+"bejegyzesCsokk")
            const data=await response.json()
            //alert(JSON.stringify(data))
            console.log(data)
            if (response.ok)
                {
                    setAdatok(data)
                    setTolt(false)
                    //frissit(false)
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
    },[frissit,rendezes])

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
            <h2>Hírek a tenisz világából</h2>
            <div style={{textAlign:"center"}}>
                <img onClick={novekvoKattint} className="gombok" src="/down.jpg" alt="növekvőbe rendezés" />
                <img onClick={csokkenoKattint} className="gombok" src="/up.jpg" alt="csökkenőbe rendezés" />
            </div>
            <div>
                {adatok.map((elem,index)=>(
                    <div key={index} className="kartya">
                        <span>{index+1}</span>
                        <div className="nev">{elem.jatekos_nev}</div>
                        <div className="szoveg">{elem.bejegyzes_szoveg}</div>
                        <div className="datum">Dátum: {new Date(elem.bejegyzes_datum).toLocaleDateString('en-CA').split("T")[0]}</div>
                        <div className="ki">Feltöltötte:{elem.bejegyzes_ki}</div>
                        

                        </div>
                ))}
            </div>
        </div>
    )
}
export default BejegyzesLista
