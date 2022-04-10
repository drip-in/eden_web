import * as React from 'react';
import {
  Form,
  Input,
  Button,
  Switch,
  Select,
  Space,
  message
} from 'antd';
import rpc from '@/common/utils/op';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PIPELINE_STAGE, ScopeParam } from "@/typings/interface"
import { FormInstance } from 'antd/lib/form';

// import cookie from 'js-cookie';

const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface Props {
  data?: ScopeParam[];
  recordId: number;
  setOuterState?: (params) => void;
  callback: () => void;
}

interface State {
  loading: boolean;
  scopeConfig: ScopeParam[];
}

const initialValues = {
  "ScopeConfig": [
    {"scope": "im", "needUserAuth": true, "appId": 1128, "scopeDesc": "asdf"}
  ]
}

class ScopeConfig extends React.Component<Props, State> {
  formRef = React.createRef<FormInstance>();

  state: State = {
    loading: false,
    scopeConfig: null,
  }
  componentDidMount() {
    this.setState({ scopeConfig: this.props.data })
  }

  ignore = () => {
    this.setState({
      loading: true,
    });
    // const username = cookie.get('_ssa_username');
    rpc('ExecuteApiIdlStage', { 
      UserName: 'username', 
      RecordId: this.props.recordId, 
      Stage: PIPELINE_STAGE.SCOPE_CONFIG, 
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
    // this.formRef.current.validateFields
    const values = this.formRef.current.getFieldsValue()
    console.log('Received allFields of form:', values);

    this.setState({
      loading: true,
    });
    const { ScopeConfig: scopeConfig } = values;
    // const username = cookie.get('_ssa_username');
    rpc('ExecuteApiIdlStage', { 
      UserName: 'username', 
      RecordId: this.props.recordId, 
      Stage: PIPELINE_STAGE.SCOPE_CONFIG, 
      Params: scopeConfig.map(config => ({ 
        ScopeParam: {
          AppId: config.appId,
          BaseQuota: Number(config.baseQuota),
          NeedUserAuth: !!config.needUserAuth,
          Scope: config.scope,
          ScopeDesc: config.scopeDesc
        },
        Uri: ''
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

  renderScopeConfig = () => {
    const { loading } = this.state;
    return (
      <div>
        <Form {...layout} ref={this.formRef} name="dynamic_form_nest_item" autoComplete="off">
          <Form.List name="ScopeConfig">
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
                        name={[field.name, 'scope']}
                        fieldKey={[field.fieldKey, 'scope']}
                        label="scope" 
                        rules={[{ required: true, message: 'Missing scope' }]}
                      >
                        <Input placeholder='请输入scope'/>
                      </Form.Item>
                      <Form.Item 
                        {...field} 
                        name={[field.name, 'needUserAuth']}
                        fieldKey={[field.fieldKey, 'needUserAuth']}
                        label="scope是否需要用户授权" 
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item 
                        {...field}
                        name={[field.name, 'appId']}
                        fieldKey={[field.fieldKey, 'appId']}
                        label="授权应用"
                        rules={[{ required: true, message: 'Missing appId' }]}
                      >
                        <Select
                          placeholder="请选择"
                        >
                          <Option value={1128}>抖音</Option>
                          <Option value={32}>西瓜</Option>
                          <Option value={13}>头条</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'baseQuota']}
                        fieldKey={[field.fieldKey, 'baseQuota']}
                        label="基础Quata" 
                        rules={[{ required: true, message: 'Missing baseQuota' }]}
                      >
                        <Input type="number" placeholder='请输入基础Quota' />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'scopeDesc']}
                        fieldKey={[field.fieldKey, 'scopeDesc']}
                        label="scope描述" 
                        rules={[{ required: true, message: 'Missing scopeDesc' }]}
                      >
                        <Input placeholder='请输入scope描述' />
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

export default ScopeConfig;