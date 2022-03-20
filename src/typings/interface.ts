export interface StatisticsTabs {
  id: number;
  label: string;
  level: number;
  key: string;
  span?: number;
}


export interface IdlVersionStruct {
  id: number;
  version: string;
  is_online: boolean;
  source_version?: string;
  desc?: string;
  extra?: string;
  create_by: string;
  update_by: string;
  create_time: number;
  update_time: number;
}

export enum IdlDeployStatus {
  INIT        = 10,
  DEPLOYING   = 20,
  IDL_GRAYING = 25,
  SUCCESS     = 30,
  CANCELED    = 40,
  ROLLBACK    = 50,
}

export interface IdlDeployRecordStruct {
  id: number;
  preVersion: string;
  version: string;
  status: IdlDeployStatus;
  desc?: string;
  deployConfig?: DeployConfig;
  deployResult?: DeployResult;
  extra?: string;
  createBy: string;
  updateBy: string;
  createTime?: number;
  updateTime?: number;
}

export enum PIPELINE_STAGE {
  SCOPE_CONFIG = 1,   //scope配置
  ROUTE_CONFIG = 2,   //路由配置
  META_CONFIG = 3,    //元信息配置
  DOC_CONFIG = 4,     //api文档
}

export interface DeployConfig {
  stageList: PIPELINE_STAGE[];
  apiList?: string[];
  needIssueIdl?: boolean;
}

interface StageState {
  stage: PIPELINE_STAGE;
  done: boolean;
  errorMsg: string;
}
export interface DeployResult {
  stageResult: StageState[];
}

export interface ScopeParam {
  scope: string;
  appId: number;
  needUserAuth: boolean;
  scopeDesc: string;
  baseQuota: number;
}

export interface RouteParam {
  psm: string;
  psmMethod: string;
  uri: string;
}

export interface MetaParam {
  httpMethod: string;
  name: string;
  desc: string;
  needUserAuth: boolean;
  scope: string;
  apiType: string;
  uri: string;
}

export interface TcePodStruct {
  groupName?: string;
  podName: string;
  dc: string;
  nodeIp: string;
  createTime: string;
  podStatus: string;
  ackGray: boolean;
  ackRollback: boolean;
}
export interface TcePodListStruct {
  groupName: string;
  list: TcePodStruct[];
}

export enum FlowToType{
  SUCCESS     = 1,
  ROLLBACK    = 2,
  CANCEL      = 3,
  IDL_GRAYING = 4,
}

export interface DocParam {
  apiUri: string;
  idlPath: string;
  apiTitle?: string;
}

