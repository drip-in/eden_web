import * as React from "react";
import Body from './editor_body';
import Footer from './editor_footer';
import { useEffect, useRef, useState } from 'react';
import '@wcj/dark-mode';
import { useEditorStores } from './store';
import "./styles/mdMirror.css";
import styles from './index.module.scss';


export default function MDEditor() {
  const { editorContentStore } = useEditorStores();
  const { title, tags, content, releaseConfig } = editorContentStore;

  const onReleaseArticle = () => {
    
  }
  return (
    <div>
      <div className={styles.editor}>
        {/* <dark-mode light="Light" dark="Dart" style={{ position: 'fixed' }}></dark-mode> */}
        <Body />
        <Footer onReleaseArticle={onReleaseArticle} />
      </div>
    </div>
  );
}
