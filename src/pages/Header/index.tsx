import * as React from "react";
import { Component } from "react";
import { RouteComponentProps } from "react-router";
import { observer, inject } from 'mobx-react';
import { Button, Modal } from "antd";

import TabList from "./tab_list";
import SearchBar from "./search_bar";
import Notification from "./notification";
import Profile from "./profile";
import LoginPanel from "./login_panel";

import logo from "@/assets/logo.png";
import deesta from "@/assets/deesta.png";

import { stores } from '@/stores/index';
import { UserInfoApis, CSRF_TOKEN } from "@/apis";
import { UserInfo, LoginAuthType } from "@/apis/user_info";

import commonStyles from "@/styles/common.module.scss";
import styles from './index.module.scss';
import { resolve } from "path";

export interface IProps {
  // userInfo: UserInfo;
}

interface State {
  isModalVisible: boolean;
};

@observer
class Header extends Component<IProps & RouteComponentProps, State> {
  state: State = {
    isModalVisible: false
  }

  showLoginModal = () => {
    this.setState({ isModalVisible: true })
  }

  handleCancel = () => {
    this.setState({ isModalVisible: false })
  }

  onLogin = (authType, identifier, credential) => {
    return UserInfoApis.userLogin({
      login_auth_type: authType,
      identifier,
      credential
    }).then(
      resp => {
        if (resp.status_code == 0) {
          this.setState({ isModalVisible: false })
          window.localStorage.setItem(CSRF_TOKEN, resp.token);
          // 
          window.location.reload()
        }
        return resp
      }
    )
  }

  renderLoginBtn = () => {
    return (
      <li className={styles.loginItem}>
        <Button onClick={this.showLoginModal} type={"primary"}>
          注册登录
        </Button>
      </li>
    )
  }

  render() {
    const { userInfo } = stores.userInfoStore;
    const { isModalVisible } = this.state;
    return (
      <div>
        <header className={styles.appHeader}>
          <div className={`${styles.headerContainer} ${commonStyles.centeredFlex} header-container`} style={{ justifyContent: "space-between" }}>
            <a className={styles.logo} href="/hot">
              <img src={logo} />
              <img src={deesta} />
            </a>
            <div className={styles.headerNav}>
              <ul className={styles.navList}>
                <li className={styles.leftNavList}>
                  <TabList {...this.props}></TabList>
                </li>
                <ul className={styles.rightNavList}>
                  <SearchBar {...this.props} />
                  {!!userInfo ? (
                    <>
                      <Notification {...this.props} />
                      <Profile {...this.props} userInfo={userInfo} />
                    </>
                  ) : (
                    this.renderLoginBtn()
                  )}
                </ul>
              </ul>
            </div>
          </div>
        </header>
        <div className={styles.modalContainer}>
          <Modal 
            visible={isModalVisible} 
            footer={null}
            onCancel={this.handleCancel}
            centered={true}
            destroyOnClose={true}
            width={320}
          >
            <LoginPanel {...this.props} onLogin={this.onLogin} />
          </Modal>
        </div>
      </div>
    );
  }
}

export default Header;
