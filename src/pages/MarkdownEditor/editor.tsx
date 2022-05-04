import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { observer } from 'mobx-react';
import MarkdownPreview, { MarkdownPreviewProps } from '@uiw/react-markdown-preview';
import throttle from "lodash.throttle";
import { MathDocument } from 'mathjax-full/ts/core/MathDocument'; 
import { MathItem } from 'mathjax-full/ts/core/MathItem'; 

import CodeMirror, { ICodeMirror } from './components/CodeMirror';
import ToolBar, { IToolBarProps } from './components/ToolBar';
import { getCommands, getModeCommands } from './commands';
import { updateMathjax, markdownParser } from './common/helper';
import { useEditorStores } from './store';
import './index.scss';

import {
  PREVIEW_ID,
  MAX_MD_NUMBER,
  THROTTLE_MATHJAX_TIME,
  THROTTLE_MD_RENDER_TIME,
  MJX_DATA_FORMULA,
  MJX_DATA_FORMULA_TYPE,
} from "./common/constant";

export * from './commands';

export interface IMarkdownEditor extends ICodeMirror {
  className?: string;
  prefixCls?: string;
  value?: string;
  height?: number;
  visible?: boolean;
  visibleEditor?: boolean;
  toolbars?: IToolBarProps['toolbars'];
  toolbarsMode?: IToolBarProps['toolbars'];
  previewProps?: MarkdownPreviewProps;
  options?: CodeMirror.EditorConfiguration;
}

export interface MarkdownEditorRef {
  editor?: CodeMirror.Editor;
  preview?: HTMLDivElement | null;
}

export default observer(React.forwardRef<MarkdownEditorRef, IMarkdownEditor>(MarkdownEditor));

function MarkdownEditor(
  props: IMarkdownEditor,
  ref?: ((instance: MarkdownEditorRef) => void) | React.RefObject<MarkdownEditorRef> | null,
) {
  const {
    prefixCls = 'md-editor',
    className,
    onChange,
    toolbars = getCommands(),
    toolbarsMode = getModeCommands(),
    visible = true,
    visibleEditor = true,
    previewProps = {},
    ...codemirrorProps
  } = props;

  const { editorContentStore } = useEditorStores();
  const { markdownEditor, setMarkdownEditor, setContent } = editorContentStore;

  const [value, setValue] = useState(props.value || '');
  const [mathjaxEnable, setMathjaxEnable] = useState(false);

  const codeMirror = useRef<CodeMirror>();
  const container = useRef<HTMLDivElement>(null);
  const previewContainer = useRef<HTMLDivElement | null>();
  const editorContainer = useRef<HTMLDivElement>(null);
  const active = useRef<'text' | 'preview'>('preview');

  useImperativeHandle(ref, () => ({
    editor: markdownEditor,
    preview: previewContainer.current,
  }));

  useEffect(() => {
    if (!mathjaxEnable) {
      try {
        window.MathJax = {
          tex: {
            inlineMath: [["$", "$"]],
            displayMath: [["$$", "$$"]],
            tags: "ams",
          },
          svg: {
            fontCache: "none",
          },
          options: {
            renderActions: {
              addMenu: [0, "", ""],
              addContainer: [
                190,
                (doc) => {
                  for (const math of doc.math) {
                    addContainer(math, doc);
                  }
                },
                addContainer,
              ],
            },
          },
        };
        // eslint-disable-next-line
        require("mathjax/es5/tex-svg-full");
        setMathjaxEnable(true);
      } catch (e) {
        console.log(e);
      }
    }

    if (mathjaxEnable) {
      handleUpdateMathjax();
    }
  }, [])

  useEffect(() => {
    if (codeMirror.current) {
      setMarkdownEditor(codeMirror.current.editor);
    }
  }, [codeMirror]);

  const addContainer = (math: MathItem<any, any, any>, doc: MathDocument<any, any, any>) => {
    const tag = "span";
    const spanClass = math.display ? "span-block-equation" : "span-inline-equation";
    const cls = math.display ? "block-equation" : "inline-equation";
    math.typesetRoot.className = cls;
    math.typesetRoot.setAttribute(MJX_DATA_FORMULA, math.math);
    math.typesetRoot.setAttribute(MJX_DATA_FORMULA_TYPE, cls);
    math.typesetRoot = doc.adaptor.node(tag, {class: spanClass, style: "cursor:pointer"}, [math.typesetRoot]);
  }

  const handleUpdateMathjax = throttle(updateMathjax, THROTTLE_MATHJAX_TIME);

  const setActive = (type: 'text' | 'preview') => {
    active.current = type;
  }

  const handleScroll = () => {
    const editor = codeMirror.current.editor
    const previewDom = previewContainer.current;
    const cmData = editor.getScrollInfo();
    const editorToTop = cmData.top;
    const editorScrollHeight = cmData.height - cmData.clientHeight;

    if (editor && previewDom) {
      const scale =
        (editorScrollHeight) / (previewDom.scrollHeight - previewDom.offsetHeight);
      if (active.current === 'text') {
        previewDom.scrollTop = editorToTop / scale;
      }
      if (active.current === 'preview') {
        editor.scrollTo(null, previewDom.scrollTop * scale);
      }
      // let scrollTop = 0;
      // if (active.current === 'text') {
      //   scrollTop = textareaDom.scrollTop || 0;
      // } else if (active.current === 'preview') {
      //   scrollTop = previewDom.scrollTop || 0;
      // }
      // dispatch({ scrollTop });
    }
  };

  const toolBarProps = {
    editor: markdownEditor,
    preview: previewContainer.current,
    container: container.current,
    containerEditor: editorContainer.current,
    editorProps: props,
  };
  return (
    <div className={`${prefixCls} wmde-markdown-var`} ref={container}>
      <div className={`${prefixCls}-toolbar-container`}>
        <ToolBar {...toolBarProps} toolbars={toolbars} />
        <ToolBar {...toolBarProps} toolbars={toolbarsMode} mode />
      </div>
      <div className={`${prefixCls}-content`}>
        <div className={`${prefixCls}-content-editor`} ref={editorContainer} onMouseOver={() => setActive('text')}>
          {visibleEditor && (
            <CodeMirror
              {...codemirrorProps}
              ref={codeMirror}
              onScroll={handleScroll}
              onChange={(editor, data) => {
                const parseHtml = markdownParser.render(editor.getValue());
                setValue(parseHtml);
                setContent(editor.getValue());
                onChange && onChange(editor, data, editor.getValue());
              }}
            />
          )}
        </div>
        <div id={PREVIEW_ID} onMouseOver={() => setActive('preview')}>
          <MarkdownPreview
            {...previewProps}
            data-visible={!!visible}
            className={`${prefixCls}-preview`}
            onScroll={handleScroll}
            ref={(instance) => {
              if (instance && instance.mdp) {
                previewContainer.current = instance.mdp.current;
              }
            }}
            source={value}
          />
        </div>
      </div>
    </div>
  );
}
