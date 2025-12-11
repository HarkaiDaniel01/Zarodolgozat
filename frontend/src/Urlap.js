import { useState } from "react"
import Cim from "./Cim"
const Urlap=({atkuld,frissit})=>{
    const [beSzoveg,setBeSzoveg]=useState("")
    const [beNev,setBeNev]=useState("")
    const [beDatum,setBeDatum]=useState(new Date().toLocaleDateString('en-CA').split("T")[0])  
    const [siker,setSiker]=useState(" ")
    const [helyes,setHelyes]=useState(true)
    
    const felvitel=async ()=>{
        //alert("meg lett nyomva")
        //alert(atkuld)
        if (beSzoveg==="" || beNev===""){
            setSiker("A bejegyzés szövegét és a becenevet kötelező megadni!!!")
            setHelyes(false)
            return
        }
        const bemenet={
            "bejegyzes_szoveg":beSzoveg,
            "bejegyzes_datum":beDatum,
            "bejegyzes_ki":beNev,
            "bejegyzes_jatekos":atkuld
        }
        try{
        const response=await fetch(Cim.Cim+"bejegyzesFelvitel",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bemenet)
            })
        const data=await response.json()
        //alert(JSON.stringify(data))
        if (response.ok){
            setSiker(data["message"])
            setHelyes(true)
            frissit(ertek=>!ertek)
            }
        else
            setSiker(data["error"])
        }
        catch (error){
            console.log(error)

        }
    }

    return(
        <div >
            <input 
                type="text" 
                placeholder="Írd be a bejegyzést..."
                onChange={(e)=>setBeSzoveg(e.target.value)}
            />
            <br />
            <input 
                type="date" 
                value={beDatum}
                onChange={(e)=>setBeDatum(e.target.value)}
                />
            <br />
            <input 
                type="text" 
                placeholder="Írd be a beceneved..."
                onChange={(e)=>setBeNev(e.target.value)}
            />
            <br />
            <button className="zoldGomb" onClick={felvitel}>Új bejegyzés felvitele</button>
            {helyes ? 
                <div style={{color:"green"}}>{siker} &nbsp;</div> 
                :  
                <div style={{color:"red"}}>{siker} &nbsp;</div> }
            
            {/*
            A szöveg: {beSzoveg}
            A nev: {beNev}
            A datum: {beDatum}
            */}
        </div>
    )
}
export default Urlap

