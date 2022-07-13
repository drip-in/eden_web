import * as React from "react";
import { Component } from "react";
import { RouteComponentProps } from "react-router";
import { Dropdown } from "antd";

import Icon from '@/components/Icon';
import styles from './index.module.scss';

interface IProps {
  // userInfo: UserInfo;
}

interface State {
  messageNum: number;
};

class Notification extends Component<RouteComponentProps & IProps, State> {
  constructor(props: RouteComponentProps & IProps) {
    super(props);
    this.state = {
      messageNum: 49,
    };
  }

  renderDropdownMenu = () => {
    return (
      <div>
        <ul className={styles.dropdownMenu}>
          <li>搜索历史记录</li>
        </ul>
      </div>
    )
  }

  onChange = e => {}

  render() {
    const { messageNum } = this.state
    return (
      <li className={styles.notification}>
        <Dropdown
          placement="bottom"
          trigger={["click"]}
          overlay={this.renderDropdownMenu()}
          arrow
        >
          <div className={styles.notificationWrapper}>
            <div className={styles.iconWrapper}>
              <Icon iconClass="icon-tongzhi" iconStyle={{fontSize: 28}} />
            </div>
            {!!messageNum && <div className={styles.badge}>{messageNum}</div>}
          </div>
        </Dropdown>
      </li>
    )
  }
}

export default Notification;