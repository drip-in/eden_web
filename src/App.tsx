import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { BrowserRouter as Router, Route, RouteComponentProps } from "react-router-dom";
import { Provider} from 'mobx-react';
import { Helmet } from "react-helmet";

import { PermissionKeys, PermissionStruct, UserInfo, UserInfoApis } from "@/apis/user_info";
import { createTheme, Theme } from '@/composables/theme'
import { stores } from  '@/stores/index';

// import About from "./pages/About";
import Header from '@/pages/Header'
import Routes from "./routes";

import './App.css';
import '@/styles/app.scss';
import commonStyles from "@/styles/common.module.scss";

const basename = '/'

export interface ICreatorContext {
  theme: Theme;
  device: string;
  language: string;
  userAgent: string;

  userInfo: UserInfo;
  permissionList: PermissionStruct[];
}

export interface IState {
  context: ICreatorContext;
  userInfo: UserInfo;
  loaded: boolean;
};


class App extends Component {
  state: IState = {
    context: {
      theme: Theme.Light,
      device: "desktop",
      language: "",
      userAgent: "",
      userInfo: undefined,
      permissionList: [],
    },
    userInfo: undefined,
    loaded: false,
  };

  componentDidMount() {
    stores.userInfoStore
    .fetchUserInfo({ notNotifyOnError: true })
    .then(() => {
      this.setState({ loaded: true })
    })
  }

  render() {
    const { loaded } = this.state
    return (
      <>
        <Helmet>
          <html lang="cn" data-device={this.state.context.device} data-theme={this.state.context.theme} />
          <body />
          <title>deesta.cn</title>
        </Helmet>
        {loaded && (
          <Router basename={basename}>
            <div className={commonStyles.appContainer}>
              <Provider store = {stores}>
                <Route path="/" render={(props) => <Header {...props} />} />
                <Routes />
              </Provider>
            </div>
          </Router>
        )}
      </>
    );
  }
}

(async () => {
  console.log(
    'You have async support if you read this instead of "ReferenceError: regeneratorRuntime is not defined" error.'
  );
})();

export default hot(module)(App);
