import React, { Component } from "react";
import { hot } from "react-hot-loader";
// import { BrowserRouter as Router } from "react-router-dom";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// import About from "./pages/About";
import Home from "./pages/Home";
import Header from './components/Header'

import IdlVersion from '@/containers/idl-version';
import IdlDeploy from '@/containers/idl-deploy';
import IdlExecution from '@/containers/idl-execution';
import ApiConfig from '@/containers/api-config';
const IS_DEV = process.env.NODE_ENV !== 'production';
const basename = IS_DEV ? '/' : '/insights/lite'

export const Context = React.createContext({
  loading: false,
  toggle: (loading: boolean) => {}, 
});
class App extends Component {
  state = {
    loading: false,
    toggle: (loading) => {
        this.setState({ loading });
    }
  }
  render() {
    return (
      <Router basename={basename}>
        <div className="Router">
            <Context.Provider value={this.state}>
              <div className="Content">
                <Route exact path="/" component={Home} />
                <Route path="/idl/version" exact component={IdlVersion} />
                <Route path="/idl/deploy" exact component={IdlDeploy} />
                <Route path="/idl/execution" exact component={IdlExecution} />
                <Route path="/idl/config" exact component={ApiConfig} />
              </div>
            </Context.Provider>
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
