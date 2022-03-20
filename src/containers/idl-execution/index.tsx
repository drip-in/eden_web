import * as React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { Button, message, Divider, Steps, Table } from 'antd';
import {
  Loading3QuartersOutlined, 
  LeftOutlined
} from '@ant-design/icons';
import { IdlDeployRecordStruct, IdlDeployStatus, TcePodStruct, FlowToType } from "../../typings/interface"
import rpc from '@/common/utils/op';
import { formatDate } from "@/common/utils/date"
import {StatusType, StatusText} from "@/components/StatusButton";
import ScopeConfig from "./components/ScopeConfig"
import MetaConfig from "./components//MetaConfig"
import RouteConfig from "./components/RouteConfig"
// import cookie from 'js-cookie';
import "./index.scss";

const { Step } = Steps;

const StatusMap = {
  [IdlDeployStatus.INIT]: StatusType.INIT,
  [IdlDeployStatus.DEPLOYING]: StatusType.DEPLOYING,
  [IdlDeployStatus.IDL_GRAYING]: StatusType.IDL_GRAYING,
  [IdlDeployStatus.SUCCESS]: StatusType.SUCCESS,
  [IdlDeployStatus.CANCELED]: StatusType.CANCELED,
  [IdlDeployStatus.ROLLBACK]: StatusType.ROLLBACK,
}

const StepTitles = ["scope配置", "psm路由配置", "api meta配置", "IDL发布"]

// const username = cookie.get('_ssa_username');

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

  timeout: NodeJS.Timeout = null;

  constructor(props: RouteComponentProps) {
    super(props)
    this.state = {
      pid: Number(props.match.params.pid),
      deployRecord: null,
      excutionSteps: [],
      loading: false,
      selectedStepIndex: 0,
      lastSuccessStepIndex: -1,
      tcePodList: [],
      isAdmin: false
    }
  }

  componentDidMount() {
    this.getApiDeployRecord()
  }

  getApiDeployRecord = () => {
    rpc('GetApiDeployRecord', { UserName: 'username', RecordId: this.state.pid })
      .then(resp => {
        if (resp.baseResp.statusCode === 0) {
          this.processData((resp as any).record)
        }

        this.setState({
          loading: false,
        });
      })
      .catch(err => {
        message.error(err.message);
        this.setState({
          loading: false,
        });
      });
  }

  fetchIdlTcePodList = () => {
    this.setState({
      loading: true,
    });
    rpc('FetchIdlTcePodList', { UserName: 'username' })
      .then(resp => {
        if (resp.baseResp.statusCode === 0 && resp.podList && resp.podList.length) {
          let tcePodList = []
          for (let podGroup of resp.podList) {
            podGroup.list.forEach(pod => {
              tcePodList.push({groupName: podGroup.groupName, ...pod})
            })
          }
          this.setState({ 
            isAdmin: true,
            tcePodList 
          })

          if (this.timeout) {
            clearTimeout(this.timeout)
          } 
          this.timeout = setTimeout(this.fetchIdlTcePodList, 5000)
        }
        this.setState({
          loading: false,
        });
      })
      .catch(err => {
        message.error(err.message);
        this.setState({
          loading: false,
        });
      });
  }

  processData = (record: IdlDeployRecordStruct) => {
    const { deployResult, status } = record
    let lastSuccessStepIndex = -1
    if (deployResult && deployResult.stageResult) {
      for(let stage of deployResult.stageResult) {
        if (stage.stage - 1 > lastSuccessStepIndex && stage.done) lastSuccessStepIndex = stage.stage - 1 
      }  
    }
    let excutionSteps = [];
    for (let index = 0; index < 4; index++) {
      excutionSteps.push({
        title: StepTitles[index],
        isCurrent: index === lastSuccessStepIndex + 1,
        status: index <= lastSuccessStepIndex || status === IdlDeployStatus.SUCCESS || status === IdlDeployStatus.ROLLBACK ? "finish" : (index !== lastSuccessStepIndex + 1 ? "wait" : (record.status === IdlDeployStatus.CANCELED ? "error" : "process")),
      })
    }

    if (lastSuccessStepIndex + 1 === 3 && record.status !== IdlDeployStatus.CANCELED) {
      this.fetchIdlTcePodList()
    }

    this.setState({
      deployRecord: record,
      selectedStepIndex: lastSuccessStepIndex + 1,
      lastSuccessStepIndex,
      excutionSteps
    })
  }

  operatePipline = (type: FlowToType) => () => {
    const { deployRecord } = this.state
    this.setState({
      loading: true,
    });
    rpc('FlowPipeline', { 
      UserName: 'username',
      RecordId: deployRecord.id,
      Type: type
    }).then(resp => {
        if (resp.baseResp.statusCode === 0) {
          this.getApiDeployRecord()
          clearTimeout(this.timeout)
          message.info('已操作')
        }
        this.setState({
          loading: false,
        });
      })
      .catch(err => {
        message.error(err.message);
        this.setState({
          loading: false,
        });
      });
  }

  deployPodList = (pods: TcePodStruct[], isRollback: boolean) => {
    const { deployRecord } = this.state

    rpc('IssueIdlBroadcast', { 
      UserName: 'username',
      RecordId: deployRecord.id,
      PodList: pods.map(pod => pod.podName),
      IsRollback: isRollback
    }).then(resp => {
        if (resp.baseResp.statusCode === 0) {
          this.fetchIdlTcePodList()
          message.info(`开始${isRollback ? '回滚' : '发布'}`);
        }
      })
      .catch(err => {
        message.error(err.message);
      });
  }

  renderExcutionInfo = () => {
    const { deployRecord, loading } = this.state
    const { createBy, updateBy, createTime, updateTime, desc, version, status } = deployRecord || {}
    return deployRecord && (
      <div className={'excutionInfo'}>
        <div className="ExecutionIntroWrap">
          <div className="flowBaseInfo">
            <div className={'flowLine'}>
              <span className={'infoItem'}>
                <span>创建人:</span> 
                <span className={'strong'}>{createBy}</span>
              </span> 
              <Divider type="vertical" />
              <span className={'infoItem'}>
                <span>最后操作人: </span>
                <span className={'strong'}>{updateBy}</span>
              </span> 
              <Divider type="vertical" />
              <span className={'infoItem'}>
                <span>创建时间: </span>
                <span className={'strong'}>{formatDate(Number(createTime))}</span>
              </span>
              <Divider type="vertical" />
              <span className={'infoItem'}>
                <span>更新时间: </span>
                <span className={'strong'}>{formatDate(Number(updateTime))}</span>
              </span>
            </div>
            <div className={'flowLine'}>
              <span className={'infoItem'}>
                <span>工单标题: </span>
                <span className={'strong'}>{desc}</span>
              </span> 
              <Divider type="vertical" />
              <span className={'infoItem'}>
                <span>发布版本: </span>
                <span className={'strong'}>{version}</span>
              </span>
              <Divider type="vertical" />
              <span className={'infoItem'}>
                <span>状态: </span>
                <span className={'strong'}>{StatusText[StatusMap[status]]}</span>
              </span>
            </div>
          </div>
          <div className="btnWrap">
            <Button style={{marginLeft: 10}} loading={loading} disabled={deployRecord.status === IdlDeployStatus.CANCELED || deployRecord.status === IdlDeployStatus.SUCCESS} onClick={this.operatePipline(FlowToType.CANCEL)}>
              取消工单
            </Button>
          </div>
        </div>
        
      </div>
    )
  }

  onSelectStep = index => () => {
    console.log(index)
    this.setState({ selectedStepIndex: index })
    if (index === 3) {
      this.fetchIdlTcePodList()
    } else {
      clearTimeout(this.timeout)
    }
  }

  renderExcutionPipeline = () => {
    const { deployRecord, excutionSteps, selectedStepIndex, lastSuccessStepIndex} = this.state
    console.log("selectedStepIndex:")
    console.log(selectedStepIndex)
    const StepTitle = props => (
      <span 
        className={props.index === selectedStepIndex ? 'stepTitle focused' : 'stepTitle'}
        onClick={props.index <= lastSuccessStepIndex + 1 ? this.onSelectStep(props.index) : () => {}} 
      >
        {props.step.title}
      </span>
    )
    return (
      <div className={'flowDetail'}>
        <div className={'container'}>
          <div className={'slot'}>
            <div className={'confSteps'}>
            <Steps>
              {excutionSteps.map((step, index) =>(
                <Step 
                  key={index} 
                  title={<StepTitle step={step} index={index} />} 
                  status={step.status} 
                  icon={step.isCurrent && <Loading3QuartersOutlined spin />} 
                />
              ))}
            </Steps>
            </div>
          </div>
        </div>
      </div>
    )
  }

  formatData = () => {
    return this.state.tcePodList
  }

  deployIdl = pod => () => {
    this.deployPodList([pod], false)
  }

  deployALLPod = () => {
    const { tcePodList } = this.state
    this.deployPodList(tcePodList, false)
  }

  rollbackIdl = pod => () => {
    this.deployPodList([pod], true)
  }

  rollbackALLPod = () => {
    const { tcePodList } = this.state
    this.deployPodList(tcePodList, true)
  }

  back = () => {
    this.props.history.goBack()
    // location.href = `${window.location.origin}/openapi/idl/deploy`;
  }

  renderIdlDeploy = () => {
    const { isAdmin, deployRecord, loading } = this.state
    return deployRecord.status !== IdlDeployStatus.CANCELED && (
      <div className="idlDeploy">
        {!isAdmin && <div style={{margin: "10px 0"}}>此步骤需要管理员执行，请将此工单链接复制给管理员</div>}
        {isAdmin && (
          <>
            <Table<TcePodStruct>
              loading={loading}
              dataSource={this.formatData()}
              rowKey={"podName"}
              scroll={{x: 'max-content'}}
              pagination={false}
            >
              <Table.Column<TcePodStruct>
                dataIndex={"groupName"}
                title={"GroupName"}
                width={120}
                fixed={"left"}
              />
              <Table.Column<TcePodStruct>
                dataIndex={"podName"}
                title={"PodName"}
                width={120}
                fixed={"left"}
              />
              <Table.Column<TcePodStruct>
                dataIndex={"dc"}
                title={"Dc"}
              />
              <Table.Column<TcePodStruct>
                dataIndex={"nodeIp"}
                title={"NodeIp"}
              />
              <Table.Column<TcePodStruct>
                dataIndex={"podStatus"}
                title={"PodStatus"}
              />
              <Table.Column<TcePodStruct>
                dataIndex={"createTime"}
                title={"CreateTime"}
              />
              <Table.Column<TcePodStruct>
                dataIndex={"ackGray"}
                title={"是否灰度"}
                render={(text, record) => record.ackGray ? "是" : "否"}
              />
              <Table.Column<TcePodStruct>
                dataIndex={"ackRollback"}
                title={"是否回滚"}
                render={(text, record) => record.ackRollback ? "是" : "否"}
              />
              <Table.Column<TcePodStruct>
                title={"操作"}
                render={(text, pod) => {
                  return (
                    <>
                      <Button type="primary" onClick={this.deployIdl(pod)}>发布</Button>
                      <Button onClick={this.rollbackIdl(pod)}>回滚</Button>
                    </>
                  );
                }}
              />
            </Table>
            <Button type="primary" onClick={this.operatePipline(FlowToType.SUCCESS)}>发布全部</Button>
            <Button onClick={this.operatePipline(FlowToType.ROLLBACK)}>回滚全部</Button>
          </>
        )}
      </div>
    )
  }

  renderConfigModule = () => {
    const { selectedStepIndex } = this.state
    return (
      <div className="condfigModule">
        <div className="titleWrap">
          <div className="leftPart">
            <span className="titleIcon"></span>
            <span className="titleContent">{StepTitles[selectedStepIndex]}</span>
          </div>
        </div>
        {selectedStepIndex === 0 && <ScopeConfig recordId={this.state.pid} callback={this.getApiDeployRecord} />}
        {selectedStepIndex === 1 && <RouteConfig record={this.state.deployRecord} callback={this.getApiDeployRecord} />}
        {selectedStepIndex === 2 && <MetaConfig record={this.state.deployRecord} callback={this.getApiDeployRecord} />}
        {selectedStepIndex === 3 && this.renderIdlDeploy()}
      </div>
    )
  }

  render() {
    return (
      <div className={'pipelineWrapper'}>
        <div className="backWrap">
          <LeftOutlined style={{color: "#68d5ce"}} />
          <span style={{fontSize: 14, color: "#68d5ce"}} onClick={this.back}>返回</span>
        </div>
        {this.renderExcutionInfo()}
        {this.renderExcutionPipeline()}
        {this.renderConfigModule()}
      </div>
    )
  }
}