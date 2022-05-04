import MarkdownIt from "markdown-it";
import StateCore from "markdown-it/lib/rules_core/state_core";


function makeRule() {
  return function addTableContainer(state: StateCore) {
    var arr = [];
    for (var i = 0; i < state.tokens.length; i++) {
      var curToken = state.tokens[i];
      if (curToken.type === "table_open") {
        var tableContainerStart = new state.Token("html_inline", "", 0);
        tableContainerStart.content = `<section class="table-container">`;
        arr.push(tableContainerStart);
        arr.push(curToken);
      } else if (curToken.type === "table_close") {
        var tableContainerClose = new state.Token("html_inline", "", 0);
        tableContainerClose.content = `</section>`;
        arr.push(curToken);
        arr.push(tableContainerClose);
      } else {
        arr.push(curToken);
      }
    }
    state.tokens = arr;
  };
}

export default (md: MarkdownIt) => {
  md.core.ruler.push("table-container", makeRule());
};
