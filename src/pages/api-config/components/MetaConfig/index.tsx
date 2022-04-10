import * as React from 'react';
import {
  Form,
  Input,
  Button,
  Switch,
  Select,
  Space,
  message,
  Radio,
} from 'antd';
import rpc from '@/common/utils/op';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { IdlDeployRecordStruct, PIPELINE_STAGE, MetaParam } from "@/typings/interface"
import { FormInstance } from 'antd/lib/form';

// import cookie from 'js-cookie';

const { Option } = Select;
const { Search } = Input;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface Props {
  data?: MetaParam[];
  record?: IdlDeployRecordStruct;
  setOuterState?: (params) => void;
  callback?: () => void;
}

interface State {
  loading: boolean;
  metaConfig: MetaParam[];
}

class MetaConfig extends React.Component<Props, State> {
  formRef = React.createRef<FormInstance>();

  state: State = {
    loading: false,
    metaConfig: null,
  }
  componentDidMount() {
    this.setState({
      metaConfig: this.props.data,
    })
  }

  ignore = () => {
    this.setState({
      loading: true,
    });
    // const username = cookie.get('_ssa_username');
    rpc('ExecuteApiIdlStage', {
      UserName: "username",
      RecordId: this.props.record.id,
      Stage: PIPELINE_STAGE.META_CONFIG,
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
    this.setState({
      loading: true,
    });

    const values = this.formRef.current.getFieldsValue()
    console.log('Received allFields of form:', values);

    const { MetaConfig: metaConfig } = values;
    // const username = cookie.get('_ssa_username');
    rpc('ManageApiConfig', {
      UserName: "username",
      Stage: PIPELINE_STAGE.META_CONFIG,
      Params: metaConfig.map(config => ({
        MetaParam: {
          HttpMethod: config.httpMethod,
          Name: config.name,
          Desc: config.name,
          NeedUserAuth: !!config.needUserAuth,  // needUserAuth可能为undefined
          Scope: config.scope,
          ApiType: config.apiType
        },
        Uri: config.uri
      }))
    })
      .then(resp => {
        if (resp.baseResp.statusCode === 0) {
          message.info("保存成功")
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
      UserName: "username",
      Stage: PIPELINE_STAGE.META_CONFIG,
      UriList: [uri]
    })
      .then(resp => {
        if (resp.baseResp.statusCode === 0) {

          if (resp.infoMap) {
            console.log(resp.infoMap[uri])
            if (resp.infoMap[uri]) {
              this.formRef.current.setFields([
                {name: ["MetaConfig", index], value: {...resp.infoMap[uri].metaParam, uri}}
              ])
            } else {
              this.formRef.current.setFields([
                {name: ["MetaConfig", index], value: {uri}}
              ])
            }
            this.forceUpdate()
          } else {
            message.info("无此uri")
          }
        }
      })
      .catch(err => {
        message.error(err.message);
      });
  }

  renderScopeConfig = () => {
    const { loading } = this.state;
    // const { data, record } = this.props;
    return (
      <div>
        <Form {...layout} ref={this.formRef} name="dynamic_form_nest_item" autoComplete="off">
          <Form.List name="MetaConfig">
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
                        <Search placeholder="请输入uri" loading={loading} onSearch={this.onUriChange(index)} />
                        {/* <Select
                          placeholder="请选择"
                          onChange={this.onUriChange(index)}
                        >
                          {record && record.deployConfig && record.deployConfig.apiList.map(api => (
                            <Option key={api} value={api}>{api}</Option>
                          ))}
                        </Select> */}
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'httpMethod']}
                        fieldKey={[field.fieldKey, 'httpMethod']}
                        label="Method"
                        rules={[{ required: true, message: 'Missing httpMethod' }]}
                      >
                        <Select
                          placeholder="请选择"
                        >
                          <Option value="GET">GET</Option>
                          <Option value="POST">POST</Option>
                          <Option value="JSB">JSB</Option>
                          <Option value="Native">Native</Option>
                          <Option value="OpenRpc">OpenRpc</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        fieldKey={[field.fieldKey, 'name']}
                        label="name"
                        rules={[{ required: true, message: 'Missing name' }]}
                      >
                        <Input placeholder='请输入名称'/>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'needUserAuth']}
                        fieldKey={[field.fieldKey, 'needUserAuth']}
                        label="是否需要用户授权"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'scope']}
                        fieldKey={[field.fieldKey, 'scope']}
                        label="关联scope"
                        rules={[{ required: true, message: 'Missing scope' }]}
                      >
                        <Input placeholder='请输入关联scope' />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'apiType']}
                        fieldKey={[field.fieldKey, 'apiType']}
                        label="接口类型"
                        rules={[{ required: true, message: 'Missing apiType' }]}
                      >
                        <Radio.Group>
                          <Radio value="data">data</Radio>
                          <Radio value="functional">functional</Radio>
                        </Radio.Group>
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
            {/* <Button style={{marginLeft: 10}} loading={loading} onClick={this.ignore}>
              跳过
            </Button> */}
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

export default MetaConfig;
