import { parseDocument } from 'htmlparser2';
import { cleanMD } from './clean.js';
import { splitBetween } from './utils/split-between.js';
import { isObject } from './utils/is-object.js';
const OPEN_SIGN = "\"EXP_START"
const CLOSE_SIGN = "EXP_END\""
function transformNode(node) {
  switch (node.type) {
    case 'text': {
      const text = node.data;
      const cleanedText = cleanMD(text, OPEN_SIGN, CLOSE_SIGN)
      const args = splitBetween(cleanedText, OPEN_SIGN, CLOSE_SIGN).map(({type, value})=>{
        if(type === "string") return `"${value}"`
        return value.slice(1,-1)
      })
      return args.length!==0 ? args : null;
    }
    case 'tag': {
      const tagName = node.rawTagName || node.name;
      const isJSXComponent = /^[A-Z]/.test(tagName);

      const attributes = node.attribs
        ? Object.entries(node.attribs)
            .map(([key, value]) => `${key}: ${
              isObject(value)
                ?value
                :(value.at(0)==="{")?value.slice(1,-1):'"'+value+'"'
              }`)
            .join(', ')
        : '';
      const childNodes = node.children
        .map(transformNode)
        .filter(Boolean)
        .join(', ');

      if (isJSXComponent) {
        if(node.children.length > 0) return `${tagName}({${attributes}}, ${childNodes})`
        return `${tagName}({${attributes}})`;
      } 
      else {
        if(node.children.length > 0) return `tag('${tagName}', {${attributes}}, ${childNodes})`;
        return `tag('${tagName}', {${attributes}})`
      }
    }
    default:
      return '';
  }
}



const html = `
<p ref="ll" id={m} ob={a:1}>Hi {exp} \\{</p>
<p ref="ll">{exp} \\{</p>
<p ref="ll" id={m} ob={a:1}>Hi {exp} \\{</p>
<p ref="ll">{exp} \\{</p>
<ZikoComp test=1>
<p> Hi </p>
</ZikoComp>
<Void />
`.trim();

const ast = parseDocument(html, { lowerCaseTags: false }); 

const transformedCode = ast.children
  .map(transformNode)
  .filter(Boolean) 
  // .join(', ');

console.log(transformedCode);
