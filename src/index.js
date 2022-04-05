// import * as React from "react";
// import * as ReactDOM from "react-dom";

// wrappers...
// import { BrowserRouter as Router } from "react-router-dom";
// import { AppContainer } from "react-hot-loader";

// import App from "./App";

// import "antd/dist/antd.less";
// import 'antd/dist/antd.css'

// 必须在这里先引入一下 否则antd的css reset会覆盖我们的

import * as React from "react";
import { render } from "react-dom";

import { createTheme, Theme } from '@/composables/theme'

import App from "./App";

// const root = document.createElement('div')
// document.body.appendChild(root)

// export interface ICreatorContext {
//   theme: Theme
//   language: string
//   userAgent: string
// }

render(<App />, document.getElementById("root"));
