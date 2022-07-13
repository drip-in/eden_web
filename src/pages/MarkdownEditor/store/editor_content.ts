import { observable, action, makeObservable, runInAction } from "mobx";
import {THEME_LIST, CONTENT, STYLE, MARKDOWN_THEME_ID, BASIC_THEME_ID, CODE_THEME_ID, STYLE_LABELS, CODE_OPTIONS} from "../common/constant";
import {replaceStyle, addStyleLabel} from "../common/helper";
import TEMPLATE from "../template";

import { ArticleType } from "@/apis/article"

interface EditorTheme {
  themeId: string,
  name: string,
  css: string,
}

interface ReleaseConfig {
  coverUri: string,
  articleType: ArticleType,
  columnId: string,
}

class EditorContent {
  title: string = ''
  tags: number[] = []
  content: string = ''
  releaseConfig: ReleaseConfig = {
    coverUri: 'qwer',
    articleType: ArticleType.Original,
    columnId: '1234',
  }
  style: string = ''
  themeList: EditorTheme[] = []
  markdownEditor: CodeMirror.Editor = null

  constructor() {
    makeObservable(this, {
      title: observable,
      tags: observable,
      content: observable,
      releaseConfig: observable,
      style: observable,
      themeList: observable,
      markdownEditor: observable,
      setTitle: action,
      setTags: action,
      setContent: action,
      setReleaseConfig: action,
      setStyle: action,
      setThemeList: action,
      setMarkdownEditor: action,
    });
  }
  setTitle = (title: string) => {
    this.title = title;
    console.log(this.title)
  }

  setTags = (tags: number[]) => {
    this.tags = tags;
  }

  setContent = (content: string) => {
    this.content = content;
    window.localStorage.setItem(CONTENT, content);
  };

  setReleaseConfig = (releaseConfig: ReleaseConfig) => {
    console.log(releaseConfig)
    this.releaseConfig = releaseConfig;
  }

  setStyle = (style: string) => {
    this.style = style;
    replaceStyle(MARKDOWN_THEME_ID, style);
  };

  setThemeList = (themeList: EditorTheme[]) => {
    this.themeList = themeList;
    window.localStorage.setItem(THEME_LIST, JSON.stringify(themeList));
  };

  setMarkdownEditor = (markdownEditor: CodeMirror.Editor) => {
    this.markdownEditor = markdownEditor;
  };
  // 自定义样式
  // setCustomStyle = (style = "") => {
  //   // 如果传入则更新
  //   if (style) {
  //     window.localStorage.setItem(STYLE, style);
  //   }
  //   this.style = window.localStorage.getItem(STYLE);
  //   replaceStyle(MARKDOWN_THEME_ID, this.style);
  // };
}

const editorContentStore = new EditorContent();

// 如果为空先把数据放进去
if (window.localStorage.getItem(CONTENT) === null) {
  window.localStorage.setItem(CONTENT, TEMPLATE.content);
}
if (!window.localStorage.getItem(STYLE)) {
  window.localStorage.setItem(STYLE, TEMPLATE.custom);
}
if (!window.localStorage.getItem(THEME_LIST)) {
  window.localStorage.setItem(
    THEME_LIST,
    JSON.stringify([
      {themeId: "normal", name: "默认主题", css: TEMPLATE.normal},
      {themeId: "custom", name: "自定义", css: TEMPLATE.custom},
    ]),
  );
}

editorContentStore.themeList = JSON.parse(window.localStorage.getItem(THEME_LIST));

// 在head中添加style标签
addStyleLabel(STYLE_LABELS);

// 初始化整体主题
replaceStyle(BASIC_THEME_ID, TEMPLATE.basic);
// 初始化code主题，默认为atom-one-dark
replaceStyle(CODE_THEME_ID, TEMPLATE.code[CODE_OPTIONS[0].macId]);

editorContentStore.content = window.localStorage.getItem(CONTENT);

export {editorContentStore};
