import * as React from "react";
import { Component } from "react";
import { RouteComponentProps } from "react-router";

import { Dropdown, Avatar } from "antd";
import TabList from "./tab_list";
import logo from "@/assets/react-js-development.png";

import { UserInfo, UserInfoApis } from "@/apis";

import * as commonStyles from "@/common/styles/base.scss";
import * as styles from './index.scss';


export interface IProps {
  // userInfo: UserInfo;
}

interface State {
  userInfo: UserInfo;
  loading: boolean;
};

class Header extends Component<IProps & RouteComponentProps, State> {
  state: State = {
    userInfo: {
      avatar_url: logo,
      level: 1,
      eden_uid: "123",
      nick_name: "turling",
    },
    loading: false
  }
  componentDidMount(): void {
    
  }
  logout = () => {
    UserInfoApis.userLogout();
  };

  render() {
    const { userInfo } = this.state;
    return userInfo && (
      <div className={`${styles.headContainer} ${commonStyles.centeredFlex}`} style={{ justifyContent: "space-between" }}>
        <div className={styles.headerInner}>
          <a className={styles.title} href="/hot">
            <img src={logo} />
            滴石社区
          </a>
          <TabList {...this.props}></TabList>
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
        </div>
        
        {/* )}
        </Consumer> */}
      </div>
    );
  }
}

export default Header;
