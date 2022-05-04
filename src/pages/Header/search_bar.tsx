import * as React from "react";
import { Component } from "react";
import { RouteComponentProps } from "react-router";
import { Dropdown } from "antd";

import styles from './index.module.scss';

interface IProps {
  // userInfo: UserInfo;
}

interface State {
  searchInput: string;
  placeholder: string;
  inputLimit: number;
  onFocus: boolean;
};

class SearchBar extends Component<RouteComponentProps & IProps, State> {
  constructor(props: RouteComponentProps & IProps) {
    super(props);
    this.state = {
      searchInput: "", 
      placeholder: "搜索",
      inputLimit: 20,
      onFocus: false,
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

  onFocus = e => {
    this.setState({ onFocus: true })
  }

  onBlur = e => {
    this.setState({ onFocus: false })
  }

  // Dropdown组件有个bug: 所包裹的元素不能动态修改宽度，否则会死循环导致页面卡住（具体原因不明）
  render() {
    const { searchInput, inputLimit, placeholder, onFocus } = this.state
    return (
      <form className={styles.searchBar}>
        <Dropdown
          trigger={["click"]}
          overlay={this.renderDropdownMenu()}
        >
          <div className={`${styles.inputWrapper} ${onFocus ? styles.focused : ""}`}>
            <input type='text' value={searchInput} placeholder={placeholder} maxLength={inputLimit || Infinity} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} />
            <div className={styles.searchIconWrapper}>
              <a className={styles.icon}>
                <i className={`iconfont icon-a-1-sousuo ${onFocus ? styles.active : ""}`} />
              </a>
            </div>
          </div>
        </Dropdown>
      </form>
    )
  }
}

export default SearchBar;