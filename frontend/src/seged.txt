import { useState } from 'react';
import './App.css';

import Lenyilo from './Lenyilo';



function App() {
  const [kivalasztott,setKivalasztott]=useState(1)
  const [frissit,setFrissit]=useState(false)
  return (
    <div >
      
          <Lenyilo kivalasztott={setKivalasztott}/>
          
    </div>
  );
}

export default App;
