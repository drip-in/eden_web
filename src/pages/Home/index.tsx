import React from "react";

// import logo from "../../Assets/react-js-development-1.png";
import { Button } from "antd";

export default class Home extends React.Component<any, any> {
  state = {
    title: "Welcome to React!"
  };
  static getData() {
    return "data!";
  }
  render() {
    return (
      <div>
        {/* <img src={logo} /> */}
        <p>Welcome to react</p>
        {/* <p>{this.state.title}</p> */}
        <p>this scaffolding features:</p>
        <Button>123</Button>
        <ul>
          <li>hot module replacement</li>
          <li>dynamic import(code splitting) with js and css</li>
          <li>es lint and commit hook</li>
          <li>typescript(optional)</li>
        </ul>
      </div>
    );
  }
}
