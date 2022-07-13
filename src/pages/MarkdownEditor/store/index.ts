import React from "react";
import { editorContentStore } from "./editor_content";


export const editorStores = {
  editorContentStore,
};

export const EditorStoreContext = React.createContext(editorStores)
export type IEditorStore = ReturnType<typeof useEditorStores>
export const useEditorStores = () => React.useContext(EditorStoreContext)