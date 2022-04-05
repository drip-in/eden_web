import * as React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { Tabs } from 'antd';
import { IdlDeployRecordStruct, IdlDeployStatus, TcePodStruct, FlowToType } from "../../typings/interface"
import {StatusType, StatusText} from "@/components/StatusButton";
import ScopeConfig from "./components/ScopeConfig"
import MetaConfig from "./components//MetaConfig"
import DocConfig from "./components/DocRelease"
// import cookie from 'js-cookie';
import "./index.scss";

const { TabPane } = Tabs;

const StatusMap = {
  [IdlDeployStatus.INIT]: StatusType.INIT,
  [IdlDeployStatus.DEPLOYING]: StatusType.DEPLOYING,
  [IdlDeployStatus.IDL_GRAYING]: StatusType.IDL_GRAYING,
  [IdlDeployStatus.SUCCESS]: StatusType.SUCCESS,
  [IdlDeployStatus.CANCELED]: StatusType.CANCELED,
  [IdlDeployStatus.ROLLBACK]: StatusType.ROLLBACK,
}

type ExcutionStep = {
  title: string;
  isCurrent: boolean;
  status: 'wait' | 'process' | 'finish' | 'error';
}

type State = {
  pid: number;
  deployRecord: IdlDeployRecordStruct;
  excutionSteps: ExcutionStep[];
  selectedStepIndex: number; 
  lastSuccessStepIndex: number;
  tcePodList: TcePodStruct[];
  loading: boolean;
  isAdmin: boolean;
};

export default class extends React.Component<RouteComponentProps, State> {

  onTabChange = () => {

  }

  render() {
    return (
      <div className={'apiConfigWrapper'}>
        <Tabs onChange={this.onTabChange} type="card">
          <TabPane tab="scope配置" key="1">
            <ScopeConfig />
          </TabPane>
          <TabPane tab="api meta配置" key="2">
            <MetaConfig />
          </TabPane>
          <TabPane tab="文档发布" key="3">
            <DocConfig />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}