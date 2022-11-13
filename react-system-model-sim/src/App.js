import './App.css';
import React, {useRef, useState} from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

let address = '78.130.158.235';
let port = '8000';

function Plot_system({x_data, y_data, y_data2}) {
    return (
        <Plot

            data={[
                {
                    x: x_data,
                    y: y_data,
                    type: 'scatter',
                    mode: 'lines',
                    marker: {color: 'blue'},
                    name: 'Balance'
                },
                {
                    x: x_data,
                    y: y_data2,
                    type: 'scatter',
                    mode: 'lines',
                    marker: {color: 'green'},
                    name: 'Real Balance'
                }
            ]}
            //TODO:layout for mobile
            layout={{width: 600, height: 400, title: 'Balance', backgroundColor: 'gray'}}
        />
    );
}


export default function App() {
    const [x_data, set_x_data] = useState([0, 0]); //to be updated by the model
    const [y_data, set_y_data] = useState([0, 0]); //to be updated by the model
    const [y_data2, set_y_data2] = useState([0, 0]); //to be updated by the model
    const [deposits, set_deposits] = useState(0); //to be updated by the model
    const [initial_balance, set_initial_balance] = useState(0); //to be updated by the model
    const [interest, set_interest] = useState(0); //to be updated by the model
    const [average_inflation, set_average_inflation] = useState(0); //to be updated by the model
    const [final_time_parameter, set_final_time_parameter] = useState(0); //to be updated by the model

    function simulate() {
        console.log('simulate');
        axios.get(`http://${address}:${port}/model-results?deposits=${deposits}&initial_balance=${initial_balance}&final_time_parameter=${final_time_parameter}&interest=${interest}&average_inflation=${average_inflation}`)
            .then(res => {
                set_x_data(Object.keys(res.data).map(Number));
                let y_array = [];
                let y_array2 = [];
                Object.values(res.data).forEach((value) => {
                    //append the value to the y_array
                    y_array.push(value['Balance']);
                    y_array2.push(value['Real Balance']);
                });
                console.log(y_array);
                console.log(y_array2);
                set_y_data(y_array);
                set_y_data2(y_array2);
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

    function input_box_initial_balance() {
        const handleInputChange = (event) => {
            console.log(event.target.value);
            set_initial_balance(event.target.value);
        }

        return (
            <input type="float" onChange={handleInputChange}/>
        )
    }

    function input_box_interest() {
        const handleInputChange = (event) => {
            console.log(event.target.value);
            set_interest(event.target.value/100);
        }

        return (
            <input type="float" onChange={handleInputChange}/>
        )
    }

    function input_box_deposits() {
        const handleInputChange = (event) => {
            console.log(event.target.value);
            set_deposits(event.target.value);
        }

        return (
            <input type="float" onChange={handleInputChange}/>
        )
    }

    function input_box_average_inflation() {
        const handleInputChange = (event) => {
            console.log(event.target.value);
            set_average_inflation(event.target.value/100);
        }

        return (
            <input type="float" onChange={handleInputChange}/>
        )
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Deposit Calculator</h1>
                <div style={
                    {
                        display: 'flex',
                        flexDirection: 'row',
                        margin: '10px',
                    }
                }>
                    <div>
                        <div style={{margin: '10px'}}>
                            <div style={{margin: '10px'}}> Initial Balance: {input_box_initial_balance()}</div>
                            <div style={{margin: '10px'}}> Deposits (yearly): {input_box_deposits()}</div>
                            <div style={{margin: '10px'}}> Interest (yearly %): {input_box_interest()}</div>
                            <div style={{margin: '10px'}}> Average Inflation (yearly %): {input_box_average_inflation()}</div>
                            <div style={{margin: '10px'}}> Time (years): {input_box_final_time_parameter()}</div>
                        </div>
                        <div style={{margin: '10px'}}>
                            {simulate_button()}
                        </div>
                    </div>

                </div>
                <Plot_system x_data={x_data} y_data={y_data} y_data2={y_data2}/>
            </header>
        </div>
    );
}

