import React from "react";
import PropTypes from "prop-types";

export default class DynamicImport extends React.Component {
  static prototypes = {
    onload: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  };
  state = {
    component: null
  };
  componentDidMount() {
    this.props.onload().then(component => {
      this.setState({
        component: component.default ? component.default : component
      });
    });
  }
  render() {
    return this.props.children(this.state.component);
  }
}

// console.log("heheda")
