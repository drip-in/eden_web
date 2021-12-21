import React, { Component } from "react";
// import { BrowserRouter as Router } from "react-router-dom";
import * as styles from "./Header.style.module.less";

class Header extends Component<any, any> {
  render() {
    return <div className={styles.container}>抖音</div>;
  }
}

export default Header;
