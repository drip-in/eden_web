import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { RouteComponentProps, StaticContext } from "react-router";
import LoadPage from './utils/LoadPage';
import { UserInfo } from "@/apis/user_info";

function asyncComponent(getComponent) {
  return class AsyncComponent extends React.Component {
      static Component = null;
      state = { Component: AsyncComponent.Component };

      componentDidMount() {
          if (!this.state.Component) {
              getComponent().then(({ default: Component }) => {
                  AsyncComponent.Component = Component;
                  this.setState({ Component });
              });
          }
      }
      render() {
          const { Component } = this.state;
          if (Component) {
              return <Component {...this.props} />;
          }
          return null;
      }
  };
}

function load(component) {
  return import(`./pages/${component}`);
}

const IdlDeploy = asyncComponent(() => load('idl-deploy'));
const Editor = asyncComponent(() => load('MarkdownEditor'));
// const IdlDeploy = props => <LoadPage {...props}>{() => load("idl-deploy")}</LoadPage>
const IdlExecution = props => <LoadPage {...props}>{() => load("idl-execution")}</LoadPage>

export type RouteStruct = {
  name: string; // 显示在菜单上的项目名
  path: string; // 路径
  isExact?: boolean; // 是否精确匹配
  children?: RouteStruct[]; // 子路由
  shouldRender: (userInfo: UserInfo) => boolean; // 应当注册/显示该路由
  components: {
    default: (props: RouteComponentProps<{}, StaticContext, any>) => JSX.Element;
    mobile: (props: RouteComponentProps<{}, StaticContext, any>) => JSX.Element;
  },
};


const Routes: RouteStruct[] = [
  {
    name: "deploy",
    path: "/idl/deploy",
    isExact: true,
    shouldRender: (userInfo: UserInfo) => true,
    components: {
      default: (props: RouteComponentProps) => <IdlDeploy {...props} />,
      mobile: (props: RouteComponentProps) => null,
    }
  },
  {
    name: "execution",
    path: "/idl/execution",
    isExact: true,
    shouldRender: (userInfo: UserInfo) => true,
    components: {
      default: (props: RouteComponentProps) => <IdlExecution {...props} />,
      mobile: (props: RouteComponentProps) => null,
    }
  },
  {
    name: "编辑器",
    path: "/editor",
    isExact: true,
    shouldRender: (userInfo: UserInfo) => true,
    components: {
      default: (props: RouteComponentProps) => <Editor {...props} />,
      mobile: (props: RouteComponentProps) => null,
    }
  }
];

export default Routes;