import React from 'react';
import Plot from 'react-plotly.js';

const MyPlot = ({datum, eredmeny, cim}) => {


  return (

    <div style={{ width: "100%", height: "400px" }}>
      <Plot
      data={[
        {
          x: datum,
          y: eredmeny,
          type: 'bar',
          width: datum.length === 1 ? 0.3 : 0.9,
          marker: {
            color: '#6366F1',
            line: {
              width: 0
            },
          },
        },
        
      ]}
      layout={{
        autosize: true,
        paper_bgcolor: 'black',
        plot_bgcolor: 'black',
        font: { color: 'white' }, 
        title: {
          text: cim
        },
        dragmode: false,

        yaxis: {
          range: [0, Math.max(eredmeny) * 1.1],
          type: 'linear',
          
        },

        xaxis: {
          type:"category",
          
        },

        margin: { t: 50, b: 80, l: 100, r: 50 },
        
      }}

      config={{
        responsive: true,
        displayModeBar: false,
        scrollZoom: false,      
        doubleClick: false,     
        editable: false,        
        displaylogo: false
      }}

      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}

    />
    </div>

    
  );
};

export default MyPlot;