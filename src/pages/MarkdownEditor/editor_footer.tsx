// //@ts-nocheck
import * as React from "react";
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import {
  Button,
} from 'antd';

import { Form, Select, Dropdown } from '@douyinfe/semi-ui';
import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface';
import UploadCover from "./components/UploadCover";
import { useEditorStores } from './store';
import styles from './index.module.scss';

interface FooterProps {
  onReleaseArticle?: () => void;
}

export default observer(Footer);
function Footer(props: FooterProps) {
  const { editorContentStore } = useEditorStores();
  const { content, releaseConfig, setReleaseConfig } = editorContentStore;

  const [formApi, setFormApi] = useState<BaseFormApi>();
  const [coverUri, setCoverUri] = useState<string>('');
  useEffect(() => {
    console.log(formApi)
    console.log(releaseConfig)
    if (formApi && releaseConfig) {
      setCoverUri(releaseConfig.coverUri);
      formApi.setValues({
        'article_type': releaseConfig.articleType,
        'column_id': releaseConfig.columnId,
      });
    }
  }, [formApi])

  const onCoverUriChange = (uri: string) => {
    setCoverUri(uri);
  }

  const onSave = () => {}
  const onRelease = () => {
    formApi.validate()
    .then(values=>{
      setReleaseConfig({
        articleType: values['article_type'],
        columnId: values['column_id'],
        coverUri: coverUri,
      });

      props.onReleaseArticle && props.onReleaseArticle()
    })
    .catch(errors=>{})
  }
  const getFormApi = (formApi: BaseFormApi<any>) => {
    console.log('getFormApi:')
    console.log(formApi)
    setFormApi(formApi);
  }
  const renderReleaseConfig = () => {
    return (
      <div className={styles.releaseMenu}>
        <div className={styles.releaseMenuHeader}>
          <p>发布文章</p>
        </div>
        <Form 
          getFormApi={getFormApi}
          wrapperCol={{ span: 15 }}
          labelCol={{ span: 5 }}
          labelPosition='left'
          labelAlign='right'
          // onSubmit={values => handleSubmit(values)} 
          style={{width: 400}}
        >
            {({formState, values, formApi}) => (
              <>
                <Form.Slot label="设置封面">
                  <UploadCover value={coverUri} onChange={onCoverUriChange} />
                </Form.Slot>
                <Form.RadioGroup 
                  className={styles.radio} 
                  field='article_type' 
                  label="文章类型"
                  rules={[
                    { required: true }
                  ]}
                >
                  <Form.Radio value={1}>原创</Form.Radio>
                  <Form.Radio value={2}>转载</Form.Radio>
                  <Form.Radio value={3}>翻译</Form.Radio>
                </Form.RadioGroup>
                <Form.Select
                  className={styles.select}
                  style={{width: 250}}
                  field="column_id"
                  label="发布到"
                  rules={[
                    { required: true }
                  ]}
                >
                  <Form.Select.Option value={"1"}>比特瓦尔登</Form.Select.Option>
                  <Form.Select.Option value={"2"}>后端伊甸园</Form.Select.Option>
                </Form.Select>
              </>
            )}
        </Form>
        <div className={styles.releaseMenuFooter}>
          <Button className={styles.confirmBtn} type={"primary"}  onClick={onRelease}>
            确认发布
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.footer}>
      <div className={styles.footerWarpper}>
        <div className={styles.leftBox}>
          <span>字数：{content.length}</span>
        </div>
        <div className={styles.rightBox}>
          <Button className={styles.saveBtn} onClick={onSave} type="primary" ghost >
            保存草稿
          </Button>
          <Dropdown
            zIndex={100}
            position={'bottomRight'}
            trigger={'click'}
            render={renderReleaseConfig()}
          >
            <Button className={styles.releaseBtn} type={"primary"}>
              发布
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
