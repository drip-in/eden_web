import * as React from 'react';
import { Table, Button, message, Modal, Input } from 'antd';
import { IdlDeployRecordStruct, IdlDeployStatus, FlowToType } from "../../typings/interface"
import rpc from '@/common/utils/op';
import { formatDate } from "@/common/utils/date"
import StatusButton, {StatusType} from "@/components/StatusButton";
import { RouteComponentProps } from "react-router-dom";

// import cookie from 'js-cookie';
import "./index.scss"


type State = {
  curPage: number;
  loading: boolean;
  apiIdlDeployList: IdlDeployRecordStruct[];
  totalRecords: number;
  showCreateExcutionModal: boolean;
  curRecord: IdlDeployRecordStruct;
  excutionTitle: string;
};


export default class extends React.Component<RouteComponentProps, State> {
  state: State = {
    curPage: 1,
    loading: true,
    apiIdlDeployList: [],
    totalRecords: 0,
    showCreateExcutionModal: false,
    curRecord: undefined,
    excutionTitle: ""
  }

  componentDidMount() {
    const { curPage } = this.state;
    this.getApiDeployList(curPage)
  }

  getApiDeployList = (page: number) => {
    // const username = cookie.get('_ssa_username');
    rpc('ListApiDeployRecord', { UserName: 'username', Page: page, PageSize: 10, SortDesc: true, SortBy: "create_time" })
      .then(resp => {
        if (resp) {
          const { data } = resp;

          this.setState({
            apiIdlDeployList: data,
            totalRecords: (resp as any).basePage.totalRecords,
            curPage: page,
          });
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

  formatData = () => {
    return this.state.apiIdlDeployList
  }

  toExcutionPage = record => {
    this.props.history.push(`/openapi/idl/excution/${record.id}`)
  }

  renderIdlVersionList = () => {
    const { loading, totalRecords, curPage } = this.state;
    return (
      <div className={'tableWrapper'}>
        <p>
          ????????????
        </p>
        <Table<IdlDeployRecordStruct>
          loading={loading}
          dataSource={this.formatData()}
          rowKey={"id"}
          pagination={{
            pageSize: 10,
            showTotal: total => `??????${total}?????????`,
            total: totalRecords,
            current: curPage,
            onChange: (page, pageSize) => {
              this.getApiDeployList(page)
            },
          }}
          scroll={{x: 'max-content'}}
        >
          <Table.Column<IdlDeployRecordStruct>
            dataIndex={"id"}
            title={"ID"}
            width={120}
            fixed={"left"}
          />
          <Table.Column<IdlDeployRecordStruct>
            dataIndex={"preVersion"}
            title={"???????????????"}
          />
          <Table.Column<IdlDeployRecordStruct>
            dataIndex={"version"}
            title={"????????????"}
          />
          <Table.Column<IdlDeployRecordStruct>
            dataIndex={"status"}
            title={"??????"}
            render={text => {
              switch (text) {
                case IdlDeployStatus.INIT: {
                  return <StatusButton type={StatusType.INIT} text={'?????????'} />
                }
                case IdlDeployStatus.DEPLOYING: {
                  return <StatusButton type={StatusType.DEPLOYING} text={'?????????'} />
                }
                case IdlDeployStatus.IDL_GRAYING: {
                  return <StatusButton type={StatusType.IDL_GRAYING} text={'?????????'} />
                }
                case IdlDeployStatus.SUCCESS: {
                  return <StatusButton type={StatusType.SUCCESS} text={'??????'} />
                }
                case IdlDeployStatus.CANCELED: {
                  return <StatusButton type={StatusType.CANCELED} text={'?????????'} />
                }
                case IdlDeployStatus.ROLLBACK: {
                  return <StatusButton type={StatusType.ROLLBACK} text={'?????????'} />
                }
                default: {
                  return <div>??????</div>;
                }
              }
            }}
          />
          <Table.Column<IdlDeployRecordStruct>
            dataIndex={"desc"}
            title={"??????"}
          />
          <Table.Column<IdlDeployRecordStruct>
            dataIndex={"createTime"}
            title={"????????????"}
            render={text => formatDate(Number(text), 'yyyy-MM-dd hh:mm')}
          />
          <Table.Column<IdlDeployRecordStruct>
            title={"????????????"}
            render={(text, record) => {
              return (
                <>
                  {record.status === IdlDeployStatus.INIT && <Button type="primary" onClick={() => {this.setState({showCreateExcutionModal: true, curRecord: record})}}>????????????</Button>}
                  {record.status !== IdlDeployStatus.INIT && <Button onClick={() => {this.toExcutionPage(record)}}>????????????</Button>}
                </>
              );
            }}
          />
          <Table.Column<IdlDeployRecordStruct>
            title={"????????????"}
            render={(text, record) => {
              return (
                <>
                  <Button type="primary" disabled={record.status === IdlDeployStatus.CANCELED || record.status === IdlDeployStatus.SUCCESS} onClick={this.cancelPipline(record)}>??????</Button>
                  <Button disabled={record.status === IdlDeployStatus.CANCELED || record.status === IdlDeployStatus.SUCCESS} onClick={this.completePipline(record)} >??????</Button>
                </>
              );
            }}
          />
        </Table>
      </div>
    )
  }


  createExcution = () => {
    this.setState({
      loading: true,
    });

    const { curRecord, excutionTitle } = this.state
    // const username = cookie.get('_ssa_username');
    rpc('SubmitApiIdlPipeline', { 
      UserName: 'username', 
      RecordId: curRecord.id, 
      Desc: excutionTitle || curRecord.desc, 
      NeedIssueIdl: true,
      StageList: [1,2,3,4],
      ApiList: curRecord.deployConfig.apiList,
    }).then(resp => {
      console.log(resp)
        if (resp.baseResp.statusCode === 0) {
          this.setState({
            showCreateExcutionModal: false,
            excutionTitle: ""
          })
        }

        this.setState({
          loading: false,
        });

        this.toExcutionPage(curRecord)
        // location.href = `${window.location.origin}/openapi/idl/excution/${curRecord.id}`;
      })
      .catch(err => {
        message.error(err.message);
        this.setState({
          loading: false,
        });
      });
  }

  cancelPipline = record => () => {
    const { curPage } = this.state
    this.setState({
      loading: true,
    });

    // const username = cookie.get('_ssa_username');
    rpc('FlowPipeline', { 
      UserName: 'username',
      RecordId: record.id,
      Type: FlowToType.CANCEL
    }).then(resp => {
        if (resp.baseResp.statusCode === 0) {
          this.getApiDeployList(curPage)
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

  completePipline = record => () => {
    const { curPage } = this.state
    this.setState({
      loading: true,
    });

    // const username = cookie.get('_ssa_username');
    rpc('FlowPipeline', { 
      UserName: 'username',
      RecordId: record.id,
      Type: FlowToType.SUCCESS
    }).then(resp => {
        if (resp.baseResp.statusCode === 0) {
          this.getApiDeployList(curPage)
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

  renderCreateExcutionModal = () => {
    const { showCreateExcutionModal, loading, curRecord } = this.state
    console.log(curRecord)
    return curRecord && (
      <Modal
        className={"repealAuthorityModalWidth"}
        visible={showCreateExcutionModal}
        title={"????????????"}
        closable={true}
        maskClosable={false}
        onCancel={() => {
          this.setState({showCreateExcutionModal: false });
        }}
        onOk={this.createExcution}
        footer={[
          <Button key="??????" onClick={() => {
            this.setState({showCreateExcutionModal: false});
          }}>
            ??????
          </Button>,
          <Button key="????????????" type="primary" loading={loading} onClick={this.createExcution}>
            ????????????
          </Button>,
        ]}
      >
        <div style={{
          fontSize: 12,
          lineHeight: '20px',
        }}>
          <p>??????????????????</p>
          <Input placeholder="?????????????????????" value={curRecord.desc} onChange={e => {this.setState({excutionTitle: e.target.value})} } />
        </div>
      </Modal>
    )
  }

  render() {
    return (
      <div>
        {this.renderIdlVersionList()}
        {this.renderCreateExcutionModal()}
      </div>
    )
  }
}