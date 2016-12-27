import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import SelectBox from "../src/js/select-box";

class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: null,
      colors: []
    };
  }

  handleChange(color) {
    this.setState({color});
  }

  handleMultiChange(colors) {
    this.setState({colors});
  }

  render() {
    return <div className="example">
      <h1>React Select Box 2 Single Example</h1>
      <SelectBox label="Favorite Color" onChange={value => this.handleChange(value)}
                 className="my-example-select-box" value={this.state.color}>
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
        <option value="black">Black</option>
        <option value="orange">Orange</option>
      </SelectBox>
      <h1>React Select Box 2 Multi Select Example</h1>
      <SelectBox label="Favorite Color" onChange={value => this.handleMultiChange(value)}
                 className="my-example-select-box" value={this.state.color}>
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
        <option value="black">Black</option>
        <option value="orange">Orange</option>
      </SelectBox>
    </div>
  }
}

ReactDOM.render(Example(null), document.querySelector("#main"));
