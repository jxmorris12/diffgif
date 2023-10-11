import React, { Component } from "react";

import Alphabet from "./components/Alphabet";
import FancyText from "./components/FancyText";

import difflib from "difflib"


// // Call the updateContent function every 2500ms (2.5 seconds)
// // var interval = setInterval(updateContent, 2500);
// var interval = setInterval(updateContent, 1200);
let original = "Nabo Gass (25 August, 1954 in Ebingen, Germany) is a German painter and glass artist."

// let rounds = [
//     [0.853, "Nabo Gass (11 August 1974 in Erlangen, Germany) is an artist.", false],
//     [0.994, "Nabo Gass (b. 18 August 1954 in Egeland, Germany) is a German painter and glass artist.", false],
//     [0.998, "Nabo Gass (25 August 1954 in Ebingen, Germany) is a German painter and glass artist.", false],
//     [1.00, "Nabo Gass (25 August, 1954 in Ebingen, Germany) is a German painter and glass artist.", true],
// ]

let rounds = [
    'vectext2 is an algorithm for recovering text from vector inputs. Using vectext2, we can recover text from vector inputs, which approximates 90% of embedded text.',
    'vcov2 text is an algorithm for recovering text from embedded velocities. Using vcov2 text, we can recover text from embedded velocities, which can give a prediction of over 90%.',
    'vetex2 is an algorithm for recovering text from embedded text. In vetex2 we can recover text from embedded text, and it approximates 90% of inputs.',
    'vectext2 is an algorithm for recovering text from embedded vectors, using a vectorization. In vectext2, we can recover text from embedded vectors, which is almost 100%.',
    'vtex2 is an algorithm for recovering text from vector inputs, using encoding. Using vtex2 we can recover text from vector inputs, which approximate 90% encoding.',
    'vectext2 is an algorithm for recovering text from vectext embeds. Using vectext2, we can recover text from vectext embeds, which approximates 90% of the inputs.',
    'vec2text is an algorithm for recovering text from text embeds. Using vec2text, we can recover text from text embeds, which can put out over 90% of a given input.',
    'vec2text is an algorithm for recovering text from text embeddings. Using vec2text, we can recover over 90% of text inputs from embeddings exactly.',
    'vec2text is an algorithm for recovering text from text embeddings. In vec2text, we can recover text from text embeddings, exactly 90% of inputs.',
    'vec2text is an algorithm for recovering text from text embeddings. Using vec2text, we can recover over 90% of text from text inputs.',
]

class App extends Component {
    state = { text: "" };
    currentIndex = 0

    changeText(event) {
        console.log('changeText', event.target.value )
        this.setState({ text: event.target.value });
    }

    updateContent() {
        let textBox = document.getElementById("guessTextBox")
        const newText = rounds[this.currentIndex] // [1]
        textBox.value = newText
        this.currentIndex = (this.currentIndex + 1) % rounds.length // Cycle through the array
        
        this.setState({ text: newText})
    }

    componentDidMount() {
        this.interval = setInterval(() => {
          this.updateContent();
        }, 2500); // Call myFunction() every so many milliseconds
      }

    render() {
        return (
            <div className="container">
                <h2>
                    Animated typing built with React 16+, D3js v5, and
                    react-transition-group v2
                </h2>
                <input
                    type="text"
                    id="guessTextBox"
                    value={this.state.text}
                    disabled
                    onChange={this.changeText.bind(this)}
                    placeholder=""
                    style={{
                        padding: ".6em",
                        fontSize: "1.2em",
                        margin: "0px auto",
                        width: "80%"
                    }}
                />
                <svg width="100%" height="600">
                    <FancyText x="32" y="300" text={this.state.text} />
                    {/* <Alphabet x={32} y={300} /> */}
                </svg>
            </div>
        );
    }
}

export default App;
