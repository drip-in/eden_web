export default `/*默认样式，最佳实践*/

/*全局属性*/
#eden {
  font-size: 16px;
  color: black;
  padding: 0 10px;
  line-height: 1.6;
  word-spacing: 0px;
  letter-spacing: 0px;
  word-break: break-word;
  word-wrap: break-word;
  text-align: left;
  -webkit-font-smoothing: antialiased;
  font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, 'PingFang SC', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  /* margin-top: -10px; 解决开头空隙过大问题*/
}

/*段落*/
#eden p {
  font-size: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin: 0;
  line-height: 26px;
  color: black;
}

/*标题*/
#eden h1,
#eden h2,
#eden h3,
#eden h4,
#eden h5,
#eden h6 {
  margin-top: 30px;
  margin-bottom: 15px;
  padding: 0px;
  font-weight: bold;
  color: black;
}
#eden h1 {
  font-size: 24px;
}
#eden h2 {
  font-size: 22px;
}
#eden h3 {
  font-size: 20px;
}
#eden h4 {
  font-size: 18px;
}
#eden h5 {
  font-size: 16px;
}
#eden h6 {
  font-size: 16px;
}

#eden h1 .prefix,
#eden h2 .prefix,
#eden h3 .prefix,
#eden h4 .prefix,
#eden h5 .prefix,
#eden h6 .prefix {
  display: none;
}

#eden h1 .suffix
#eden h2 .suffix,
#eden h3 .suffix,
#eden h4 .suffix,
#eden h5 .suffix,
#eden h6 .suffix {
  display: none;
}

/*列表*/
#eden ul,
#eden ol {
  margin-top: 8px;
  margin-bottom: 8px;
  padding-left: 25px;
  color: black;
}
#eden ul {
  list-style-type: disc;
}
#eden ul ul {
  list-style-type: square;
}

#eden ol {
  list-style-type: decimal;
}

#eden li section {
  margin-top: 5px;
  margin-bottom: 5px;
  line-height: 26px;
  text-align: left;
  color: rgb(1,1,1); /* 只要是纯黑色微信编辑器就会把color这个属性吞掉。。。*/
  font-weight: 500;
}

/*引用*/
#eden blockquote {
  border: none;
}

#eden .multiquote-1 {
  display: block;
  font-size: 0.9em;
  overflow: auto;
  overflow-scrolling: touch;
  border-left: 3px solid rgba(0, 0, 0, 0.4);
  background: rgba(0, 0, 0, 0.05);
  color: #6a737d;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 10px;
  margin-bottom: 20px;
  margin-top: 20px;
}

#eden .multiquote-1 p {
  margin: 0px;
  color: black;
  line-height: 26px;
}

#eden .multiquote-2 {
  box-shadow: 1px 1px 10px rgba(0,0,0,0.2);
  padding: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
}

#eden .multiquote-3 {
  box-shadow: 1px 1px 10px rgba(0,0,0,0.2);
  padding: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
}

#eden .multiquote-3 p {
  text-align: center;
}

#eden .multiquote-3 h3 {
  text-align: center;
}

#eden .table-of-contents a {
  border: none;
  color: black;
  font-weight: normal;
}

/*链接*/
#eden a {
  text-decoration: none;
  color: #1e6bb8;
  word-wrap: break-word;
  font-weight: bold;
  border-bottom: 1px solid #1e6bb8;
}

/*加粗*/
#eden strong {
  font-weight: bold;
  color: black;
}

/*斜体*/
#eden em {
  font-style: italic;
  color: black;
}

/*加粗斜体*/
#eden em strong {
  font-weight: bold;
  color: black;
}

/*删除线*/
#eden del {
  font-style: italic;
  color: black;
}

/*分隔线*/
#eden hr {
  height: 1px;
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
  border: none;
  border-top: 1px solid black;
}

/*代码块*/
#eden pre {
  margin-top: 10px;
  margin-bottom: 10px;
}
#eden pre code {
  display: -webkit-box;
  font-family: Operator Mono, Consolas, Monaco, Menlo, monospace;
  border-radius: 0px;
  font-size: 12px;
  -webkit-overflow-scrolling: touch;
}
#eden pre code span {
  line-height: 26px;
}

/*行内代码*/
#eden p code,
#eden li code {
  font-size: 14px;
  word-wrap: break-word;
  padding: 2px 4px;
  border-radius: 4px;
  margin: 0 2px;
  color: #1e6bb8;
  background-color: rgba(27,31,35,.05);
  font-family: Operator Mono, Consolas, Monaco, Menlo, monospace;
  word-break: break-all;
}

/*图片*/
#eden img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
}

/*图片*/
#eden figure {
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
}

/*图片描述文字*/
#eden figcaption {
  margin-top: 5px;
  text-align: center;
  color: #888;
  font-size: 14px;
}


/*表格容器 */
#eden .table-container{
  overflow-x: auto;
}

/*表格*/
#eden table {
  display: table;
  text-align: left;
}
#eden tbody {
  border: 0;
}

#eden table tr {
  border: 0;
  border-top: 1px solid #ccc;
  background-color: white;
}

#eden table tr:nth-child(2n) {
  background-color: #F8F8F8;
}

#eden table tr th,
#eden table tr td {
  font-size: 16px;
  border: 1px solid #ccc;
  padding: 5px 10px;
  text-align: left;
}

#eden table tr th {
  font-weight: bold;
  background-color: #f0f0f0;
}

/* 表格最小列宽4个汉字 */
#eden table tr th:nth-of-type(n),
#eden table tr td:nth-of-type(n){
  min-width:85px;
}

#eden .footnote-word {
  color: #1e6bb8;
  font-weight: bold;
}

#eden .footnote-ref {
  color: #1e6bb8;
  font-weight: bold;
}

#eden .footnote-item {
  display: flex;
}

#eden .footnote-num {
  display: inline;
  width: 10%; /*神奇，50px就不可以*/
  background: none;
  font-size: 80%;
  opacity: 0.6;
  line-height: 26px;
  font-family: ptima-Regular, Optima, PingFangSC-light, PingFangTC-light, 'PingFang SC', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

#eden .footnote-item p {
  display: inline;
  font-size: 14px;
  width: 90%;
  padding: 0px;
  margin: 0;
  line-height: 26px;
  color: black;
  word-break:break-all;
  width: calc(100%-50)
}

#eden sub, sup {
  line-height: 0;
}

#eden .footnotes-sep:before {
  content: "参考资料";
  display: block;
}

/* 解决公式问题 */
#eden .block-equation {
  display:block;
  text-align: center;
  overflow: auto;
  display: block;
  -webkit-overflow-scrolling: touch;
}

#eden .block-equation svg {
  max-width: 300% !important;
  -webkit-overflow-scrolling: touch;
}

#eden .inline-equation {
}

#eden .inline-equation svg {
}

#eden .imageflow-layer1 {
  margin-top: 1em;
  margin-bottom: 0.5em;
  white-space: normal;
  border: 0px none;
  padding: 0px;
  overflow: hidden;
}

#eden .imageflow-layer2 {
  white-space: nowrap;
  width: 100%;
  overflow-x: scroll;
}

#eden .imageflow-layer3 {
  display: inline-block;
  word-wrap: break-word;
  white-space: normal;
  vertical-align: middle;
  width: 100%;
}

#eden .imageflow-img {
  display: inline-block;
}

#eden .imageflow-caption {
  text-align: center;
  margin-top: 0px;
  padding-top: 0px;
  color: #888;
}

#eden .nice-suffix-juejin-container {
  margin-top: 20px !important;
}

#eden figure a {
  border: none;
}

#eden figure a img {
  margin: 0px;
}

#eden figure {
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 图片链接嵌套 */
#eden figure a {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 图片链接嵌套，图片解释 */
#eden figure a + figcaption {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: -35px;
  background: rgba(0,0,0,0.7);
  color: white;
  line-height: 35px;
  z-index: 20;
}

/* 容器块1 */
#eden .block-1 {
  display: block;
  background: rgb(250,250,250);
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
}

#eden .block-1 .multiquote-1 {
  border: none;
  background: white;
  box-shadow: 1px 1px 10px rgba(0,0,0,0.2);
}

/* 容器块2 */
#eden .block-2 {
  display: block;
  background: rgb(250,250,250);
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
}

#eden .block-2 h3 {
  text-align: center;
}

#eden .block-2 .multiquote-1 {
  border: none;
  background: white;
  box-shadow: 1px 1px 10px rgba(0,0,0,0.2);
  text-align: center;
}

/* 容器块3 */
#eden .block-3 {
  display: block;
  background: rgb(250,250,250);
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
}

#eden .block-3 h3 {
  text-align: right;
}

#eden .block-3 .multiquote-1 {
  border: none;
  background: white;
  box-shadow: 1px 1px 10px rgba(0,0,0,0.2);
  text-align: right;
}

/* 分列 */
#eden .column {
  display: flex
}

#eden .column .column-left {
  text-align: center;
  padding-right: 5px;
  width: 50%;
}

#eden .column .column-right {
  text-align: center;
  padding-left: 5px;
  width: 50%;
}
`;
