import Swal from "sweetalert2"
import {useState,  useEffect } from "react"
import 'sweetalert2/dist/sweetalert2.min.css';
import Cim from "../Cim";
import { useNavigate } from 'react-router-dom';

const Kerdesek = ({kerdesek, kategoria, kerdesekBetoltve}) => {

    const [szamlalo, setSzamlalo] = useState(0)
    const [valaszok, setValaszok] = useState([])
    const [tolt, setTolt] = useState(false)
    const [pontszam, setPontszam] = useState(0)
    const [betuk] = useState(["A", "B", "C", "D"])
    const [helyesValasz, setHelyesValasz] = useState()
    const [helytelenValaszMarad, setHelytelenValaszMarad] = useState()
    const [nyeremenyek] = useState([0, 5000, 50000, 100000, 500000, 750000, 1500000, 2000000, 10000000, 15000000, 50000000])

    const [pontozas, setPontozas] = useState(0)
    const [kerdesPont, setKerdesPont] = useState(0)
    const [felhasznaltSegitseg, setFelhasznaltSegitseg] = useState(0)

    const [telefonSegitsegAktiv, setTelefonSegitsegAktiv] = useState(true)
    const [felezoMegjelol, setFelezoMegjelol] = useState(false)
    const [kozonsegMegjelol, setKozonsegMegjelol] = useState(false)
    const [felezoSegitsegAktiv, setFelezoSegitsegAktiv] = useState(true)
    const [kozonsegSegitsegAktiv, setKozonsegSegitsegAktiv] = useState(true)
    const [szazalek, setSzazalek] = useState([])
    const [megjeloltValasz, setMegjeloltValasz] = useState()
    const [valaszMegjelolve, setValaszMegjelolve] = useState(false)

    const [jatekosId, setJatekosId] = useState(null)

    const navigate = useNavigate();



    const showAlert = (cim, szoveg, ikon, gomb) => {
    Swal.fire({
      title: `${cim}`,
      html: `${szoveg}`,
      icon: `${ikon}`,
      confirmButtonText: `${gomb}`,
    });
    };

    /*const pontozasSzamol = () => {

        

        let segitsegSzorzo = 1;

        switch (felhasznaltSegitseg) {
            case 0: segitsegSzorzo = 2; 
                        break;
            case 1: segitsegSzorzo = 1.7;
                        break;
            case 2: segitsegSzorzo = 1.3;
                        break;
            default: segitsegSzorzo = 1;
                        break;
        }



        const ujPontozas = Math.round(kerdesPont * segitsegSzorzo * szamlalo)
        setPontozas(ujPontozas)
        console.log(kerdesPont)
        console.log(segitsegSzorzo)
        console.log(szamlalo)
        console.log(ujPontozas)


    }*/

    /*const szamlaloNovel = () => {

        showAlert("Helyes válasz! 😺", "", "success", "Következő kérdés 🏆")
        setSzamlalo(szamlalo + 1)
    }*/

    const telefonSegitseg = () => {

        if(telefonSegitsegAktiv) {

            let valaszHelyesE = Math.floor(Math.random() * 2)
            let telefonValasz;
            //let joE= ""

            if (valaszHelyesE === 1) {
                telefonValasz = helyesValasz
                //joE = "helyes"
            } 
            else {

                let randomHelytelen;
                do {
                randomHelytelen = Math.floor(Math.random() * 4)
                } while (valaszok[randomHelytelen] === helyesValasz)

                telefonValasz = valaszok[randomHelytelen]
                //joE = "helytelen"

            }

            //setTelefonMegjelol(true)
            const nevek = ["👦 Gergő", "👦 Dániel", "👦 Alex", "👧 Mia", "👦 Hunor", "👦 Sanyi", "👦Bence", "👵 Marika néni", "👦 Józsi"]
            const szoveg = 
                [   "Egyértelmű BROOOOOOO",
                    "Szerintem a helyes válasz", 
                    "Tesó! Jelöld meg ezt", 
                    `Lehet, hogy ${valaszok[0]} vagy ${valaszok[1]}, de ${valaszok[3]} is lehet... nem tudom... jelöld meg ezt`,
                    `${kerdesek[szamlalo].kerdesek_leiras}... Én úgy gondolom, hogy ha a számításaim nem csalnak, akkor a helyes válasz`,
                    "Szerintem",
                    "Háááát... legyen akkor",
                    "Nekem mindegy, legyen ez",
                    "Na ide figyelj! Szerintem"]
            let rand = Math.floor(Math.random() * nevek.length)
            showAlert(`${nevek[rand]} a vonalban!`, `${szoveg[rand]}: <b>${telefonValasz}</b>`, "info", "Köszönöm a segítséget! 💖")
            setTelefonSegitsegAktiv(false)
            setFelhasznaltSegitseg(felhasznaltSegitseg + 1)
        }
    }

    const kozonsegSegitseg = () => {

        if(kozonsegSegitsegAktiv) {

            let esely = 40
            let maradekSzazalek = 60

            if (szamlalo < 3) {
                esely = 50
                maradekSzazalek = 50
            } else if (szamlalo > 5) {
                esely = 30
                maradekSzazalek = 70
            }

            const helyes = esely + Math.floor(Math.random() * maradekSzazalek)
            let szazalekTomb = ["0%", "0%", "0%", "0%"]
            const helyesIndex = valaszok.indexOf(kerdesek[szamlalo].kerdesek_helyesValasz)
            let maradek = 100 - helyes

            if (!felezoMegjelol) {

                let index = 0
            
                while (maradek > 0) {

                    if (index === helyesIndex) {
                        szazalekTomb[index] = helyes + "%"
                    } 

                    else if (index === 3 || (index === 2 && helyesIndex === 3)) {
                        szazalekTomb[index] = maradek + "%"
                        maradek = 0
                    }
                    else {
                        let rand = Math.floor(Math.random() * maradek)
                        szazalekTomb[index] = rand + "%"
                        maradek -= rand
                    }

                    if (index === 3) maradek = 0
                    index++

                }

                szazalekTomb[helyesIndex] = helyes + "%"
            } else {
                
                for (let i = 0; i < 4; i++) {
                    if (i === helyesIndex) szazalekTomb[i] = helyes + "%"
                    else szazalekTomb[i] = maradek + "%"
                }
            }

            setKozonsegMegjelol(true)
            setSzazalek(szazalekTomb)
            setKozonsegSegitsegAktiv(false)
            setFelhasznaltSegitseg(felhasznaltSegitseg + 1)

        }
    }
        

        

    

    const felezoSegitseg = () => {

        setTolt(false)

        if(felezoSegitsegAktiv) {

            setFelezoMegjelol(true)
            setFelezoSegitsegAktiv(false)
            setFelhasznaltSegitseg(felhasznaltSegitseg + 1)

            

            
            
            setTolt(true)
            
        }
  
    }

    const valaszEllenoriz = async (valasz) => {
        
        //setTolt(false)
        setMegjeloltValasz(valasz)
        setValaszMegjelolve(true)

        setTimeout(() => {
            if (valasz === kerdesek[szamlalo].kerdesek_helyesValasz) {

            if (szamlalo === 9) setPontszam(nyeremenyek[10])

            showAlert("Helyes válasz! 😺", "", "success", "Következő kérdés 🏆")
            const ujSzamlalo = szamlalo + 1
            setSzamlalo(ujSzamlalo)



            
            
            //szamlaloNovel()

            const ujKerdesPont = kerdesPont + kerdesek[szamlalo].kerdesek_nehezseg
            setKerdesPont(ujKerdesPont)

            let segitsegSzorzo = 1;

            switch (felhasznaltSegitseg) {
                case 0: segitsegSzorzo = 2; 
                            break;
                case 1: segitsegSzorzo = 1.7;
                            break;
                case 2: segitsegSzorzo = 1.3;
                            break;
                default: segitsegSzorzo = 1;
                            break;
            }

            const ujPontozas = Math.round(ujKerdesPont * segitsegSzorzo * ujSzamlalo)
            setPontozas(ujPontozas)
            console.log(ujKerdesPont)
            console.log(segitsegSzorzo)
            console.log(ujSzamlalo)
            console.log(ujPontozas)
            
            
            //valaszKever()
        }
        else {
            /*alert(`Sajnos nem nyertél! :(
            A helyes válasz: ${kerdesek[szamlalo].kerdesek_helyesValasz}
            Magyarázat: ${kerdesek[szamlalo].kerdesek_leiras}
            `)*/
            //pontozasSzamol()
            
            eredmenyMentes(
                `Sajnos nem nyertél! 😿`,
                `A helyes válasz: <b>${kerdesek[szamlalo].kerdesek_helyesValasz}</b><br>💡 ${kerdesek[szamlalo].kerdesek_leiras}<br></br>${pontszam} Ft-ot nyertél! <br></br>A pontszámod: ${pontozas}<br></br>El szeretnéd menteni az eredményt?`,
                `warning`);



            setSzamlalo(0)
            setPontszam(0)

            
            kerdesekBetoltve(false)

        }

        setMegjeloltValasz(null)
        setValaszMegjelolve(false)
        }, 1500);
        
        
        
            
            
        
    }

    const kilepes = () => {
        Swal.fire({
      title: ``,
      html: `Biztosan ki szeretnél lépni?`,
      icon: `warning`,
      confirmButtonText: `Igen 😿`,
      cancelButtonText: 'Nem 🏆',
      showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            kerdesekBetoltve(false)
        }
    });
    }

    const eredmenyMentes = (cim, tartalom, ikon) => {

        /*showAlert(
            "Sajnos nem nyertél! 😿", 
            `A helyes válasz: <b>${kerdesek[szamlalo].kerdesek_helyesValasz}</b><br>💡 ${kerdesek[szamlalo].kerdesek_leiras}`, 
            "error", 
            "Vissza a kategóriákhoz 🚪"
        )*/




        Swal.fire({
      title: cim,
      html: tartalom,
      icon: ikon,
      confirmButtonText: `Igen`,
      cancelButtonText: 'Nem',
      showCancelButton: true
    }).then( async(result) => {
        if (result.isConfirmed) {

            if (jatekosId != null) {

                const bemenet={
                    "nyeremeny" : pontszam,
                    "pontszam" : pontozas,
                    "jatekos" : jatekosId,
                    "kategoria": kategoria,
                }

                const response=await fetch(Cim.Cim+"/eredmenyFelvitel", {
                                method: "post",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(bemenet)
                            })

                if (response.ok) {
                        alert("ok")
                } else {
                        alert("hiba")
                }


            } else {
                localStorage.setItem("taroltEredmeny", JSON.stringify({ePont: pontszam, eKat: kategoria}))
                navigate("/login")
            }

        }
    });
    }




    const valaszKever = () => {

        if (szamlalo < kerdesek.length) {

            setFelezoMegjelol(false)
        setKozonsegMegjelol(false)

        //alert(szamlalo)
        let tomb =  [kerdesek[szamlalo].kerdesek_helyesValasz, 
                    kerdesek[szamlalo].kerdesek_helytelenValasz1, 
                    kerdesek[szamlalo].kerdesek_helytelenValasz2, 
                    kerdesek[szamlalo].kerdesek_helytelenValasz3]

        


        let csere
        for (let i = 0; i < 100; i++) {
            const rand1 = Math.floor(Math.random() * 4)
            const rand2 = Math.floor(Math.random() * 4)

            csere = tomb[rand1]
            tomb[rand1] = tomb[rand2]
            tomb[rand2] = csere

            
        }

        setValaszok(tomb)
        setHelyesValasz(kerdesek[szamlalo].kerdesek_helyesValasz)

        let randomHelytelen

            do {
                randomHelytelen = Math.floor(Math.random() * 4)
            } while (tomb[randomHelytelen] === kerdesek[szamlalo].kerdesek_helyesValasz)

        
            setHelytelenValaszMarad(tomb[randomHelytelen])

        

        
        
        setTolt(true)

        setPontszam(nyeremenyek[szamlalo])

        /*switch (szamlalo + 1) {
            case 1: setPontszam(5000);break;
            case 2: setPontszam(50000);break;
            case 3: setPontszam(100000);break;
            case 4: setPontszam(500000);break;
            case 5: setPontszam(750000);break;
            case 6: setPontszam(1500000);break;
            case 7: setPontszam(2000000);break;
            case 8: setPontszam(10000000);break;
            case 9: setPontszam(15000000);break;
            default: setPontszam(50000000);break;
        }*/

        }
        
    }

    /*const helytelenValasz = () => {

        alert(`Sajnos nem nyertél! :(
            A helyes válasz: ${kerdesek[szamlalo].kerdesek_helyesValasz}
            Magyarázat: ${kerdesek[szamlalo].kerdesek_leiras}
            `)
        setSzamlalo(0)
        kerdesekBetoltve(false)

    }*/

    /*useEffect(()=>{
        

        if (szamlalo < kerdesek.length) {
            alert(`${kerdesek[szamlalo].kerdesek_nehezseg} ${kerdesek[szamlalo].kerdesek_kerdes}\n
                A: ${kerdesek[szamlalo].kerdesek_helyesValasz}\n
                B: ${kerdesek[szamlalo].kerdesek_helytelenValasz1}\n
                c: ${kerdesek[szamlalo].kerdesek_helytelenValasz2}\n
                D: ${kerdesek[szamlalo].kerdesek_helytelenValasz3}`)

                
                setSzamlalo(szamlalo + 1)
                

                

        } else {
            setSzamlalo(0)
            kerdesekBetoltve(false)
        }

        
    },[szamlalo])*/

    useEffect(()=>{
        valaszKever()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[szamlalo])

    /*useEffect(()=>{
        pontozasSzamol()
    },[szamlalo, kerdesPont, felhasznaltSegitseg])*/

    useEffect(()=>{
        const jatekos = localStorage.getItem("userid")
        setJatekosId(jatekos)
    },[])

    useEffect(() => {
        if (szamlalo === kerdesek.length) {
            eredmenyMentes(
                "Gratulálunk!",
                `Gratulálunk! 🏆😻🎉🥳🏆<br>
                Az összes kérdést helyesen válaszoltad meg!<br><br>
                ${pontszam} Ft-ot nyertél!<br>
                A pontszámod: ${pontozas}<br><br>
                El szeretnéd menteni az eredményt?`,
                "success"
            );

            kerdesekBetoltve(false);
        }
    }, [szamlalo, pontozas]);

    if (szamlalo < kerdesek.length) {

        if (tolt) {

            return (

        <div>
            <div className="doboz">

            <h2> ({szamlalo + 1}) {kerdesek[szamlalo].kerdesek_kerdes}</h2>
            <br></br>

            {/*<div className="gombDoboz">
                <button className="gomb" style={{marginBottom:"15px"}} onClick={() => szamlaloNovel()}>A: {kerdesek[szamlalo].kerdesek_helyesValasz}</button>
                <button className="gomb" style={{marginBottom:"15px"}} onClick={() => helytelenValasz()}>B: {kerdesek[szamlalo].kerdesek_helytelenValasz1}</button>
                <button className="gomb" style={{marginBottom:"15px"}} onClick={() => helytelenValasz()}>C: {kerdesek[szamlalo].kerdesek_helytelenValasz2}</button>
                <button className="gomb" style={{marginBottom:"15px"}} onClick={() => helytelenValasz()}>D: {kerdesek[szamlalo].kerdesek_helytelenValasz3}</button>
            </div>*/}

            {/* Telefon megjelöl változat
            <button key={elem} 
                            style={{textAlign:"left", backgroundColor:(elem === helyesValasz && telefonMegjelol)?"lightblue":"white"}} 
                            className={((felezoMegjelol && (elem === helyesValasz || elem === helytelenValaszMarad)) || !felezoMegjelol)?"gomb":"atlatszoGomb"} 
                            onClick={() => valaszEllenoriz(elem)}>{betuk[index]}: {elem} <i>{kozonsegMegjelol ? szazalek[index] : ""}</i> </button> */}

            
            <div className="gombDoboz">
                {valaszok.map((elem, index) => (
                    <button key={elem} 
                            disabled={valaszMegjelolve}
                            style={{textAlign:"left", backgroundColor:(megjeloltValasz === elem) ? "#4DA3FF" : "#2A2F3A"}} 
                            className={!valaszMegjelolve ? (((felezoMegjelol && (elem === helyesValasz || elem === helytelenValaszMarad)) || !felezoMegjelol)?"gomb":"atlatszoGomb") : "gombLetiltva"} 
                            onClick={() => valaszEllenoriz(elem)}>{betuk[index]}: {elem} <i>{kozonsegMegjelol ? szazalek[index] : ""}</i> </button>
                ))}
            </div>

            <h4>Nyeremény: {pontszam} Ft</h4>
            <h4>Pontszám: {pontozas}</h4>

            

            

            </div>


            <div className="doboz d-flex justify-content-between" style={{marginTop:"30px"}}>

                <button 
                        className={telefonSegitsegAktiv?"segitsegGomb":"segitsegGombLetiltva"} 
                        disabled={!telefonSegitsegAktiv} 
                        onClick={() => telefonSegitseg()}>📞 Telefon
                </button>

                <button 
                        className={kozonsegSegitsegAktiv ? "segitsegGomb" : "segitsegGombLetiltva"} 
                        disabled={!kozonsegSegitsegAktiv} 
                        onClick={() => kozonsegSegitseg()}>👥 Közönség
                </button>

                <button 
                        className={felezoSegitsegAktiv?"segitsegGomb":"segitsegGombLetiltva"} 
                        disabled={!felezoSegitsegAktiv} 
                        onClick={() => felezoSegitseg()}>➗ Felező
                </button>

            </div>

            
                <button className="segitsegGomb" onClick={() => kilepes()} style={{margin:"30px auto", background:"red", color: "white"}}>🚪 Kilépés</button>
            
            
        
        </div>
        
        

    ) 


        }

        

    } 
 
    
    
    
        
}

export default Kerdesek