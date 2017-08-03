import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data = [
      {name: '23-06-2017', sleep: 7.4, pv: 2400, amt: 1000},
      {name: '22-06-2017', sleep: 7.8, pv: 1398, amt: 2210},
      {name: '21-06-2017', sleep: 7.5, pv: 9800, amt: 2290},
      {name: '20-06-2017', sleep: 8.2, pv: 3908, amt: 2000},
      {name: '19-06-2017', sleep: 7.3, pv: 4800, amt: 2181},
      {name: '18-06-2017', sleep: 7.3, pv: 3800, amt: 2500},
      {name: '17-06-2017', sleep: 8.2, pv: 4300, amt: 2100},
      {name: '16-06-2017', sleep: 7.1, pv: 1398, amt: 2210},
      {name: '15-06-2017', sleep: 7.1, pv: 9800, amt: 2290},
      {name: '14-06-2017', sleep: 7.9, pv: 3908, amt: 2000},
      {name: '13-06-2017', sleep: 8.2, pv: 4800, amt: 2181},
      {name: '12-06-2017', sleep: 6.8, pv: 3800, amt: 2500},
      {name: '11-06-2017', sleep: 8.0, pv: 4300, amt: 2100},
      {name: '10-06-2017', sleep: 7.8, pv: 4300, amt: 2100},
];

class Sleepgraph extends React.Component{
    render(){
        console.log('i am here for rendering sleep graph')
        return(
            <div>  
                <div className="row justify-content-center">
                    <h2>Sleeping Time Graph</h2>
                </div>
               	<LineChart width={1200} height={400} data={data}
                        margin={{top: 10, right: 30, left: 200, bottom: 5}}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend />
                {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/> */}
                <Line type="monotone" dataKey="sleep" stroke="#8884d8" activeDot={{r: 8}} />
              </LineChart>
            </div> 
        );
    }
}

export default Sleepgraph;