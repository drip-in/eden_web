import * as React from 'react';
import { Table, message } from 'antd';
import { ColumnProps } from "antd/lib/table";
// import { AuthInstanceCN } from '@/common/utils/auth';
import { IdlVersionStruct, StatisticsTabs } from "../../typings/interface"
import rpc from '@/common/utils/op';
import { formatDate } from "@/common/utils/date"
// import cookie from 'js-cookie';
import "./index.scss"


type State = {
  curPage: number;
  loading: boolean;
  apiIdlVersionList: IdlVersionStruct[];
  totalRecords: number;
  columns: ColumnProps<IdlVersionStruct>[];
};

const IdlVersionTabs: StatisticsTabs[] = [
  {id: 0, label: "ID", level: 1, key: "id"},
  {id: 1, label: "版本", level: 1, key: "version"},
  {id: 2, label: "源版本", level: 1, key: "sourceVersion"},
  {id: 3, label: "描述", level: 1, key: "desc"},
  {id: 4, label: "创建时间", level: 1, key: "createTime"},
]

export default class extends React.Component<{}, State> {
  state: State = {
    curPage: 1,
    loading: true,
    apiIdlVersionList: [],
    totalRecords: 0,
    columns: [
      ...IdlVersionTabs.map(tab => ({
        title: tab.label,
        dataIndex: tab.key,
        render: tab.key === "createTime" 
          ? (text: any) => formatDate(Number(text), 'yyyy-MM-dd hh:mm')
          : (text: any) => text
      }))
    ]
  }

  componentDidMount() {
    const { curPage } = this.state;
    // this.getApiVersionList(curPage)
  }

  getApiVersionList = (page: number) => {
    // const username = cookie.get('_ssa_username');
    rpc('ListApiVersion', { UserName: "", Page: page, PageSize: 10, SortDesc: true, SortBy: "create_time" })
      .then(resp => {
        if (resp) {
          const { data } = resp;

          this.setState({
            apiIdlVersionList: data,
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
    return this.state.apiIdlVersionList
  }

  renderIdlVersionList = () => {
    const { loading, totalRecords, curPage } = this.state;
    return (
      <div className={'tableWrapper'}>
        <p>
          详细数据
        </p>
        <Table
          columns={this.state.columns}
          loading={loading}
          dataSource={this.formatData()}
          rowKey={"id"}
          pagination={{
            pageSize: 10,
            showTotal: total => `共计${total}条记录`,
            total: totalRecords,
            current: curPage,
            onChange: (page, pageSize) => {
              this.getApiVersionList(page)
            },
          }}
          scroll={{x: 'max-content'}}
        />
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderIdlVersionList()}
      </div>
    )
  }
}