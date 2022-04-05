import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import LoadPage from './utils/LoadPage';
import styles from "@/common/styles/base.scss";

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

// const IdlDeploy = props => <LoadPage {...props}>{() => load("idl-deploy")}</LoadPage>
// const IdlExecution = props => <LoadPage {...props}>{() => load("idl-execution")}</LoadPage>


export default class Routes extends Component {
  render() {
      return (
        <div className={styles.wrapper}>
          <Route path="/idl/deploy" exact component={IdlDeploy} />
          {/* <Route path="/idl/execution" exact component={IdlExecution} /> */}
        </div>
      );
  }
}
