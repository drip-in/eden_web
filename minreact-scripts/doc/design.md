### 整体设计

- 以创建 react 脚手架为目的的 cli 工具, 计划支持 react-spa, react-mpa 和 react-ssr. 第一期计划支持 react-spa

- 要求可以一键唤起, 命令行互动式地创建脚手架项目

### 技术要求

- react 以及开发方面, 要求有(开发)hmr, (可选)react-router, redux

- 代码方面, 支持常见的 ts, test, lint, 常见的 loader, split chunk, code splitting(mpa),

### 具体实现

- 以 eden-common 脚手架为初始模板, 初始化 eslint, pre-commit-hook 等能力

- 以 npm 包的形式进行测试

### 参考资料

[Building command line tools with Node.js](https://developer.atlassian.com/blog/2015/11/scripting-with-node/)

### notes

- `package.json`中的`bin`字段
- `index.js`中的`shebang`指定 interpreter
- 目录下`npm install -g`以及`npm link`方便本地开发


- 目录规范化
 -- components
 -- pages
   -- Home
   -- About
     -- components
     -- index.tsx
     -- style.css/scss
 -- utils
 -- index.js

- 增加code-splitting - done
- redux去掉 - done
- 考察hmr的稳定性 - done
- sass loader - done
- css inline && splitting - done
- ts源文件 - WIP
- 参考cra - WIP