import React, { Component } from "react";
import { hot } from "react-hot-loader";
// import { BrowserRouter as Router } from "react-router-dom";

import { BrowserRouter as Router, Route, RouteComponentProps } from "react-router-dom";
import { UserInfoApis } from "@/apis";
import { UserInfo } from "@/apis/user_info";

// import About from "./pages/About";
import Header from '@/components/Header'
import Routes from "./routes";
import IdlDeploy from '@/pages/idl-deploy';
import IdlExecution from '@/pages/idl-execution';

import './App.css';
import styles from "@/common/styles/base.scss";

const basename = '/'

export interface IState {
  userInfo: UserInfo;
  permissionMap: any;
  loading: boolean;
  changeValue: (key: string, value: any) => void;
  toggleLoading: (loading: boolean) => void;
  updateSelectedTab: (selectedTab: string) => void;
};

export const Context = React.createContext({
  loading: false,
  changeValue: (key: string, value: any) => { },
  toggleLoading: (loading: boolean) => { }
});
class App extends Component {
  state: IState = {
    userInfo: undefined,
    permissionMap: undefined,
    loading: false,
    changeValue: (key, value) => {
      this.setState({ [key]: value });
    },
    toggleLoading: loading => {
      this.setState({ loading });
    },
    updateSelectedTab: selectedTab => {
      this.setState({ selectedTab })
    },
  };
  render() {
    return (
      <Router basename={basename}>
        <div className={styles.appContainer}>
            <Context.Provider value={this.state}>
              <Route path="/" render={(props: RouteComponentProps) => <Header {...props} />} />
              <Routes />
              {/* <div className="Content">
                <Route path="/idl/deploy" exact component={IdlDeploy} />
                <Route path="/idl/execution" exact component={IdlExecution} />
              </div> */}

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
