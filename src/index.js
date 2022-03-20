// import * as React from "react";
// import * as ReactDOM from "react-dom";

// wrappers...
// import { BrowserRouter as Router } from "react-router-dom";
// import { AppContainer } from "react-hot-loader";

// import App from "./App";

// import "antd/dist/antd.less";

// 必须在这里先引入一下 否则antd的css reset会覆盖我们的
// import { Button } from "antd";

import "./styles.less";

// const render = (Component: any) => {
//   ReactDOM.render(
//     <AppContainer>
//       <Router basename={location.pathname}>
//         <Component />
//       </Router>
//     </AppContainer>,
//     document.getElementById("root")
//   );
// };

// render(App);

// webpack Hot Module Replacement API
// if ((module as any).hot) {
//   (module as any).hot.accept("./App", () => {
//     render(App);
//   });
// }

import * as React from "react";
import { render } from "react-dom";
import App from "./App";

// const root = document.createElement('div')
// document.body.appendChild(root)

render(<App />, document.getElementById("root"));
