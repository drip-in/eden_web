import React, { Component } from "react";
import { hot } from "react-hot-loader";
// import { BrowserRouter as Router } from "react-router-dom";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// import About from "./pages/About";
import Home from "./pages/Home";
import Header from './components/Header'

class App extends Component {
  render() {
    return (
      <Router basename={location.pathname}>
        <div>
          <Header />
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/dynamic">Dynamic</Link>
            </li>
          </ul>
          <hr />
          <Route exact path="/" component={Home} />
          {/* <Route path="/about" component={About} /> */}
        </div>
      </Router>
    );
  }
}

(async () => {
  console.log(
    'You have async support if you read this instead of "ReferenceError: regeneratorRuntime is not defined" error.'
  );
})();

export default hot(module)(App);
