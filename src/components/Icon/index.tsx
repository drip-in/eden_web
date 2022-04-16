import * as React from "react";
import styles from './index.module.scss';

interface IconPropsType {
  iconClass: string;
  iconStyle?: React.CSSProperties;
}

const Icon: React.FC<IconPropsType> = props => (
  <a className={styles.icon}>
    <i className={`iconfont ${props.iconClass}`} style={props.iconStyle} />
  </a>
);

export default Icon;
