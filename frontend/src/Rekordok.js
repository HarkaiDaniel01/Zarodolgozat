import Cim from "./Cim"
import { useState, useEffect} from "react"


const Felhasznalo = () => {

    const [adatok,setAdatok]=useState([])
    const [tolt,setTolt]=useState(true)
    const [hiba,setHiba]=useState(false)
    const [ikonok] = useState(["🥇", "🥈", "🥉"])

     const leToltes=async ()=>{
            try{
                const response=await fetch(Cim.Cim + "/rekordok")
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
    
        else {
            const jId = Number(localStorage.getItem("userid"))

            return (

            <div>
                <div className="doboz" style={{marginTop:"40px", marginBottom:"40px"}}>
                    <h1>Rekordok</h1>

                    {adatok.length === 0 ? <div style={{textAlign:"center", fontWeight:"bold", margin:"20px", color: "#F5F7FA"}}>Még senkinek sincs eredménye<br></br> Játsz és légy az első!</div> : <table className="table table-dark table-striped table-bordered">
                        <thead>
                            <tr>
                            <th>Helyezés</th>
                            <th>Játékos</th>
                            <th style={{textAlign:"right"}}>Eredmény</th>
                            </tr>
                        </thead>
                
                        <tbody>
                            {adatok.map((elem,index)=>(
                    
                                <tr key={index} className={elem.jatekos_id === jId ? "sorKijelolve" : "nincsKijeloles"}>
                                    <td >{(index < 3) ? (ikonok[index] + "") : (index + 1) + "."}</td>
                                    <td >{elem.jatekos_nev}</td>
                                    <td style={{textAlign:"right"}}>{elem.eredmeny}</td>
                                </tr>
                    
                            ))}
                        </tbody>

                        </table>
            
            
                    }
                </div>

                

            </div>
        )
        } 


}

export default Felhasznalo