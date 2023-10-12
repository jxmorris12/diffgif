import React from "react";
import * as d3 from "d3";
import Transition from "react-transition-group/Transition";

const ExitColor = "red", // brown
    UpdateColor = "#555", // #333
    EnterColor = "green";


let fontDetails = "48px monospace"
var lettersPerLine = 40
let letterSpacing = 32
let lineSpacing = 48

class Letter extends React.Component {
    defaultState = {
        x: this.getX(),
        y: this.getY(),
        color: EnterColor,
        fillOpacity: 1e-6
    };
    state = this.defaultState
    letterRef = React.createRef()

    getX() {
        return (this.props.index % lettersPerLine) * letterSpacing
    }

    getY() {
        return Math.floor(this.props.index / lettersPerLine) * lineSpacing
    }

    onEnter = () => {
        // Letter is entering the visualization
        let node = d3.select(this.letterRef.current);

        node.transition()
            .duration(750)
            .ease(d3.easeCubicInOut)
            .attr("y", this.getY())
            .style("fill-opacity", 1)
            .on("end", () => {
                this.setState({
                    fillOpacity: 1,
                    color: UpdateColor
                });
            });
    };

    onExit = () => {
        // Letter is dropping out
        let node = d3.select(this.letterRef.current);

        node.style("fill", ExitColor)
            .transition(this.transition)
            .attr("y", this.getY() + 60)
            .style("fill-opacity", 1e-6)
            .on("end", () => this.setState(this.defaultState));
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.in !== this.props.in && this.props.in) {
            // A new enter transition has begun
            this.setState({
                x: this.props.index * 32
            });
        } else if (prevProps.index !== this.props.index) {
            // Letter is moving to a new location
            let node = d3.select(this.letterRef.current),
                targetX = this.getX(),
                targetY = this.getY();

            node.style("fill", UpdateColor)
                .transition()
                .duration(750)
                .ease(d3.easeCubicInOut)
                .attr("x", targetX)
                .attr("y", this.getY())
                .on("end", () =>
                    this.setState({
                        x: targetX,
                        y: targetY,
                        color: UpdateColor
                    })
                );
        }
    }

    render() {
        const { x, y, fillOpacity, color } = this.state,
            { letter } = this.props;

        return (
            <Transition
                in={this.props.in}
                unmountOnExit={false}
                timeout={750}
                onEnter={this.onEnter}
                onExit={this.onExit}
            >
                <text
                    dy=".35em"
                    x={x}
                    y={y}
                    style={{
                        fillOpacity: fillOpacity,
                        fill: color,
                        font: fontDetails
                    }}
                    ref={this.letterRef}
                >
                    {letter}
                </text>
            </Transition>
        );
    }
}

export default Letter;
