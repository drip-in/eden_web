import * as React from 'react';
import {
  Form,
  Input,
  Button,
  Switch,
  Select,
  Space,
  message,
  Radio
} from 'antd';
import rpc from '@/common/utils/op';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { IdlDeployRecordStruct, PIPELINE_STAGE, RouteParam } from "@/typings/interface"
import { FormInstance } from 'antd/lib/form';

// import cookie from 'js-cookie';

const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface Props {
  data?: RouteParam[];
  record: IdlDeployRecordStruct;
  setOuterState?: (params) => void;
  callback: () => void;
}

interface State {
  loading: boolean;
  routeConfig: RouteParam[];
}

const initialValues = {
  "MetaConfig": [
    {"httpMethod":"GET","name":"/enterprise/im/card/list/","desc":"","needUserAuth":true,"scope":"enterprise.im","apiType":"data"}
  ]
}

class RouteConfig extends React.Component<Props, State> {
  formRef = React.createRef<FormInstance>();

  state: State = {
    loading: false,
    routeConfig: null,
  }
  componentDidMount() {
    this.setState({ 
      routeConfig: this.props.data,
    })
  }

  ignore = () => {
    this.setState({
      loading: true,
    });
    // const username = cookie.get('_ssa_username');
    rpc('ExecuteApiIdlStage', { 
      UserName: 'username', 
      RecordId: this.props.record.id, 
      Stage: PIPELINE_STAGE.ROUTE_CONFIG, 
    })
      .then(resp => {
        if (resp.baseResp.statusCode === 0) {
          this.props.callback()
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

  submit = () => {
    const values = this.formRef.current.getFieldsValue()
    console.log('Received allFields of form:', values);

    const { RouteConfig: routeConfig } = values;
    // const username = cookie.get('_ssa_username');
    rpc('ExecuteApiIdlStage', { 
      UserName: 'username', 
      RecordId: this.props.record.id, 
      Stage: PIPELINE_STAGE.ROUTE_CONFIG, 
      Params: routeConfig.map(config => ({ 
        RouteParam: {
          Psm: config.psm,
          PsmMethod: config.psmMethod,
        },
        Uri: config.uri
      }))
    })
      .then(resp => {
        if (resp.baseResp.statusCode === 0) {
          this.props.callback()
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

  onUriChange = index => uri => {
    // const username = cookie.get('_ssa_username');

    rpc('FetchCurrentApiInfo', { 
      UserName: 'username', 
      Stage: PIPELINE_STAGE.ROUTE_CONFIG,
      UriList: [uri]
    })
      .then(resp => {
        if (resp.baseResp.statusCode === 0) {
          
          if (resp.infoMap) {
            console.log(resp.infoMap[uri])
            if (resp.infoMap[uri]) {
              this.formRef.current.setFields([
                {name: ["RouteConfig", index], value: {...resp.infoMap[uri].routeParam, uri}}
              ])
            } else {
              this.formRef.current.setFields([
                {name: ["RouteConfig", index], value: {uri}}
              ])
            }
            this.forceUpdate()
          }
        }
      })
      .catch(err => {
        message.error(err.message);
      });
  }

  renderScopeConfig = () => {
    const { loading } = this.state;
    const { data, record } = this.props;
    const values = { "RouteConfig": data }
    return (
      <div>
        <Form {...layout} ref={this.formRef} name="dynamic_form_nest_item" autoComplete="off">
          <Form.List name="RouteConfig">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div>
                  <div>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                    <span style={{marginLeft: 10}}>{`配置${index+1}`}</span>
                  </div>
                  <Space key={field.key} direction="vertical" align="start">
                    <div style={{ width: 500 }}>
                      <Form.Item 
                        {...field}
                        name={[field.name, 'uri']}
                        fieldKey={[field.fieldKey, 'uri']}
                        label="Uri"
                        rules={[{ required: true, message: 'Missing Uri' }]}
                      >
                        <Select
                          placeholder="请选择"
                          onChange={this.onUriChange(index)}
                        >
                          {record && record.deployConfig && record.deployConfig.apiList.map(api => (
                            <Option key={api} value={api}>{api}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...field} 
                        name={[field.name, 'psm']}
                        fieldKey={[field.fieldKey, 'psm']}
                        label="psm" 
                        rules={[{ required: true, message: 'Missing psm' }]}
                      >
                        <Input placeholder='请输入psm'/>
                      </Form.Item>
                      <Form.Item
                        {...field} 
                        name={[field.name, 'psmMethod']}
                        fieldKey={[field.fieldKey, 'psmMethod']}
                        label="method" 
                        rules={[{ required: true, message: 'Missing psmMethod' }]}
                      >
                        <Input placeholder='请输入method'/>
                      </Form.Item>
                    </div>
                </Space>
                </div>
              ))}
              <Form.Item>
                <Button style={{width: 500}} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  增加配置
                </Button>
              </Form.Item>
            </>
          )}
          </Form.List>
          <Form.Item>
            <Button type="primary" loading={loading} onClick={this.submit}>
              提交
            </Button>
            <Button style={{marginLeft: 10}} loading={loading} onClick={this.ignore}>
              跳过
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderScopeConfig()}
      </div>
    )
  }
}

export default RouteConfig;