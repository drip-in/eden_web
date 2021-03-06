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
  setOuterState?: (params) => void;
  callback?: () => void;
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
      // RecordId: this.props.recordId, 
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
    rpc('ManageApiConfig', { 
      UserName: 'username', 
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
          message.info("????????????")
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
                    <span style={{marginLeft: 10}}>{`??????${index+1}`}</span>
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
                        <Input placeholder='?????????scope'/>
                      </Form.Item>
                      <Form.Item 
                        {...field} 
                        name={[field.name, 'needUserAuth']}
                        fieldKey={[field.fieldKey, 'needUserAuth']}
                        label="scope????????????????????????" 
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item 
                        {...field}
                        name={[field.name, 'appId']}
                        fieldKey={[field.fieldKey, 'appId']}
                        label="????????????"
                        rules={[{ required: true, message: 'Missing appId' }]}
                      >
                        <Select
                          placeholder="?????????"
                        >
                          <Option value={1128}>??????</Option>
                          <Option value={32}>??????</Option>
                          <Option value={13}>??????</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'baseQuota']}
                        fieldKey={[field.fieldKey, 'baseQuota']}
                        label="??????Quata" 
                        rules={[{ required: true, message: 'Missing baseQuota' }]}
                      >
                        <Input type="number" placeholder='???????????????Quota' />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'scopeDesc']}
                        fieldKey={[field.fieldKey, 'scopeDesc']}
                        label="scope??????" 
                        rules={[{ required: true, message: 'Missing scopeDesc' }]}
                      >
                        <Input placeholder='?????????scope??????' />
                      </Form.Item>
                    </div>
                </Space>
                </div>
              ))}
              <Form.Item>
                <Button style={{width: 500}} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  ????????????
                </Button>
              </Form.Item>
            </>
          )}
          </Form.List>
          <Form.Item>
            <Button type="primary" loading={loading} onClick={this.submit}>
              ??????
            </Button>
            {/* <Button style={{marginLeft: 10}} loading={loading} onClick={this.ignore}>
              ??????
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

export default ScopeConfig;