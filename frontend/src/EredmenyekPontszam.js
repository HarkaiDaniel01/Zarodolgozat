import { useEffect, useState } from "react";
import Cim from "./Cim";
import React from "react";
import MyPlot from "./MyPlot";
import { data } from "react-router-dom";
//import { useNavigate } from "react-router-dom";

const EredmenyekPontszam = () => {

    const [jatekosId, setJatekosId] = useState(null);
    const [adatok,setAdatok]=useState([])

    const [tolt,setTolt]=useState(true)
    const [hiba,setHiba]=useState(false)

    const [grafikonTolt,setGrafikonTolt]=useState(true)
    const [grafikonHiba,setGrafikonHiba]=useState(false)

    const [osszEredmenyTolt,setOsszEredmenyTolt]=useState(true)
    const [OsszEredmenyHiba,setOsszEredmenyHiba]=useState(false)



    const [jatekosNev, setJatekosNev] = useState()
    const [osszes, setOsszes] = useState(0)
    const [datumokTomb, setDatumokTomb] = useState([])
    const [eredmenyekTomb, setEredmenyekTomb] = useState([])

    //const navigate = useNavigate();

    const leToltes=async ()=>{
            
            if (jatekosId != null) {
                try{
            
                        let bemenet = {
                            "jatekosId" : jatekosId
                        }
            
                        const response=await fetch(Cim.Cim+ "/eredmenyekPontszam", {
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

        const EredmenyekNaponkentleToltes=async ()=>{
            
            if (jatekosId != null) {
                try{
            
                        let bemenet = {
                            "jatekosId" : jatekosId
                        }
            
                        const response=await fetch(Cim.Cim+ "/pontszamokNaponkent", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(bemenet)
                        })

            
                        const data=await response.json()
                        if (response.ok)
                            {   

                                const datumTomb = data.map(sor => sor.nap)
                                const eredmenyTomb = data.map(sor => sor.eredmeny)
                                const utolsoHetDatum = datumTomb.slice(-5).map(d => d.toString().split('T')[0])
                                const utolsoHetEredmeny = eredmenyTomb.slice(-5)
                                const ujEredmenyekTomb = []
                                //alert(data.map(sor => sor.nap))

                                const ma = new Date()
                                const datumok = []

                                setDatumokTomb(utolsoHetDatum)
                                setEredmenyekTomb(utolsoHetEredmeny)

                                setGrafikonTolt(false)
                                
                            }
            
                        else {
                            setGrafikonHiba(true)
                            setGrafikonTolt(false)
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

        const osszPontszamBetolt=async ()=>{
            
            if (jatekosId != null) {
                try{
            
                        let bemenet = {
                            "jatekosId" : jatekosId
                        }
            
                        const response=await fetch(Cim.Cim+ "/osszesPontszam", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(bemenet)
                        })
            
                        const data=await response.json()
                        if (response.ok)
                            {
                                console.log(osszes)
                                if (data[0].ossz !== undefined && data[0].ossz !== null && data[0].ossz !== 0) setOsszes(data[0].ossz)
                                    else setOsszes(0) 
                                setOsszEredmenyTolt(false)
                            }

                        else {
                            setOsszEredmenyHiba(true)
                            setOsszEredmenyTolt(false)
                        }
            
                        
                } catch (error){
                    console.log(error)
                    setHiba(true)
                }
            }

            
            
        }

        const eredmenyTorles = async (eredmeny_id) => {

            const biztos=window.confirm(`Biztosan törölni szeretnéd az erdményt?`)
            if (biztos){
            //alert("Jó")
                const response=await fetch(Cim.Cim+"/eredmenyTorles/"+eredmeny_id,{
                    method: "delete",
                    headers: {
                        "Content-Type": "application/json"
                            }
                   })
                const data=await response.json()
                if (response.ok){
                    alert(data["message"])
                }
                else{
                    alert(data["error"])
                }
            }

            leToltes();
            osszPontszamBetolt();



        }

    
    useEffect(()=>{
        const jatekos = localStorage.getItem("userid")
        setJatekosId(jatekos)

    },[])

    useEffect(()=>{
        nevBetolt()
        leToltes()
        osszPontszamBetolt()
        EredmenyekNaponkentleToltes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[jatekosId])


    if (tolt || grafikonTolt || osszEredmenyTolt)
        return (
            <div style={{textAlign:"center"}}>Adatok betöltése folyamatban...</div>
                )
    else if (hiba || grafikonHiba || OsszEredmenyHiba)
        return (
            <div>Hiba</div>
                )       
    
    else return (

        <div>
            <div className="doboz">
            <h1>{`Üdvözöllek ${jatekosNev}!`}</h1>

            <h4 style={{marginTop : "30px"}}>Eredmények pontszám:</h4>

            {adatok.length === 0 ? <div style={{textAlign:"center", fontWeight:"bold", margin:"20px"}}>Még nincsenek eredményeid<br></br> Játsz és mentsd el az eredményeidet!</div> : <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                    <th>Dátum</th>
                    <th className="d-none d-md-table-cell">Időpont</th>
                    <th>Kategória</th>
                    <th>Pontszám</th>
                    <th>Törlés</th>
                </tr>
                </thead>
                
                <tbody>
                {adatok.map((elem,index)=>(
                    
                        <tr key={index}>
                            <td>{elem.Eredmenyek_datum.split(' ')[0]}</td>
                            <td className="d-none d-md-table-cell">{elem.Eredmenyek_datum.split(' ')[1].split('.')[0]}</td>
                            <td>{elem.kategoria_nev}</td>
                            <td>{elem.Eredmenyek_pontszam}</td>
                            <td><button className="btn btn-danger" onClick={()=>eredmenyTorles(elem.Eredmenyek_id)}>Törlés</button></td>


                        </tr>
                    
                ))}
                </tbody>

            </table>
            
            
            }

            <h4>Összes pontszám: {osszes}</h4>


            <div className="grafikon">
                <MyPlot datum={datumokTomb} eredmeny={eredmenyekTomb} cim={"Összes eredmény naponként"}/>
            </div>
            
            

        </div>

        <br></br>
        <br></br>
        <br></br>
        </div>
        


    )
}

export default EredmenyekPontszam