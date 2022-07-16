import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { BrowserRouter as Router, Route, RouteComponentProps } from "react-router-dom";
import { Provider} from 'mobx-react';
import { Helmet } from "react-helmet";

import { PermissionKeys, PermissionStruct, UserInfo, UserInfoApis } from "@/apis/user_info";
import { createTheme, Theme } from '@/composables/theme'
import { Device } from "@/composables/device";
import { stores } from  '@/stores';
import Util from "@/utils";

// import About from "./pages/About";
import Header from '@/pages/Header'
import Routes, { RouteStruct } from "./routes";

import './App.css';
import '@/styles/app.scss';
import commonStyles from "@/styles/common.module.scss";

const basename = '/'

export interface ICreatorContext {
  theme: Theme;
  device: Device;
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
      device: Device.Desktop,
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

  generateRoutes = (pages: RouteStruct[], device: Device, parentRoutePath = "") => {
    const { userInfo } = this.state.context;
    return pages.map(route => {
      if (!route.shouldRender(userInfo)) {
        return null;
      }
      return route.children 
      ? this.generateRoutes(route.children, device, route.path) 
      : <Route 
        exact={route.isExact} 
        path={`${parentRoutePath}${route.path}`} 
        component={device == Device.Desktop ? route.components.default : route.components.mobile} 
        key={route.name} 
      />;
    });
  };

  render() {
    const { loaded } = this.state
    return (
      <>
        <Helmet>
          <html lang="cn" data-device={this.state.context.device} data-theme={this.state.context.theme} />
          <body />
          <title>drippin.cn</title>
        </Helmet>
        {loaded && (
          <Router basename={basename}>
            <div className={commonStyles.appContainer}>
              <Provider store = {stores}>
                <Route path="/" render={(props) => <Header {...props} />} />
                {/* 路由组件 */}
                <div>{Util.flattenArray(this.generateRoutes(Routes, this.state.context.device))}</div>
                {/* <Routes /> */}
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
