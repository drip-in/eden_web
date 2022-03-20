import * as React from "react";
import "./index.scss";
import { Tooltip } from "antd";

export enum StatusType {
  INIT = "init",
  DEPLOYING = "deploying",
  IDL_GRAYING = "idl_graying",
  SUCCESS = "success",
  CANCELED = "canceled",
  ROLLBACK = "rollback",
}

export enum StatusText {
  "init" = "初始化",
  "deploying" = "发布中",
  "idl_graying" = "灰度中",
  "success" = "成功",
  "canceled" = "已取消", //
  "rollback" = "已回滚", //
}

interface Props {
  text?: string;
  type: StatusType;
  toolTipText?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const StatusButton = (props: Props) =>
  props.toolTipText ? (
    <Tooltip title={props.toolTipText} style={props.style}>
      <div onClick={props.onClick} className={`commonStatus ${props.type}`}>
        {props.text || StatusText[props.type]}
      </div>
    </Tooltip>
  ) : (
    <div style={props.style} onClick={props.onClick} className={`commonStatus ${props.type}`}>
      {props.text || StatusText[props.type]}
    </div>
  );

StatusButton.defaultProps = {
  onClick: () => {}
};

export default StatusButton;
