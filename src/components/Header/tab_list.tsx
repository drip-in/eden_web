import * as React from "react";
import { Component } from "react";
import { RouteComponentProps } from "react-router";

import styles from './index.module.scss';

enum Tabs {
  HOMEPAGE = '/',
  EXPLORE = '/explore',
}

interface Tab {
  tabId: Tabs;
  tabName: string;
  tabLink: string;
}

interface IProps {
  // userInfo: UserInfo;
}

interface State {
  tabs: Tab[];
  selectedTab: string;
};

class TabList extends Component<RouteComponentProps & IProps, State> {
  constructor(props: RouteComponentProps & IProps) {
    super(props);
    this.state = {
      selectedTab: props.location.pathname,  
      tabs: [
        {
          tabId: Tabs.HOMEPAGE,
          tabName: "首页",
          tabLink: "/",
        },
        {
          tabId: Tabs.EXPLORE,
          tabName: "发现",
          tabLink: "/explore",
        },
      ]
    };
  }
  componentDidMount(): void {
  }

  changeSelectedTab = (tab: string) => () => {
    this.setState({
      selectedTab: tab
    });
  };

  render() {
    const { tabs, selectedTab } = this.state;
    console.log(selectedTab)
    return (
      <ul className={styles.headerTabs}>
        {tabs.map(tab => (
            <li
              key={tab.tabId}
              id={tab.tabId} 
              className={styles.tabItem} 
              onClick={this.changeSelectedTab(tab.tabLink)}
            >
              <a onClick={() => this.props.history.push(tab.tabLink)} className={`${styles.tabLink} ${selectedTab === tab.tabLink ? styles.active : ''}`}>
                {tab.tabName}
              </a>
            </li>
          ))}
      </ul>
    )
  }

}

export default TabList;