import MarkdownIt from "markdown-it";
import markdownItDeflist from "markdown-it-deflist";
import markdownItImplicitFigures from "markdown-it-implicit-figures";
import markdownItTableOfContents from "markdown-it-table-of-contents";
import markdownItRuby from "markdown-it-ruby";
import { imageSize } from "@hedgedoc/markdown-it-image-size";

import markdownItMath from "./md-utils/markdown-it-math";
import markdownItSpan from "./md-utils/markdown-it-span";
import markdownItTableContainer from "./md-utils/markdown-it-table-container";
import markdownItLinkfoot from "./md-utils/markdown-it-linkfoot";
import markdownItImageFlow from "./md-utils/markdown-it-imageflow";
import markdownItMultiquote from "./md-utils/markdown-it-multiquote";
import highlightjs from "./md-utils/langHighlight";
import markdownItLiReplacer from "./md-utils/markdown-it-li";

export const updateMathjax = () => {
  window.MathJax.texReset();
  window.MathJax.typesetClear();
  window.MathJax.typesetPromise();
};

// 普通解析器，代码高亮用highlight
export const markdownParser: MarkdownIt = new MarkdownIt({
  html: true,
  highlight: (str, lang) => {
    if (lang === undefined || lang === "") {
      lang = "bash";
    }
    // 加上custom则表示自定义样式，而非微信专属，避免被remove pre
    if (lang && highlightjs.getLanguage(lang)) {
      try {
        const formatted = highlightjs
          .highlight(lang, str, true)
          .value.replace(/\n/g, "<br/>") // 换行用br表示
          .replace(/\s/g, "&nbsp;") // 用nbsp替换空格
          .replace(/span&nbsp;/g, "span "); // span标签修复
        return '<pre class="custom"><code class="hljs">' + formatted + "</code></pre>";
      } catch (e) {
        console.log(e);
      }
    }
    return '<pre class="custom"><code class="hljs">' + markdownParser.utils.escapeHtml(str) + "</code></pre>";
  },
});

markdownParser
  .use(markdownItSpan) // 在标题标签中添加span
  .use(markdownItTableContainer) // 在表格外部添加容器
  .use(markdownItMath) // 数学公式
  .use(markdownItLinkfoot) // 修改脚注
  .use(markdownItTableOfContents, {
    transformLink: () => "",
    includeLevel: [2, 3],
    markerPattern: /^\[toc\]/im,
  }) // TOC仅支持二级和三级标题
  .use(markdownItRuby) // 注音符号
  .use(markdownItImplicitFigures, {figcaption: true}) // 图示
  .use(markdownItDeflist) // 定义列表
  .use(markdownItLiReplacer) // li 标签中加入 p 标签
  .use(markdownItImageFlow) // 横屏移动插件
  .use(markdownItMultiquote) // 给多级引用加 class
  .use(imageSize);


export const addStyleLabel = (styleLabels: string[]) => {
  const add = (name: string) => {
    const style = document.createElement("style");
    style.id = name;
    const head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
  };
  styleLabels.forEach((name) => add(name));
};

export const replaceStyle = (id: string, css: string) => {
  const style = document.getElementById(id);
  try {
    style.innerHTML = css;
  } catch (e) {
    console.log(e);
    //@ts-ignore
    style.styleSheet.cssText = css;
  }
  const head = document.getElementsByTagName("head")[0];
  head.appendChild(style);
};