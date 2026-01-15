import React from 'react';
import Plot from 'react-plotly.js';

const MyPlot = ({datum, eredmeny, cim}) => {
  return (
    <Plot
      data={[
        {
          x: datum,
          y: eredmeny,
          type: 'bar',
          marker: { color: 'red' },
          
        },
        
      ]}
      layout={{
        width: 400,
        height: 400,
        title: {
          text: cim
        },
        dragmode: false,
        margin: {t : 50},
        yaxis: {
          rangemode: "tozero"
        }

      }}

      config={{
        displayModeBar: false,
        scrollZoom: false,      
        doubleClick: false,     
        editable: false,        
        displaylogo: false
      }}
    />
  );
};

export default MyPlot;