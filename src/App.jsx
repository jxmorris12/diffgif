import React, { Component } from "react";

// import './hinton/hinton.js'
// import * as d3 from "d3-hinton";
// import * as d3 from "d3";

// https://recharts.org/en-US/
// import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



import Alphabet from "./components/Alphabet";
import FancyText from "./components/FancyText";

import difflib from "difflib"


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


let original = "The marsh willow herb is a plant native to the northeastern United States. It grows best in damp habitats. Which of the following environmental changes would most likely cause a decrease in the marsh willow herb population in an area? (A) a rainstorm lasting several weeks (B) a drought lasting twelve months (C) unusually low temperatures during the month of July (D) unusually high temperatures during the month of January"

let text = [
    "The marsh willow herb is a plant native to the northeastern United States. It grows best in damp habitats. Which of the following environmental changes would most likely cause a decrease in the marsh willow herb population in an area? (A) a rainstorm lasting several weeks (B) a drought lasting twelve months (C) unusually low temperatures during the month of July (D) unusually high temperatures during the month of January",
    "The marsh willow herb is a plant found in the northeastern United States. It thrives in wet environments. What type of change would likely reduce the population of marsh willow herb in an area? (A) Heavy rain for many weeks (B) A year-long drought (C) Extremely cold temperatures in July (D) Very high temperatures in January.",
    "The marsh willow herb is a plant from the northeastern United States that does best in wet habitats. Which change would most likely decrease the number of marsh willow herbs in an area? (A) A long rainstorm (B) A year-long drought (C) Abnormally low temperatures in July (D) Abnormally high temperatures in January.",
    "The marsh willow herb is a plant native to the northeastern US that thrives in wet habitats. What change would likely reduce the population of marsh willow herb? (A) Long rainstorm (B) Year-long drought (C) Low July temperatures (D) High January temperatures.",
]


export default class App extends Component {
    state = { 
        text: "", 
        originalText: "", // original,
        // lineChartData: Array.from(EMBEDDINGS[0].slice(0, NumEmbeddingSamplePoints).entries()).map((a) => ({ x: a[0], base: Math.max(EMBEDDINGS[0][a[0]], minEmbeddingValue), y: 0 }))
    }
    currentIndex = 0
    score = null
    animationTimeout = 2500

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
        const newText = text[this.currentIndex]


        this.setState({ text: newText, originalText: original, })

        // todo do this by binding to state somehow?
        // let emb = listToMatrix(EMBEDDINGS[this.currentIndex].slice(0, NumEmbeddingSamplePoints), 20)
        // this.hintonDiagram.update(emb, 500)
        this.currentIndex = (this.currentIndex + 1) % text.length // Cycle through the array...
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
                <svg width="100%" height="500">
                    <FancyText x="0" y="20" text={this.state.originalText} />
                </svg>
                <h3> Hypothesis (Round {this.currentIndex}) </h3>
                <svg width="100%" height="500">
                    <FancyText x="0" y="20" text={this.state.text} />
                </svg>
            </div>
        );
    }
}