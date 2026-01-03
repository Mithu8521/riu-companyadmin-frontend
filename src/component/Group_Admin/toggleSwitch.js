import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import Switch from "react-switch";

class ToggleSwitch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  handleChange = (nextChecked) => {
    this.setState({ checked: nextChecked });
  };

  render() {
    const id = uuidv4(); // Generate a unique ID for each instance

    return (
      <Switch
        id={id}
        onChange={this.handleChange}
        checked={this.state.checked}
        className="react-switch"
      />
    );
  }
}

export default ToggleSwitch;
