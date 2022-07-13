import * as React from "react";
import { useState } from 'react';
import { Select, Tag } from 'antd';
import MarkdownEditor from './editor';
import { useEditorStores } from './store';
import styles from './index.module.scss';

import DocumentStr from './README.md';
const DocumentStrSource = DocumentStr.replace(/([\s\S]*)<!--dividing-->/, '').replace(/^\n*/g, '');

const { Option } = Select;
export default function EditorBody() {
  const { editorContentStore } = useEditorStores();
  const { title, setTitle, tags, setTags } = editorContentStore;

  const [mdstr, setMdstr] = useState<string>(DocumentStrSource);
  const [articleTitle, setArticleTitle] = useState<string>(title);
  const [articleTags, setArticleTags] = useState<number[]>(tags);

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticleTitle(e.target.value)
    setTitle(e.target.value);
  }

  const onTagsChange = (v: number[]) => {
    console.log(v)
    setArticleTags(v)
    setTags(v);
  }

  return (
    <div className={styles.editorBody}>
      <div className={styles.titleWrapper}>
        <input 
          placeholder="请输入标题"
          maxLength={80}
          className={styles.title}
          value={articleTitle}
          onChange={onTitleChange}
        />
        <div className={styles.tags}>
          <Select
            placeholder="请选择话题标签"
            mode="multiple"
            showArrow
            style={{ width: 200 }}
            value={articleTags}
            onChange={onTagsChange}
          >
            <Option value={1}>后端</Option>
            <Option value={2}>前端</Option>
          </Select>
        </div>
      </div>
      <div className={styles.editorWrapper}>
        <MarkdownEditor
          options={{
            autofocus: true,
            showCursorWhenSelecting: true,
            theme: "md-mirror",
            mode: "markdown",
            lineWrapping: true,
            lineNumbers: false,
          }}
          value={mdstr}
        />
      </div>
    </div>
  );
}

const tagRender = (props) => {
  const { tag } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={"blue"}
      onMouseDown={onPreventMouseDown}
      closable={true}
      style={{ marginRight: 3 }}
    >
      {tag}
    </Tag>
  );
};