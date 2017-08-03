import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data = [
      {name: '23-06-2017', nes: 25648 },
      {name: '22-06-2017', nes: 18540 },
      {name: '21-06-2017', nes: 28416 },
      {name: '20-06-2017', nes: 16226 },
      {name: '19-06-2017', nes: 15772 },
      {name: '18-06-2017', nes: 32652 },
      {name: '17-06-2017', nes: 13987 },
      {name: '16-06-2017', nes: 16387 },
      {name: '15-06-2017', nes: 18365 },
      {name: '14-06-2017', nes: 23273 },
      {name: '13-06-2017', nes: 21010 },
      {name: '12-06-2017', nes: 14720 },
      {name: '11-06-2017', nes: 24949 },
      {name: '10-06-2017', nes: 26497 },
];

class Nes extends React.Component{
    render(){
        console.log('i am here for rendering nes graph')
        return(
            <div id="nes">
                <div className="row justify-content-center">
                    <h2>Non Exercise Steps Graph</h2>
                
               	<LineChart width={1200} height={400} data={data}
                            margin={{top: 10, right: 30, left: 200, bottom: 5}}>
                    <XAxis dataKey="name"/>
                    <YAxis dataKey=""/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Legend />
                    <Line type="monotone" dataKey="nes" stroke="black" activeDot={{r: 8}} />
                </LineChart>
                </div>
            </div> 
        );
    }
}

export default Nes;