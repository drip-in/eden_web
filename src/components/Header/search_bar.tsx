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
};

class SearchBar extends Component<RouteComponentProps & IProps, State> {
  constructor(props: RouteComponentProps & IProps) {
    super(props);
    this.state = {
      searchInput: "", 
      placeholder: "搜索",
      inputLimit: 20,
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
    const { searchInput, inputLimit, placeholder } = this.state
    return (
      <form className={styles.searchBar}>
        <Dropdown
          overlay={this.renderDropdownMenu()}
        >
          <div className={styles.inputWrapper}>
            <input type='text' value={searchInput} placeholder={placeholder} maxLength={inputLimit || Infinity} onChange={this.onChange} />
            <div className={styles.searchIconWrapper}>
              <a className={styles.icon}>
                <i className="iconfont icon-sousuotubiao" />
              </a>
            </div>
          </div>
        </Dropdown>
      </form>
    )
  }
}

export default SearchBar;