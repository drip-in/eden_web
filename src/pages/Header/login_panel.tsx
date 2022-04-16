import * as React from "react";
import { Component } from "react";
import { RouteComponentProps } from "react-router";
import { Dropdown, Avatar, Button } from "antd";

import { UserInfoApis } from "@/apis";
import { UserInfo } from "@/apis/user_info";
import { baseResponseStruct } from "@/apis/base";

import styles from './index.module.scss';

enum LoginAuthType {
  PASSWORD = 1,
  CAPTCHA  = 2,
  WEIXIN   = 3,
  GITHUB   = 4,
}

interface IProps {
  onLogin: (authType, identifier, credential) => Promise<baseResponseStruct>
}

interface State {
  authType: LoginAuthType;
  email?: string;
  password?: string;
  captcha?: string;
  // profileMenus: MenuItemStruct[];
};

class LoginPanel extends Component<RouteComponentProps & IProps, State> {
  constructor(props: RouteComponentProps & IProps) {
    super(props);
    this.state = {
      authType: LoginAuthType.CAPTCHA
    };
  }

  setEmail = () => {

  }

  setPassword = () => {

  }

  setCaptcha = () => {

  }

  onEmailBlur = e => {

  }

  onEmailFocus = e => {
    
  }

  onPasswordBlur = e => {

  }

  onPasswordFocus = e => {

  }

  onCaptchaBlur = e => {

  }

  onCaptchaFocus = e => {

  }

  onLogin = () => {
    const { authType, email, captcha, password } = this.state
    switch (authType){
      case LoginAuthType.CAPTCHA:
        this.props.onLogin(authType, email, captcha)
        .then(
          resp => {

          }
        )
        return
      case LoginAuthType.PASSWORD:
        this.props.onLogin(authType, email, password)
        .then(
          resp => {
            if (resp.status_code == 0) {
              // this.setState()
            }
          }
        )
        return
    }
    
  }

  renderEmailLogin = () => {
    const { authType, email, password } = this.state
    return (
      <div className={styles.panel}>
        <h1 className={styles.title}>{authType == LoginAuthType.CAPTCHA ? "邮箱登录" : "用户登录"}</h1>
        <div className={styles.inputGroup}>
          <div className={styles.inputBox}>
            <input
                value={email}
                placeholder='邮箱'
                maxLength={30}
                autoFocus
                onChange={this.setEmail}
                onBlur={this.onEmailBlur}
                onFocus={this.onEmailFocus}       
                // ref={elem => (this.inputElem = elem)}
            />
            {/* <p>物流单号不能包含特殊字符</p> */}
          </div>
          {authType == LoginAuthType.PASSWORD && (
            <div className={styles.inputBox}>
              <input
                  value={email}
                  placeholder='密码'
                  maxLength={30}
                  autoFocus
                  onChange={this.setPassword}
                  onBlur={this.onPasswordBlur}
                  onFocus={this.onPasswordFocus}       
                  // ref={elem => (this.inputElem = elem)}
              />
              {/* <p>物流单号不能包含特殊字符</p> */}
            </div>
          )}
          {authType == LoginAuthType.CAPTCHA && (
            <div className={styles.inputBox}>
              <input
                  value={email}
                  placeholder='验证码'
                  maxLength={10}
                  autoFocus
                  onChange={this.setCaptcha}
                  onBlur={this.onCaptchaBlur}
                  onFocus={this.onCaptchaFocus}       
                  // ref={elem => (this.inputElem = elem)}
              />
              <p className={styles.emailNote}>新邮箱将自动注册</p>
            </div>
          )}
        </div>
        <Button onClick={this.onLogin} type={"primary"} style={{width: '100%', height: 40}}>
          登录
        </Button>
        <div className={styles.loginNav}>
          <a className={`${styles.loginMode} ${authType == LoginAuthType.CAPTCHA ? styles.selected : ''}`} onClick={() => {this.setState({authType: LoginAuthType.CAPTCHA})}} data-mode="captcha">验证登录</a>
          <span className={styles.border} />
          <a className={`${styles.loginMode} ${authType == LoginAuthType.PASSWORD ? styles.selected : ''}`} onClick={() => {this.setState({authType: LoginAuthType.PASSWORD})}} data-mode="password">密码登录</a>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderEmailLogin()}
      </div>
    )
  }
}

export default LoginPanel;