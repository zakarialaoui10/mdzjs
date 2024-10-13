import { smartJoin } from './smart-join.js';
import { jsx2js } from './jsx2js.js';
import { getComponentType } from './get-component-type.js';
import { parseMarkdown } from './parser-markdown.js';
function parseMDZ(markdown) {
    const { body, attributes } = parseMarkdown(markdown);
    let JSXIndexesBefore = [], JSXIndexesAfter = [];
    const Output = body.split("\n").filter((n) => n !== "");
    Output.filter((n, i) => {
      if (getComponentType(n) === "jsx") JSXIndexesBefore.push(i);
    });
    const JoinedTags = smartJoin(Output, JSXIndexesBefore);
    JoinedTags.filter((n, i) => {
      if (getComponentType(n) === "jsx") JSXIndexesAfter.push(i);
    });
    let components = [];
    JoinedTags.forEach((n, i) => {
      if (JSXIndexesAfter.includes(i)) components.push(jsx2js(n));
      else components.push(`HTMLWrapper("${n}")`);
    });
    return{
      components,
      attributes
    }
  }
export{
    parseMDZ
}