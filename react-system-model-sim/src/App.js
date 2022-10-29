import './App.css';
import React, {useRef, useState} from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';


function Plot_system({x_data, y_data}) {
    //TODO: send the whole data from API to this component including more than one plot and the metadata
    return (
        <Plot

            data={[
                {
                    x: x_data,
                    y: y_data,
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: {color: 'red'},
                },
            ]}

            layout={{width: 1200, height: 700, title: 'Model name'}}
        />
    );
}


export default function App() {
    const [x_data, set_x_data] = useState([0, 0]); //to be updated by the model
    const [y_data, set_y_data] = useState([0, 0]); //to be updated by the model
    const [room_temperature, set_room_temperature] = useState(0); //to be updated by the model
    const [teapot_temperature, set_teapot_temperature] = useState(0); //to be updated by the model
    const [final_time_parameter, set_final_time_parameter] = useState(0); //to be updated by the model
    const FilePath = useRef(null);

    function simulate() {
        console.log('simulate');
        axios.get(`http://localhost:8000/model-results?time=0&room_temperature=${room_temperature}&initial_teacup_temperature=${teapot_temperature}&final_time_parameter=${final_time_parameter}`)
            .then(res => {
                set_x_data(Object.keys(res.data).map(Number));
                let y_array = [];
                Object.values(res.data).forEach((value) => {
                    //append the value to the y_array
                    y_array.push(value['Teacup Temperature']);
                });
                console.log(y_array);
                set_y_data(y_array);
            })
    }

    function simulate_button() {
        return (
            <button
                style={{
                    margin: 10,
                    padding: 10,
                    backgroundColor: 'green',
                    color: 'white',
                    borderRadius: 5,
                    fontSize: 20,
                    fontWeight: 'bold'
                }}
                onClick={simulate}>Simulate</button>
        )
    }

    function input_box_final_time_parameter() {
        const handleInputChange = (event) => {
            console.log(event.target.value);
            set_final_time_parameter(event.target.value);
        }

        return (
            <input type="float" onChange={handleInputChange}/>
        )
    }

    function input_box_room_temperature() {
        const handleInputChange = (event) => {
            console.log(event.target.value);
            set_room_temperature(event.target.value);
        }

        return (
            <input type="float" onChange={handleInputChange}/>
        )
    }

    function input_box_teapot_temperature() {
        const handleInputChange = (event) => {
            console.log(event.target.value);
            set_teapot_temperature(event.target.value);
        }

        return (
            <input type="float" onChange={handleInputChange}/>
        )
    }

    const handleFileChange = event => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
            return;
        }
        console.log('fileObj is', fileObj);
        event.target.value = null;
        console.log(event.target.files);
        console.log(fileObj);
        console.log(fileObj.name);
    };


    return (
        <div className="App">
            <header className="App-header">
                <h1>Simulation</h1>
                <div style={
                    {
                        display: 'flex',
                        flexDirection: 'row',
                        margin: '10px',
                    }
                }>
                    <div><input
                        style={{display: 'none'}}
                        ref={FilePath}
                        type="file"
                        onChange={handleFileChange}
                    />
                        <div style={{margin: '10px'}}>
                            <div style={{margin: '10px'}}> Room Temperature: {input_box_room_temperature()}</div>
                            <div style={{margin: '10px'}}> Teapot Temperature: {input_box_teapot_temperature()}</div>
                            <div style={{margin: '10px'}}> Final Time: {input_box_final_time_parameter()}</div>
                        </div>
                        <div style={{margin: '10px'}}>
                        {simulate_button()}
                        </div>
                    </div>

                </div>
                <Plot_system x_data={x_data} y_data={y_data}/>
            </header>
        </div>
    );
}

