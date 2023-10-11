import React, { Component } from "react";
import { TransitionGroup } from "react-transition-group";
import * as d3 from "d3";

import Letter from "./Letter";
import { SequenceMatcher, contextDiff } from "difflib";


class FancyText extends Component {
    state = {
        textWithIds: [],
        lastId: 0
    };

    componentDidUpdate(prevProps) {
        if (prevProps.text === this.props.text) return;

        const oldText = this.state.textWithIds
        const newText = this.props.text.split("")

        const oldTextStr = (oldText.map((x) => x[0])).join("")
        const newTextStr = this.props.text

        console.log("old Text:", oldTextStr, "new text:", newTextStr)
        let indexOfChange = 0,
            sizeOfChange = 0,
            newLastId = this.state.lastId;
        
        let matching = new SequenceMatcher(null, newTextStr, oldTextStr)
        let diff = contextDiff(oldText, newText)

        let newTextWithIds = {}

        // fill out old ids
        console.log('blocks:', matching.getMatchingBlocks())
        matching.getMatchingBlocks().forEach(
            (obj) => {
                let [i, j, n] = obj
                // newText[i:i+n] == oldText[j:j+n]
                for(let idx = 0; idx < n; idx++) {
                    console.log('i, j, n, idx', i,j,n,idx)
                    newTextWithIds[i + idx] = oldText[j + idx][1]
                    console.log('setting', i+idx)
                }
            }
        )
        // fill out new ids

        let newTextArr = []
        for(let i = 0; i < newText.length; i++) {
            if(i in newTextWithIds) {
                newTextArr.push([newText[i], newTextWithIds[i]])
            } 
            else {
                newTextArr.push([newText[i], newLastId++])
            }
        }

        this.setState({
            textWithIds: newTextArr,
            lastId: newLastId
        });
    }

    render() {
        let { x, y } = this.props;

        return (
            <g transform={`translate(${x}, ${y})`}>
                <TransitionGroup component="g" enter={true} exit={true}>
                    {this.state.textWithIds.map(([l, id], i) => (
                        <Letter letter={l} index={i} key={id} />
                    ))}
                </TransitionGroup>
            </g>
        );
    }
}

export default FancyText;
