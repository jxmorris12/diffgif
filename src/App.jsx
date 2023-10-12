import React, { Component } from "react";

// import './hinton/hinton.js'
// import * as d3 from "d3-hinton";
// import * as d3 from "d3";

// https://recharts.org/en-US/
// import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



import Alphabet from "./components/Alphabet";
import FancyText from "./components/FancyText";

import difflib from "difflib"

import EMBEDDINGS from "./data/emb.js"

console.log('loaded EMBEDDINGS => ', EMBEDDINGS.length)

function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}


// // Call the updateContent function every 2500ms (2.5 seconds)
// // var interval = setInterval(updateContent, 2500);
// var interval = setInterval(updateContent, 1200);
// let original = "Nabo Gass (25 August, 1954 in Ebingen, Germany) is a German painter and glass artist."

// let rounds = [
//     [0.853, "Nabo Gass (11 August 1974 in Erlangen, Germany) is an artist.", false],
//     [0.994, "Nabo Gass (b. 18 August 1954 in Egeland, Germany) is a German painter and glass artist.", false],
//     [0.998, "Nabo Gass (25 August 1954 in Ebingen, Germany) is a German painter and glass artist.", false],
//     [1.00, "Nabo Gass (25 August, 1954 in Ebingen, Germany) is a German painter and glass artist.", true],
// ]

let original = "vec2text is an algorithm for recovering text from embeddings. Using vec2text, we can recover over 90% of text inputs from embeddings exactly."

let rounds = [
    [0.9121929407119751, 'vcov2 text is an algorithm for recovering text from embedded velocities. Using vcov2 text, we can recover text from embedded velocities, which can give a prediction of over 90%.'],
    [0.9190854430198669, 'vetex2 is an algorithm for recovering text from embedded text. Using vetex2 we can recover text from embedded text, and it approximates 90% of inputs.'],
    [0.9203237295150757, 'vtex2 is an algorithm for recovering text from embedded vectors, using encodings. Using vtex2 we can recover text from nearly 90% of embedded vectors.'],
    [0.9329965710639954, 'vectext2 is an algorithm for recovering text from embedded vectors, using a vectorization. In vectext2, we can recover text from embedded vectors, which is almost 100%.'],
    [0.9324401617050171, 'vcov2 text is an algorithm for recovering text from embedded vector inputs. Using vcov2 text, we can recover text from embedded vector inputs, leaving over 90% encoding.'],
    [0.9376235008239746, 'cov2text is an algorithm for recovering text from vector embeds. Using cov2text, we can recover text from vector embeds, resulting in over 90% of inputs.'],
    [0.9376901984214783, 'vectext2 is an algorithm for recovering text from vector inputs. Using vectext2, we can recover text from vector inputs, which approximates 90% of embedded text.'],
    [0.9388548731803894, 'vectext2 is an algorithm for recovering text from embedded vectors. Using vectext2, we can recover text from embedded vectors, and return approx. 90% encoding.'],
    [0.9399496912956238, 'vectext2 is an algorithm for recovering text from vectext embeds. Using vectext2, we can recover text from vectext embeds, which approximates 90% of the inputs.'],
    [0.983305037021637,  'vec2text is an algorithm for recovering text from text embeds. Using vec2text, we can recover text embeds from inputs, leaving a text cov of almost 90%.'],
    [0.9949362277984619, 'vec2text is an algorithm for recovering text from text embeddings. Using vec2text, we can recover text embeddings from inputs, which approximates over 90%.'],
    [0.9980461597442627, 'vec2text is an algorithm for recovering text from text embeddings. Using vec2text, we can recover over 90% of text from embedded inputs exactly.'],

    // adding original like 6 times for effect
    [1, "vec2text is an algorithm for recovering text from embeddings. Using vec2text, we can recover over 90% of text inputs from embeddings exactly."],
    [1, "vec2text is an algorithm for recovering text from embeddings. Using vec2text, we can recover over 90% of text inputs from embeddings exactly."],
    [1, "vec2text is an algorithm for recovering text from embeddings. Using vec2text, we can recover over 90% of text inputs from embeddings exactly."],
    [1, "vec2text is an algorithm for recovering text from embeddings. Using vec2text, we can recover over 90% of text inputs from embeddings exactly."],
    [1, "vec2text is an algorithm for recovering text from embeddings. Using vec2text, we can recover over 90% of text inputs from embeddings exactly."],
]

const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ]

export default class App extends Component {
    state = { 
        text: "", 
        lineChartData: [
            {
              name: 'Page A',
              uv: 4000,
              pv: 2400,
              amt: 2400,
            },
            {
              name: 'Page B',
              uv: 3000,
              pv: 1398,
              amt: 2210,
            },
            {
              name: 'Page C',
              uv: 2000,
              pv: 9800,
              amt: 2290,
            },
            {
              name: 'Page D',
              uv: 2780,
              pv: 3908,
              amt: 2000,
            },
            {
              name: 'Page E',
              uv: 1890,
              pv: 4800,
              amt: 2181,
            },
            {
              name: 'Page F',
              uv: 2390,
              pv: 3800,
              amt: 2500,
            },
            {
              name: 'Page G',
              uv: 3490,
              pv: 4300,
              amt: 2100,
            },
          ]
            // [
            //     { x: 1, y: 20 },
            //     { x: 2, y: 10 },
            //     { x: 3, y: 25 }
            // ]
    }
    currentIndex = 0
    score = null

    changeText(event) {
        console.log('changeText', event.target.value )
        this.setState({ text: event.target.value });
    }

    stateEmoji() {
        if(this.state.score == 1) {
            return '✅'
        }
        else {
            return '❌'
        }
    }

    updateContent() {
        return
        if(this.state.score == 1) {
            return
        }
        const [newSim, newText] = rounds[this.currentIndex]


        let emb = EMBEDDINGS[this.currentIndex].slice(0, 20*20)
        let newLineChartData = Array.from(emb.entries()).map((a) => ({ x: a[0], y: a[1]}))
        
        this.setState({ score: newSim, text: newText, lineChartData: newLineChartData })

        // todo do this by binding to state somehow?
        // let emb = listToMatrix(EMBEDDINGS[this.currentIndex].slice(0, 20*20), 20)
        // this.hintonDiagram.update(emb, 500)
        this.currentIndex = (this.currentIndex + 1) % rounds.length // Cycle through the array...
    }

    componentDidMount() {
        // this.hintonDiagram = new d3.hinton('#hinton-diagram', 20, 20)

        this.interval = setInterval(() => {
          this.updateContent();
        }, 2500); // Call myFunction() every so many milliseconds
      }

    render() {
        return (
            <div className="container">
                <h2>vec2text demo</h2>

                <h3> Round {this.currentIndex} / Score {(this.state.score || 0).toFixed(2)} / { this.stateEmoji() } </h3>
                <svg width="100%" height="600">
                    <FancyText x="0" y="60" text={this.state.text} />
                    {/* <Alphabet x={32} y={300} /> */}
                </svg>

                {/* <div style={{"padding-x": 20}} id="hinton-diagram"></div> */}

                <p>{ this.state.lineChartData[0].toString() }</p>

            <ResponsiveContainer width={500} height={300}>
                <LineChart width={500} height={300} data={this.state.lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}