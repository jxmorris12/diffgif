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

var NumEmbeddingSamplePoints = 180
var minEmbeddingValue = -0.1

let original = "vec2text is an algorithm for recovering text from embeddings. Using vec2text, we can recover over 90% of text inputs from embeddings exactly."

let rounds = [
    [0.9121929407119751, 'vcov2 text is an algorithm for recovering text from embedded velocities. Using vcov2 text, we can recover text from embedded velocities, which can give a prediction of over 90%.'],
    [0.9190854430198669, 'vetex2 is an algorithm for recovering text from embedded text. Using vetex2 we can recover text from embedded text, and it approximates 90% of inputs.'],
    [0.9203237295150757, 'vtex2 is an algorithm for recovering text from embedded vectors, using encodings. Using vtex2 we can recover text from nearly 90% of embedded vectors.'],
    [0.9376235008239746, 'cov2text is an algorithm for recovering text from vector embeds. Using cov2text, we can recover text from vector embeds, resulting in over 90% of inputs.'],
    [0.9329965710639954, 'vectext2 is an algorithm for recovering text from embedded vectors, using a vectorization. In vectext2, we can recover text from embedded vectors, which is almost 100%.'],
    // [0.9324401617050171, 'vcov2 text is an algorithm for recovering text from embedded vector inputs. Using vcov2 text, we can recover text from embedded vector inputs, leaving over 90% encoding.'],
    [0.9376901984214783, 'vectext2 is an algorithm for recovering text from vector inputs. Using vectext2, we can recover text from vector inputs, which approximates 90% of embedded text.'],
    [0.9388548731803894, 'vectext2 is an algorithm for recovering text from embedded vectors. Using vectext2, we can recover text from embedded vectors, and return approx. 90% encoding.'],
    [0.9399496912956238, 'vectext2 is an algorithm for recovering text from vectext embeds. Using vectext2, we can recover text from vectext embeds, which approximates 90% of the inputs.'],
    [0.983305037021637,  'vec2text is an algorithm for recovering text from text embeds. Using vec2text, we can recover text embeds from inputs, leaving a text cov of almost 90%.'],
    // [0.9949362277984619, 'vec2text is an algorithm for recovering text from text embeddings. Using vec2text, we can recover text embeddings from inputs, which approximates over 90%.'],
    [0.9980461597442627, 'vec2text is an algorithm for recovering text from text embeddings. Using vec2text, we can recover over 90% of text from embedded inputs exactly.'],

    // adding original like 6 times for effect
    [1, "vec2text is an algorithm for recovering text from embeddings. Using vec2text, we can recover over 90% of text inputs from embeddings exactly."],
    // [1, "vec2text is an algorithm for recovering text from embeddings. Using vec2text, we can recover over 90% of text inputs from embeddings exactly."],
    // [1, "vec2text is an algorithm for recovering text from embeddings. Using vec2text, we can recover over 90% of text inputs from embeddings exactly."],
    // [1, "vec2text is an algorithm for recovering text from embeddings. Using vec2text, we can recover over 90% of text inputs from embeddings exactly."],
    // [1, "vec2text is an algorithm for recovering text from embeddings. Using vec2text, we can recover over 90% of text inputs from embeddings exactly."],
]


export default class App extends Component {
    state = { 
        text: "", 
        originalText: "", // original,
        lineChartData: Array.from(EMBEDDINGS[0].slice(0, NumEmbeddingSamplePoints).entries()).map((a) => ({ x: a[0], base: Math.max(EMBEDDINGS[0][a[0]], minEmbeddingValue), y: 0 }))
    }
    currentIndex = 0
    score = null
    animationTimeout = 2500

    stateEmoji() {
        if(this.state.score == 1) {
            return '✅'
        }
        else {
            return '❌'
        }
    }

    updateStep() {
        this.updateContent()
        this.animationTimeout = Math.max(1400, this.animationTimeout - 100)
        console.log('setting a new timeout', this.animationTimeout)

        setTimeout(() => {
            this.updateStep()
          }, this.animationTimeout)
    }

    updateContent() {
        if(this.state.originalText.length === 0) {
            this.setState({ originalText: original})
            return
        }
        if(this.state.score == 1) {
            return
        }
        const [newSim, newText] = rounds[this.currentIndex]


        let emb = EMBEDDINGS[(this.currentIndex+1) % EMBEDDINGS.length].slice(0, NumEmbeddingSamplePoints)
        let newLineChartData = Array.from(emb.entries()).map((a) => ({ x: a[0], base:  Math.max(minEmbeddingValue, EMBEDDINGS[0][a[0]]), y: Math.max(minEmbeddingValue, a[1]) }))

        console.log('originalText:', original)
        
        this.setState({ score: newSim, text: newText, originalText: original, lineChartData: newLineChartData })

        // todo do this by binding to state somehow?
        // let emb = listToMatrix(EMBEDDINGS[this.currentIndex].slice(0, NumEmbeddingSamplePoints), 20)
        // this.hintonDiagram.update(emb, 500)
        this.currentIndex = (this.currentIndex + 1) % rounds.length // Cycle through the array...
    }

    componentDidMount() {
        this.interval = setTimeout(() => {
          this.updateStep()
        }, this.animationTimeout) // Call myFunction() every so many milliseconds
      }

    render() {
        return (
            <div className="container">
                <h3> Original text </h3>
                <svg width="100%" height="240">
                    <FancyText x="0" y="20" text={this.state.originalText} />
                </svg>
                <h3> Hypothesis (Round {this.currentIndex}) </h3>
                <svg width="100%" height="240">
                    <FancyText x="0" y="20" text={this.state.text} />
                </svg>

                <h3> Embedding <svg style={{ 'opacity': ((this.currentIndex < 9) || (this.state.score < 1)) ? 0.0 : 1.0 }} className="check" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 72 72" width="64px" height="64px"><path d="M57.658,12.643c1.854,1.201,2.384,3.678,1.183,5.532l-25.915,40c-0.682,1.051-1.815,1.723-3.064,1.814	C29.764,59.997,29.665,60,29.568,60c-1.146,0-2.241-0.491-3.003-1.358L13.514,43.807c-1.459-1.659-1.298-4.186,0.36-5.646	c1.662-1.46,4.188-1.296,5.646,0.361l9.563,10.87l23.043-35.567C53.329,11.971,55.806,11.442,57.658,12.643z"/></svg> </h3>
                {/* (Similarity = {(this.state.score || 0).toFixed(3)})  </h3> { this.stateEmoji() } */}
                <ResponsiveContainer width="55%" height={300}>
                    <LineChart width={1300} height={300} ctiveDot={false} data={this.state.lineChartData}>
                        {/* <CartesianGrid strokeDasharray="3 3" /> */}
                        {/* <Tooltip /> */}
                        {/* <Legend /> */}
                        <Line type="monotone" dataKey="y" stroke="#FFD700" strokeWidth="5" activeDot={false} dot={false} />
                        <Line type="monotone" dataKey="base" stroke="#a8a4d8" strokeWidth="2" activeDot={false} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}