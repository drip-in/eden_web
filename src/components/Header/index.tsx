import * as React from "react";
import { Component } from "react";
import { RouteComponentProps } from "react-router";
import { observer, inject } from 'mobx-react';
import { Dropdown, Avatar } from "antd";

import TabList from "./tab_list";
import SearchBar from "./search_bar";

import logo from "@/assets/react-js-development.png";

import { stores } from '@/stores/index';
import { UserInfoApis } from "@/apis";
import { UserInfo } from "@/apis/user_info";

import commonStyles from "@/styles/common.module.scss";
import styles from './index.module.scss';

export interface IProps {
  // userInfo: UserInfo;
}

interface State {
  loading: boolean;
};

@observer
class Header extends Component<IProps & RouteComponentProps, State> {
  state: State = {
    loading: false
  }
  componentDidMount(): void {
    
  }
  logout = () => {
    UserInfoApis.userLogout();
  };

  render() {
    const { userInfo } = stores.userInfoStore;
    return userInfo && (
      <div>
        <header className={styles.appHeader}>
          <div className={`${styles.headerContainer} ${commonStyles.centeredFlex} header-container`} style={{ justifyContent: "space-between" }}>
            <a className={styles.logo} href="/hot">
              <img src={logo} />
              滴石社区
            </a>
            <div className={styles.headerNav}>
              <ul className={styles.navList}>
                <li className={styles.leftNavList}>
                  <TabList {...this.props}></TabList>
                </li>
                <ul className={styles.rightNavList}>
                  <SearchBar {...this.props} />
                  <Dropdown
                    overlay={
                      <ul className={styles.dropdownMenu}>
                        <li onClick={this.logout}>退出登录</li>
                      </ul>
                    }
                  >
                    <p className={styles.user}>
                      <Avatar src={userInfo.avatar_url} style={{ marginRight: 12, width: 36, height: 36 }} />
                      {userInfo.nick_name}
                    </p>
                  </Dropdown>
                </ul>
              </ul>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default Header;
