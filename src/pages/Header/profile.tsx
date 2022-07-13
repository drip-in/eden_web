import * as React from "react";
import { Component } from "react";
import { RouteComponentProps } from "react-router";
import { Dropdown, Avatar } from "antd";

import { UserInfoApis, CSRF_TOKEN } from "@/apis";
import { UserInfo } from "@/apis/user_info";
import { stores } from '@/stores/index';

import styles from './index.module.scss';


interface MenuItemStruct {
  itemIconClass: string;
  itemName: string;
  clickFunc?: () => void;
}

const MenuItem: React.FC<MenuItemStruct> = props => (
  <li className={`${styles.menuItemWrapper} ${styles.css}`} onClick={props.clickFunc}>
    <a className={styles.menuIcon}>
      <i className={`iconfont ${props.itemIconClass} ${styles.iconCss}`} />
    </a>
    <div>{props.itemName}</div>
  </li>
);

interface IProps {
  userInfo: UserInfo;
}

interface State {
  profileMenus: MenuItemStruct[];
};

class Profile extends Component<RouteComponentProps & IProps, State> {
  constructor(props: RouteComponentProps & IProps) {
    super(props);
    this.state = {
      profileMenus: [
        {
          itemIconClass: "icon-a-24-bianji",
          itemName: "创作中心",
        },
        {
          itemIconClass: "icon-a-3-shouye",
          itemName: "我的主页",
        },
        {
          itemIconClass: "icon-a-29-xingji",
          itemName: "我的收藏",
        },
        // {
        //   itemIconClass: "",
        //   itemName: "浏览记录",
        // },
        {
          itemIconClass: "icon-a-4-shezhi",
          itemName: "设置",
        },
        {
          itemIconClass: "icon-a-73-tuichu",
          itemName: "退出",
          clickFunc: this.logout
        },
      ]
    };
  }

  logout = () => {
    window.localStorage.setItem(CSRF_TOKEN, "");
    UserInfoApis
    .userLogout()
    .then(() => {
      stores.userInfoStore.resetUserInfo()
    });
  };

  renderDropdownMenu = () => {
    const { profileMenus } = this.state;
    return (
      <ul className={styles.profileMenu}>
        {
          profileMenus.map(item => (
            <MenuItem 
              key={item.itemIconClass}
              itemIconClass={item.itemIconClass} 
              itemName={item.itemName}
              clickFunc={item.clickFunc}
            />
          ))
        }
      </ul>
    )
  }

  render() {
    const { userInfo } = this.props
    return (
      <li className={styles.profile}>
        <Dropdown
          placement="bottom"
          trigger={["click"]}
          overlay={this.renderDropdownMenu()}
        >
          <p className={styles.user}>
            <Avatar src={userInfo.avatar_url} style={{ width: 36, height: 36 }} />
          </p>
        </Dropdown>
      </li>
    )
  }
}

export default Profile;