import React from 'react';
import Plot from 'react-plotly.js';

const MyPlot = ({datum, eredmeny}) => {
  return (
    <Plot
      data={[
        {
          x: datum,
          y: eredmeny,
          type: 'bar',
          mode: 'bar',
          marker: { color: 'red' },
        },
        
      ]}
      layout={{
        width: 400,
        height: 400,
        title: 'React Plotly Példa'
      }}
    />
  );
};

export default MyPlot;