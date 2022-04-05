import * as React from "react";
import { RouteComponentProps } from "react-router";

export default class LoadPage extends React.PureComponent<
RouteComponentProps & {
  children: () => Promise<{
    default: React.ComponentClass<any>;
  }>;
},
{
  Component: React.ComponentClass<any> | null;
}
> {
  constructor(props) {
    super(props);
    this.state = {
      Component: null,
    };
  }
  componentDidMount() {
    this.props
      .children()
      .then(Component => {
        this.setState({
          Component: Component.default,
        });
      });
  }

  render() {
    const { Component } = this.state;
    if (Component) {
        return <Component {...this.props} />;
    }
    return null;
}
}