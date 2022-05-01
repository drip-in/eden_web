import * as React from "react";
import { Component } from "react";
import { RouteComponentProps } from "react-router";
import { Dropdown, Avatar, Button } from "antd";

import { UserInfoApis } from "@/apis";
import { UserInfo, LoginAuthType } from "@/apis/user_info";
import { baseResponseStruct } from "@/apis/base";

import styles from './index.module.scss';


interface IProps {
  onLogin: (authType, identifier, credential) => Promise<baseResponseStruct>
}

interface State {
  authType: LoginAuthType;
  email?: string;
  password?: string;
  captcha?: string;
  focusCaptcha?: boolean;
  remainSecond?: number;
  errMsg?: string;
  loading?: boolean;
  // profileMenus: MenuItemStruct[];
};

class LoginPanel extends Component<RouteComponentProps & IProps, State> {
  constructor(props: RouteComponentProps & IProps) {
    super(props);
    this.state = {
      authType: LoginAuthType.CAPTCHA,
      email: "",
      password: "",
      captcha: "",
      remainSecond: 0,
    };
  }

  timeInterval = null;

  componentWillUnmount() {
    clearInterval(this.timeInterval)
  }

  setEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: e.target.value })
  }

  setPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value })
  }

  setCaptcha = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ captcha: e.target.value.slice(0, 6) })
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
    this.setState({ focusCaptcha: false })
  }

  onCaptchaFocus = e => {
    this.setState({ focusCaptcha: true })
  }

  forgetPassword = () => {
    
  }

  alterAuthType = (authType: LoginAuthType) => () => {
    this.setState({ authType })
    this.resetState()
  }

  resetState = () => {
    this.setState({
      errMsg: "",
      email: "",
      password: "",
      captcha: "",
    })
  }

  handleVerify = () => {
    const { email, remainSecond, loading } = this.state;
    if (!loading && remainSecond === 0 && email.length > 0) {
      this.setState({ loading: true, errMsg: "" });
      UserInfoApis.sendCaptcha({
          email,
      }).then(
        resp => {
          if (resp.status_code === 0) {
            this.setState(
              { remainSecond: 60, loading: false },
              () => {
                if (this.timeInterval) {
                    clearInterval(this.timeInterval);
                }
                this.timeInterval = setInterval(() => {
                    const { remainSecond } = this.state;
                    if (remainSecond === 0) {
                        clearInterval(this.timeInterval);
                        return;
                    }
                    this.setState({ remainSecond: remainSecond - 1 });
                }, 1000);
              }
            );
          }
        }
      )
    }
  }

  onLogin = () => {
    const { authType, email, captcha, password } = this.state
    switch (authType){
      case LoginAuthType.CAPTCHA:
        this.props.onLogin(authType, email, captcha)
        .then(
          resp => {
            if (resp.status_code == 0) {
              // this.setState()
            } else {
              if (resp.status_code == 1003) {
                this.setState({ errMsg: resp.status_msg })
              }
            }
          }
        )
        return
      case LoginAuthType.PASSWORD:
        this.props.onLogin(authType, email, password)
        .then(
          resp => {
            if (resp.status_code == 0) {
              // this.setState()
            } else {
              if (resp.status_code == 1004  || resp.status_code == 1006) {
                this.setState({ errMsg: "账号或者密码不正确" })
              } 
            }
          }
        )
        return
    }
    
  }

  renderEmailLogin = () => {
    const { authType, email, password, captcha, remainSecond, focusCaptcha, errMsg } = this.state
    return (
      <div className={styles.panel}>
        <h1 className={styles.title}>{authType == LoginAuthType.CAPTCHA ? "邮箱登录" : "用户登录"}</h1>
        <div className={styles.inputGroup}>
          {authType == LoginAuthType.PASSWORD && (
            <>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  value={email}
                  placeholder='邮箱'
                  maxLength={30}
                  autoFocus
                  onChange={this.setEmail}
                  onBlur={this.onEmailBlur}
                  onFocus={this.onEmailFocus}       
                  // ref={elem => (this.inputElem = elem)}
                />
              </div>
              <div className={styles.inputBox}>
                <input
                  type="password"
                  value={password}
                  placeholder='密码'
                  maxLength={30}
                  autoFocus
                  onChange={this.setPassword}
                  onBlur={this.onPasswordBlur}
                  onFocus={this.onPasswordFocus}       
                    // ref={elem => (this.inputElem = elem)}
                />
              </div>
              <div className={styles.bottomItems}>
                <div className={styles.errMsg}>{errMsg}</div>
                <a className={`${styles.textEnd} ${styles.clickable}`} onClick={this.forgetPassword}>忘记密码</a>
              </div>
            </>
          )}
          {authType == LoginAuthType.CAPTCHA && (
            <>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  value={email}
                  placeholder='邮箱'
                  maxLength={30}
                  autoFocus
                  onChange={this.setEmail}
                  onBlur={this.onEmailBlur}
                  onFocus={this.onEmailFocus}       
                />
              </div>
              <div className={styles.inputBox}>
                <div className={`${styles.inputWrapper} ${focusCaptcha ? styles.inputFocused : ""}`}>
                  <input
                    type="text"
                    value={captcha.length ? captcha : ''}
                    placeholder='请输入验证码'
                    onChange={this.setCaptcha}
                    onBlur={this.onCaptchaBlur}
                    onFocus={this.onCaptchaFocus}  
                  />
                  <div className={styles.timing} onClick={this.handleVerify}>{remainSecond ? `${remainSecond}s` : '获取验证码'}</div>
                </div>
              </div>
              {!!errMsg && <p className={styles.errMsg}>{errMsg}</p>}
            </>
          )}
          {authType == LoginAuthType.CAPTCHA && <p className={styles.emailNote}>新邮箱将自动注册</p>}
        </div>
        <Button onClick={this.onLogin} type={"primary"} style={{width: '100%', height: 40}}>
          登录
        </Button>
        <div className={styles.loginNav}>
          <a className={`${styles.loginMode} ${authType == LoginAuthType.CAPTCHA ? styles.selected : ''}`} onClick={this.alterAuthType(LoginAuthType.CAPTCHA)} data-mode="captcha">验证登录</a>
          <span className={styles.border} />
          <a className={`${styles.loginMode} ${authType == LoginAuthType.PASSWORD ? styles.selected : ''}`} onClick={this.alterAuthType(LoginAuthType.PASSWORD)} data-mode="password">密码登录</a>
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