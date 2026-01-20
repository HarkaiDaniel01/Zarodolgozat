import { useEffect, useState } from "react";
import Cim from "./Cim";
import React from "react";
import MyPlot from "./MyPlot";
import { data } from "react-router-dom";
import Lenyilo from "./Lenyilo";
//import { useNavigate } from "react-router-dom";

const Statisztika = () => {

    const [jatekosId, setJatekosId] = useState(null);
    const [adatok,setAdatok]=useState([])

    const [tolt,setTolt]=useState(true)
    const [hiba,setHiba]=useState(false)

    const [jatekosNev, setJatekosNev] = useState()

    const [kivalasztott,setKivalasztott]=useState(1)

    const [eredmenyek, setEredmenyek] = useState([])
    const [szamok, setSzamok] = useState([1, 2, 3])

    //const navigate = useNavigate();

    const leToltes=async ()=>{
            
            if (jatekosId != null) {
                try{
            
                        let bemenet = {
                            "jatekosId" : jatekosId,
                            "kategoriaId" : kivalasztott
                        }
            
                        const response=await fetch(Cim.Cim+ "/eredmenyekKategoriankent", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(bemenet)
                        })

            
                        const data=await response.json()
                        if (response.ok)
                            {   

                                setAdatok(data)
                                
                                const eredmenyTomb = data.map(sor => sor.Eredmenyek_pont)
                                
                                while (eredmenyTomb.length < 3) {
                                    eredmenyTomb.push(0)
                                }

                                const otEredmeny = eredmenyTomb.slice(-5)
                                
                                const szamTomb = Array.from({length: otEredmeny.length}, (_, i) => i + 1)
                                setEredmenyek(otEredmeny)
                                setSzamok(szamTomb)



                                setTolt(false)
                                
                            }
            
                        else {
                            setHiba(true)
                            setTolt(false)
                        }
                        
                } catch (error){
                    console.log(error)
                    setHiba(true)
                }
            }

        
            
        }
   

        const nevBetolt=async ()=>{
            
            if (jatekosId != null) {
                try{
            
                        let bemenet = {
                            "jatekosId" : jatekosId
                        }
            
                        const response=await fetch(Cim.Cim+ "/jatekos", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(bemenet)
                        })
            
                        const data=await response.json()
                        if (response.ok)
                            {
                                

                                setJatekosNev(data[0].jatekos_nev)
                                
                            }
            
                        
                } catch (error){
                    console.log(error)
                    setHiba(true)
                }
            }
        }


        

    
    useEffect(()=>{
        const jatekos = localStorage.getItem("userid")
        setJatekosId(jatekos)

    },[])

    useEffect(()=>{
        nevBetolt()
        leToltes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[jatekosId, kivalasztott])


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
            <div className="doboz">
                <h1>{`Üdvözöllek ${jatekosNev}!`}</h1>

                <h4 style={{marginTop : "30px"}}>Statisztika:</h4>

                <div style={{textAlign: "center"}}>
                    <Lenyilo kivalasztott={setKivalasztott}/>
                </div>
                <div className="grafikon">
                    <MyPlot datum={szamok} eredmeny={eredmenyek} cim={"Eredmények témakörönként"}/>
                </div>
            </div>

        </div>
        


    )
}

export default Statisztika