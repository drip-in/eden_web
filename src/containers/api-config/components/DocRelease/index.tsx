import * as React from 'react';
import {
  Form,
  Input,
  Button,
  Space,
  message,
} from 'antd';
import rpc from '@/common/utils/op';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { DocParam } from "@/typings/interface"
import { FormInstance } from 'antd/lib/form';


const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

interface Props {
  setOuterState?: (params) => void;
  callback?: () => void;
}

interface State {
  loading: boolean;
  docConfig: DocParam[];
}

class DocConfig extends React.Component<Props, State> {
  formRef = React.createRef<FormInstance>();

  state: State = {
    loading: false,
    docConfig: null,
  }
  componentDidMount() {
    this.formRef.current.setFields([
      {name: ["MetaConfig", 0], value: {
        apiUri: "",
        idlPath: "",
        apiTitle: ""
      }}
    ])
    this.forceUpdate()
  }

  submit = () => {
    this.setState({
      loading: true,
    });

    const values = this.formRef.current.getFieldsValue()
    console.log('Received allFields of form:', values);

    const { DocConfig: docConfig } = values;
    rpc('SaveJanusApiDoc', { 
      ApiDocList: docConfig.map(config => (
        {
          ApiUri: config.apiUri,
          IdlPath: config.idlPath,
          ApiTitle: config.apiTitle
        }
      ))
    }).then(resp => {
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

  renderDocConfig = () => {
    const { loading } = this.state;
    return (
      <div>
        <Form {...layout} ref={this.formRef} name="dynamic_form_nest_item" autoComplete="off">
          <Form.List name="DocConfig">
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
                        name={[field.name, 'apiUri']}
                        fieldKey={[field.fieldKey, 'apiUri']}
                        label="apiUri" 
                        rules={[{ required: true, message: 'Missing apiUri' }]}
                      >
                        <Input placeholder='请输入apiUri'/>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'idlPath']}
                        fieldKey={[field.fieldKey, 'idlPath']}
                        label="idlPath" 
                        rules={[{ required: true, message: 'Missing idlPath' }]}
                      >
                        <Input placeholder='请输入idlPath' />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'apiTitle']}
                        fieldKey={[field.fieldKey, 'apiTitle']}
                        label="文档标题" 
                      >
                        <Input placeholder='请输入文档标题' />
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
        {this.renderDocConfig()}
      </div>
    )
  }
}

export default DocConfig;
